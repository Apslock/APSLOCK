"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Booking from "@/components/ui/booking";

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  bookingType?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<{
    type: string;
    date: Date;
    time: string;
  } | null>(null);
  const [successBooking, setSuccessBooking] = useState<{
    date: string;
    time: string;
    meetingLink: string | null;
  } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

    try {
      // 1. Submit contact lead
      const contactRes = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        }),
      });

      if (!contactRes.ok) {
        const errorData = await contactRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message. Please try again.");
      }

      // 2. If a booking slot was selected and confirmed, submit booking
      if (formData.scheduledDate && formData.scheduledTime) {
        // Format date: YYYY-MM-DD
        const year = formData.scheduledDate.getFullYear();
        const month = String(formData.scheduledDate.getMonth() + 1).padStart(2, "0");
        const day = String(formData.scheduledDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        // Format time: "9:00 AM" -> "09:00"
        const timeParts = formData.scheduledTime.split(" ");
        const timeVal = timeParts[0];
        const ampm = timeParts[1];
        let [hours, minutes] = timeVal.split(":");
        if (hours === "12") {
          hours = "00";
        }
        if (ampm === "PM") {
          hours = String(parseInt(hours, 10) + 12);
        }
        const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

        const bookingRes = await fetch(`${API_BASE_URL}/api/bookings/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: "",
            message: formData.message,
            date: formattedDate,
            start_time: formattedTime,
          }),
        });

        if (!bookingRes.ok) {
          const errorData = await bookingRes.json().catch(() => ({}));
          throw new Error(errorData.error || "Contact saved, but booking failed. Please refresh and try booking again.");
        }

        const bookingResData = await bookingRes.json();
        setSuccessBooking({
          date: bookingResData.date,
          time: bookingResData.time,
          meetingLink: bookingResData.meeting_link || null,
        });
      }

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBook = (data: { type: string; date: Date; time: string }) => {
    setBookingData(data);
    setFormData((prev) => ({
      ...prev,
      bookingType:    data.type,
      scheduledDate:  data.date,
      scheduledTime:  data.time,
    }));
  };

  if (submitted) {
    return (
      <div className={cn("text-center py-12 px-6 bg-surface border border-border rounded-2xl", className)}>
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent/10">
          <CheckCircle size={32} className="text-accent" />
        </div>
        <h3 className="text-2xl font-display text-text mb-3">
          Thank you for reaching out!
        </h3>
        <p className="text-text-muted max-w-md mx-auto mb-6">
          We&apos;ve received your message and will get back to you within one business day.
        </p>

        {successBooking && (
          <div className="max-w-md mx-auto p-5 bg-black/40 border border-white/5 rounded-xl text-left space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Consultation Scheduled
            </h4>
            <div className="text-sm text-text space-y-1">
              <p><span className="text-text-muted">Date:</span> {new Date(successBooking.date + "T00:00:00").toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><span className="text-text-muted">Time:</span> {successBooking.time} (IST)</p>
              {successBooking.meetingLink ? (
                <p>
                  <span className="text-text-muted">Google Meet:</span>{" "}
                  <a href={successBooking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent-hover transition-colors">
                    Join Meeting
                  </a>
                </p>
              ) : (
                <p className="text-text-muted text-xs italic mt-2">
                  * A calendar invitation with the Google Meet link has been sent to your email.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-6", className)}
      noValidate
    >
      {/* Name */}
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-text mb-2"
        >
          Name <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-3.5 text-base bg-surface border rounded-xl text-text placeholder:text-text-muted/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
            errors.name ? "border-red-400" : "border-border"
          )}
          placeholder="Your name"
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1.5" role="alert">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-text mb-2"
        >
          Email <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-3.5 text-base bg-surface border rounded-xl text-text placeholder:text-text-muted/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
            errors.email ? "border-red-400" : "border-border"
          )}
          placeholder="you@company.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1.5" role="alert">{errors.email}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label
          htmlFor="contact-company"
          className="block text-sm font-medium text-text mb-2"
        >
          Company
        </label>
        <input
          type="text"
          id="contact-company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3.5 text-base bg-surface border border-border rounded-xl text-text placeholder:text-text-muted/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          placeholder="Your company"
          autoComplete="organization"
        />
      </div>

      {/* Booking */}
      <Booking onBook={handleBook} />

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-text mb-2"
        >
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={cn(
            "w-full px-4 py-3.5 text-base bg-surface border rounded-xl text-text placeholder:text-text-muted/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-y",
            errors.message ? "border-red-400" : "border-border"
          )}
          placeholder="Tell us about your project..."
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1.5" role="alert">{errors.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium bg-accent text-white rounded-full hover:bg-accent-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <Send size={18} />
          </>
        )}
      </button>

      {submitError && (
        <p className="text-sm text-red-500 mt-2" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
