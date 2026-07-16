"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getConsent, setConsent } from "@/lib/cookies";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (getConsent() === null) setVisible(true);
  }, []);

  const accept = () => {
    setConsent("accepted");
    setVisible(false);
  };

  const decline = () => {
    setConsent("declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "110%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Cookie consent"
          aria-modal="false"
          className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-5"
        >
          <div className="max-w-5xl mx-auto bg-text text-bg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-bg/80">
                  <span className="font-semibold text-bg">APSLOCK uses cookies</span>{" "}
                  to understand how visitors use our site and to improve your
                  experience. Analytics cookies are only set with your consent.{" "}
                  <Link
                    href="/cookies"
                    className="underline underline-offset-2 text-bg hover:text-bg/70 transition-colors duration-150 whitespace-nowrap"
                  >
                    Cookie Policy
                  </Link>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={decline}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium rounded-full border border-bg/25 text-bg/70 hover:text-bg hover:border-bg/50 transition-colors duration-200"
                >
                  Decline
                </button>
                <button
                  onClick={accept}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold rounded-full bg-bg text-text hover:bg-bg/90 transition-colors duration-200"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
