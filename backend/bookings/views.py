import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Availability, Booking
from .serializers import AvailabilitySerializer, BookingSerializer
from .google_calendar_service import GoogleCalendarService
from .email_service import EmailService
from datetime import datetime, time

FIXED_SLOTS = [
    (time(9, 0), time(9, 45)),
    (time(10, 0), time(10, 45)),
    (time(11, 0), time(11, 45)),
    (time(14, 0), time(14, 45)),
    (time(15, 0), time(15, 45)),
]


class BookedSlotsView(APIView):
    def get(self, request):
        booked = Availability.objects.filter(is_booked=True).values('date', 'start_time')
        result = [
            {
                "date": str(b['date']),
                "start_time": str(b['start_time'])[:5]  # "HH:MM"
            }
            for b in booked
        ]
        return Response(result)


class AvailabilityView(APIView):
    def get(self, request):
        slots = Availability.objects.filter(is_booked=False)
        serializer = AvailabilitySerializer(slots, many=True)
        return Response(serializer.data)


class BookingView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone', '')
        message = request.data.get('message', '')
        date_str = request.data.get('date')
        start_time_str = request.data.get('start_time')

        if not all([name, email, date_str, start_time_str]):
            return Response(
                {"error": "name, email, date and start_time are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            start_time = datetime.strptime(start_time_str, '%H:%M').time()
        except ValueError:
            return Response(
                {"error": "Invalid date or time format. Use YYYY-MM-DD and HH:MM."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find matching fixed slot for end_time
        end_time = None
        for s, e in FIXED_SLOTS:
            if s == start_time:
                end_time = e
                break

        if end_time is None:
            return Response(
                {"error": "Invalid time slot selected."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if already booked
        if Availability.objects.filter(date=booking_date, start_time=start_time, is_booked=True).exists():
            return Response(
                {"error": "This slot is already booked. Please choose another."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Auto-create the availability slot and mark as booked
        slot = Availability.objects.create(
            date=booking_date,
            start_time=start_time,
            end_time=end_time,
            is_booked=True
        )

        # Create Google Meet
        try:
            meet_link, event_id = GoogleCalendarService.create_meeting(
                booking_date=slot.date,
                start_time=slot.start_time,
                end_time=slot.end_time,
                attendee_name=name,
                attendee_email=email,
            )
        except Exception as e:
            # Release slot and return meaningful error
            slot.delete()
            return Response(
                {"error": f"Google Calendar authorization or event creation failed: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # Save booking
        booking = Booking.objects.create(
            availability=slot,
            name=name,
            email=email,
            phone=phone,
            message=message,
            meeting_link=meet_link or '',
            status='confirmed'
        )

        # Send confirmation and notification emails
        EmailService.send_booking_confirmation(booking, slot, meet_link)

        return Response(
            {
                "message": "Consultation booked successfully!",
                "meeting_link": meet_link,
                "date": str(slot.date),
                "time": str(slot.start_time)[:5]
            },
            status=status.HTTP_201_CREATED
        )