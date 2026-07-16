"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookingData {
  type: string;
  date: Date;
  time: string;
}

interface BookingProps {
  onBook: (data: BookingData) => void;
  className?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIME_SLOTS: string[] = [
  "9:00 AM",  "10:00 AM", "11:00 AM",
  "2:00 PM",  "3:00 PM",
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  const startOfWeek = new Date(startDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  for (let i = 0; i < 6; i++) {
    const next = new Date(startOfWeek);
    next.setDate(startOfWeek.getDate() + i);
    days.push(next);
  }
  return days;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Booking({ onBook, className }: BookingProps) {
  const [isOpen, setIsOpen]               = useState(false);
  const [isConfirmed, setIsConfirmed]     = useState(false);
  const [currentDate, setCurrentDate]     = useState(new Date());
  const [selectedDate, setSelectedDate]   = useState<Date>(new Date());
  const [selectedTime, setSelectedTime]   = useState<string>(TIME_SLOTS[0]);

  const weekDays = getWeekDays(currentDate);
  const monthYear = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsConfirmed(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsConfirmed(false);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    setIsOpen(false);
    onBook({ type: "Booking", date: selectedDate, time: selectedTime });
  };

  const changeWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className={cn("space-y-4", className)}>

      {/* Label — matches ContactForm label style exactly */}
      <label className="block text-sm font-medium text-text">
        Book a slot
      </label>

      {/* ── Dropdown ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "w-full px-4 py-3.5 text-base bg-surface border rounded-xl text-text transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
            "flex items-center justify-between",
            isOpen ? "border-accent" : "border-border"
          )}
        >
          <span className={isConfirmed ? "text-text" : "text-text-muted/50"}>
            {isConfirmed
              ? `${selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${selectedTime}`
              : "Book a slot"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </motion.div>
        </button>
      </div>

      {/* ── Scheduler ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0      }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="w-full rounded-xl border border-border bg-surface p-5 space-y-5">

              {/* Week navigator */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">{monthYear}</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => changeWeek("prev")}
                    className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors text-text-muted hover:text-text"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeWeek("next")}
                    className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors text-text-muted hover:text-text"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day picker */}
              <div className="grid grid-cols-6 gap-1.5">
                {weekDays.map((day) => {
                  const isSelected = selectedDate.toDateString() === day.toDateString();
                  return (
                    <div key={day.toISOString()} className="flex flex-col items-center gap-1.5">
                      <span className="text-xs text-text-muted">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      >
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              layoutId="date-highlight"
                              className="absolute inset-0 rounded-lg bg-accent"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1,   opacity: 1 }}
                              exit={{   scale: 0.5, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                        </AnimatePresence>
                        <span
                          className={cn(
                            "relative z-10 font-medium",
                            isSelected ? "text-white" : "text-text hover:text-accent"
                          )}
                        >
                          {day.getDate()}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Time slots */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted">Atlanta Time (EST/EDT)</p>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className="relative flex items-center justify-center px-3 py-2 rounded-lg text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      >
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              layoutId="time-highlight"
                              className="absolute inset-0 rounded-lg bg-accent"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1,   opacity: 1 }}
                              exit={{   scale: 0.5, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                        </AnimatePresence>
                        <span
                          className={cn(
                            "relative z-10 font-medium",
                            isSelected ? "text-white" : "text-text-muted hover:text-text"
                          )}
                        >
                          {time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirmation line */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-text-muted">
                  ✓ Slot:{" "}
                  <span className="text-accent font-medium">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month:   "short",
                      day:     "numeric",
                    })}{" "}
                    at {selectedTime}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
