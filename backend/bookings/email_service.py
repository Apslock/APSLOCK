import os
import threading
from django.core.mail import EmailMessage
from django.conf import settings
from .calendar_invite import generate_ics

class EmailService:
    @staticmethod
    def send_booking_emails_task(booking, slot, meet_link, ics_content):
        # 1. Send confirmation email to customer
        try:
            email = EmailMessage(
                subject="Your APSLOCK Consultation is Confirmed!",
                body=f"""Hi {booking.name},

Your free consultation call with APSLOCK is confirmed!

Details:
─────────────────────────────
Date:       {slot.date.strftime('%A, %d %B %Y')}
Time:       {slot.start_time.strftime('%I:%M %p')} IST
Duration:   45 minutes
Meet Link:  {meet_link or 'Will be sent shortly'}
─────────────────────────────

What to expect:
- Our team will understand your requirements
- We'll show you exactly how we can help
- Completely free, no obligations

The calendar invite is attached to this email.

See you on the call!
Team APSLOCK
https://demo2-alpha-ivory.vercel.app
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[booking.email],
            )
            if ics_content:
                email.attach('consultation.ics', ics_content, 'text/calendar')
            email.send()
            print(f"Confirmation email sent to {booking.email}")
        except Exception as e:
            print(f"Customer confirmation email error: {e}")

        # 2. Send notification email to APSLOCK
        try:
            email_notify = EmailMessage(
                subject=f"New Booking: {booking.name}",
                body=f"""New consultation booking:

Name:     {booking.name}
Email:    {booking.email}
Phone:    {booking.phone or 'N/A'}
Date:     {slot.date.strftime('%A, %d %B %Y')}
Time:     {slot.start_time.strftime('%I:%M %p')} IST
Message:  {booking.message or 'N/A'}
Meet:     {meet_link or 'N/A'}
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[os.getenv('NOTIFY_EMAIL')],
            )
            email_notify.send()
            print(f"Notification email sent to {os.getenv('NOTIFY_EMAIL')}")
        except Exception as e:
            print(f"APSLOCK notification email error: {e}")

    @staticmethod
    def send_booking_confirmation(booking, slot, meet_link):
        try:
            # Generate .ics
            ics_content = generate_ics(
                booking_date=slot.date,
                start_time=slot.start_time,
                end_time=slot.end_time,
                attendee_name=booking.name,
                attendee_email=booking.email,
                meet_link=meet_link or 'Link will be sent shortly'
            )
        except Exception as e:
            print(f"Failed to generate ICS file: {e}")
            ics_content = None

        # Fire emails in background thread to prevent API hanging
        thread = threading.Thread(
            target=EmailService.send_booking_emails_task,
            args=(booking, slot, meet_link, ics_content)
        )
        thread.daemon = True
        thread.start()
