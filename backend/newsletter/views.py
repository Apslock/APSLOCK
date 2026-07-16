import os
import threading
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import Subscriber
from .serializers import SubscriberSerializer
from .throttles import NewsletterRateThrottle


def send_newsletter_emails(email, total_count):
    # Welcome email to subscriber
    try:
        send_mail(
            subject="Welcome to APSLOCK!",
            message=f"""Hey there,

You're now subscribed to APSLOCK updates!

You'll be the first to know about:
- New services and offerings
- Industry insights
- Case studies and success stories
- Exclusive tips for growing your business

We're glad to have you.

Talk soon,
Team APSLOCK
https://demo2-alpha-ivory.vercel.app
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        print(f"Newsletter welcome email sent to {email}")
    except Exception as e:
        print(f"Newsletter email error: {e}")

    # Notify owner
    try:
        notify_email = os.getenv('NOTIFY_EMAIL')
        if notify_email:
            send_mail(
                subject=f"New Subscriber: {email}",
                message=f"""New newsletter subscriber:

Email: {email}

Total active subscribers: {total_count}
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[notify_email],
                fail_silently=False,
            )
            print(f"Newsletter owner notification sent to {notify_email}")
    except Exception as e:
        print(f"Owner notification error: {e}")


class NewsletterView(APIView):
    throttle_classes = [NewsletterRateThrottle]

    def get(self, request):
        subscribers = Subscriber.objects.filter(is_active=True)
        serializer = SubscriberSerializer(subscribers, many=True)
        return Response(serializer.data)

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if already subscribed
        if Subscriber.objects.filter(email=email).exists():
            return Response(
                {"message": "You're already subscribed!"},
                status=status.HTTP_200_OK
            )

        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            total_count = Subscriber.objects.filter(is_active=True).count()

            # Fire emails in background thread
            thread = threading.Thread(
                target=send_newsletter_emails,
                args=(email, total_count)
            )
            thread.daemon = True
            thread.start()

            return Response(
                {"message": "Successfully subscribed!"},
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )