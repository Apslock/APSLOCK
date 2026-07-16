"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Layers, Lightbulb, TrendingUp, ShieldCheck, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/lib/data";

interface NavbarProps {
  links: NavLink[];
  siteName: string;
}

const expertiseItems = [
  {
    label: "Brand Foundations",
    description: "Name, voice, positioning — the backbone of every brand that lasts.",
    icon: Layers,
    href: "/expertise/brand-foundations",
  },
  {
    label: "Build & Innovation",
    description: "Websites and products built to perform, not just exist.",
    icon: Lightbulb,
    href: "/expertise/build-innovation",
  },
  {
    label: "Growth & Go-To-Market",
    description: "From launch to pipeline — strategy that turns interest into revenue.",
    icon: TrendingUp,
    href: "/expertise/growth-go-to-market",
  },
  {
    label: "Trust & Influence",
    description: "The authority that earns trust before the first meeting.",
    icon: ShieldCheck,
    href: "/expertise/trust-influence",
  },
];

export default function Navbar({ links, siteName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expertiseOpen, setExpertiseOpen] = useState(false);
  const [inFooter, setInFooter] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const footer = document.querySelector('footer[role="contentinfo"]');
      if (footer) {
        // Detect when the footer's top edge enters the navbar's area
        setInFooter(footer.getBoundingClientRect().top < 100);
      }
    };
    handleScroll(); // set initial state on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setExpertiseOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExpertiseOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const desktopLinks = links.filter((l) => l.href !== "/" && l.href !== "/contact");

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
        )}
      >
        {/* Premium Feathered Blur Visor — dynamically blurs content regardless of background color */}
        <div 
          className={cn(
            "hidden md:block absolute top-0 left-0 right-0 h-[100px] pointer-events-none transition-opacity duration-700 -z-10",
            scrolled && !inFooter ? "opacity-100" : "opacity-0"
          )}
          style={{
            backdropFilter: inFooter ? "none" : "blur(16px)",
            WebkitBackdropFilter: inFooter ? "none" : "blur(16px)",
            maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)"
          }}
        />

        {/* Mobile Top Bar */}
        <div className={cn(
          "md:hidden flex items-center justify-between h-18 px-6 transition-all duration-300",
          inFooter ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto",
          scrolled 
            ? cn(
                "bg-[var(--bg)]/95 border-b border-[var(--border)] shadow-sm",
                !inFooter && "backdrop-blur-lg"
              )
            : "bg-transparent"
        )}>
          <Link href="/" className="text-text font-wordmark font-bold text-xl tracking-tight">
            {siteName}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold tracking-wide bg-accent text-bg rounded-full active:scale-95 transition-all duration-300 shadow-sm"
          >
            Let&apos;s talk <span className="text-sm leading-none">↗</span>
          </Link>
        </div>

        {/* Desktop Morphing Nav Wrapper */}
        <div className={cn(
          "hidden md:flex justify-center w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none",
          scrolled ? "pt-5 px-6" : "pt-0 px-0"
        )}>
          <nav
            className={cn(
              "flex items-center justify-between w-full relative z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "max-w-4xl px-3 py-2.5" : "max-w-[100vw] px-8 py-6",
              inFooter ? "pointer-events-none" : "pointer-events-auto"
            )}
            style={scrolled ? {
              clipPath: inFooter
                ? "inset(0 50% 0 50% round 9999px)"
                : "inset(0 0% 0 0% round 9999px)",
            } : undefined}
            aria-label="Main navigation"
          >
          {/* Smooth Glass Background (GPU Accelerated) */}
          <div
            className={cn(
              "absolute inset-0 -z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled
                ? cn(
                    "rounded-full border border-[var(--border)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.2)] opacity-100",
                    inFooter ? "bg-[var(--bg)]/85" : "bg-[var(--bg)]/85 backdrop-blur-xl"
                  )
                : "rounded-none bg-transparent border-transparent shadow-none opacity-0"
            )}
          />

          {/* Desktop Logo */}
          <Link
            href="/"
            className="pl-3 text-text font-wordmark font-black text-2xl tracking-tighter hover:text-accent transition-colors duration-200 uppercase"
          >
            {siteName}
          </Link>

          {/* Center Links Pill */}
          <ul className="flex items-center gap-1 px-3 py-1.5 rounded-full relative z-10">
            <div 
              className={cn(
                "absolute inset-0 -z-10 rounded-full transition-all duration-700",
                scrolled ? "bg-[var(--text)]/[0.04] border border-[var(--text)]/[0.04] opacity-100" : "opacity-0"
              )} 
            />
            {desktopLinks.map((link) => {
              const active = isActive(link.href);

              if (link.href === "/expertise") {
                return (
                  <li
                    key={link.href}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setExpertiseOpen(true)}
                    onMouseLeave={() => setExpertiseOpen(false)}
                  >
                    <Link
                      href="/expertise"
                      aria-current={active ? "page" : undefined}
                      aria-haspopup="menu"
                      aria-expanded={expertiseOpen}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-[14px] font-medium rounded-full transition-all duration-200",
                        active
                          ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                          : "text-text hover:bg-[var(--text)]/10"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        strokeWidth={1.8}
                        className={cn("transition-transform duration-200", expertiseOpen && "rotate-180")}
                      />
                    </Link>

                    {/* Dropdown Panel */}
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-150 origin-top",
                        expertiseOpen
                          ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
                          : "opacity-0 scale-95 pointer-events-none -translate-y-1"
                      )}
                    >
                      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)]/97 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm">
                          <div className="grid w-[min(520px,calc(100vw-48px))] grid-cols-2 gap-1">
                            <div className="flex flex-col gap-0.5">
                              {expertiseItems.slice(0, 2).map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setExpertiseOpen(false)}
                                    role="menuitem"
                                    className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-[var(--text)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                  >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[7px] border border-[var(--border)] bg-[var(--text)]/[0.04] shadow-sm">
                                      <Icon className="h-[18px] w-[18px] text-text" strokeWidth={1.5} aria-hidden="true" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                      <span className="text-[14px] font-medium text-text leading-snug">{item.label}</span>
                                      <span className="mt-0.5 text-[12px] font-normal leading-snug text-text-muted">{item.description}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {expertiseItems.slice(2, 4).map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setExpertiseOpen(false)}
                                    role="menuitem"
                                    className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-[var(--text)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                  >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[7px] border border-[var(--border)] bg-[var(--text)]/[0.04] shadow-sm">
                                      <Icon className="h-[18px] w-[18px] text-text" strokeWidth={1.5} aria-hidden="true" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                      <span className="text-[14px] font-medium text-text leading-snug">{item.label}</span>
                                      <span className="mt-0.5 text-[12px] font-normal leading-snug text-text-muted">{item.description}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <Link
                          href="/contact"
                          onClick={() => setExpertiseOpen(false)}
                          role="menuitem"
                          className="mt-1.5 mb-0.5 mx-0.5 flex items-center gap-2 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-text transition-colors hover:bg-[var(--text)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                        >
                          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" strokeWidth={1.8} />
                          Let&apos;s Talk
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-4 py-2 text-[14px] font-medium rounded-full transition-all duration-200",
                      active
                        ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                        : "text-text hover:bg-[var(--text)]/10"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right CTA */}
          <div className="pr-1">
            <Link
              href="/contact"
              aria-current={isActive("/contact") ? "page" : undefined}
              className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-bold tracking-wide bg-accent text-bg rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
            >
              Let&apos;s talk <span className="text-lg leading-none">↗</span>
            </Link>
          </div>
        </nav>
        </div>
      </header>

      {/* ── Mobile Floating Menu Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "md:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90",
          inFooter ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        style={{ backgroundColor: "var(--text)", color: "var(--bg)", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
      >
        <div className="transition-transform duration-300" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
          {isOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        </div>
      </button>

      {/* ── Mobile Full-Screen Menu Overlay ── */}
      <div
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-[55] md:hidden flex flex-col",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"
        )}
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center px-6 h-18">
          <Link href="/" className="text-text font-wordmark font-bold text-xl tracking-tight" onClick={() => setIsOpen(false)}>
            {siteName}
          </Link>
        </div>

        <ul className="flex flex-col items-start gap-1 px-6 pt-4 flex-1">
          {links.map((link, i) => {
            const active = isActive(link.href);
            return (
              <li key={link.href} className="w-full overflow-hidden">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block py-3 text-2xl font-display transition-colors duration-200 border-b border-border-light",
                    active ? "text-accent" : "text-text hover:text-accent"
                  )}
                  style={{
                    transform: isOpen ? "translateY(0)" : "translateY(100%)",
                    opacity: isOpen ? 1 : 0,
                    transition: `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${isOpen ? i * 0.05 + 0.1 : 0}s, opacity 0.4s ease ${isOpen ? i * 0.05 + 0.1 : 0}s`,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-6 pb-24">
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center w-full px-6 py-3.5 text-base font-medium bg-accent text-bg rounded-full hover:bg-accent-hover transition-colors duration-200"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </>
  );
}
