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

    // [BACKEND PENDING] /api/contact — not yet implemented.
    // Currently shows success without sending any data.
    // Replace this block with:
    //   const controller = new AbortController();
    //   const timeout = setTimeout(() => controller.abort(), 8000);
    //   try {
    //     const res = await fetch('/api/contact', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(formData),
    //       signal: controller.signal,
    //     });
    //     clearTimeout(timeout);
    //     if (!res.ok) throw new Error('Failed to submit form');
    //     setSubmitted(true);
    //   } catch (err) {
    //     setSubmitError('Something went wrong. Please try emailing us directly.');
    //   } finally {
    //     setSubmitting(false);
    //   }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
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
      <div className={cn("text-center py-16", className)}>
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent/10">
          <CheckCircle size={32} className="text-accent" />
        </div>
        <h3 className="text-2xl font-display text-text mb-3">
          Thank you for reaching out
        </h3>
        <p className="text-text-muted max-w-md mx-auto">
          We&apos;ve received your message and will get back to you within one business day.
        </p>
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
