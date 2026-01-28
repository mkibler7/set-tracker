"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LogoutNavLink from "@/components/auth/LogoutNavLink";
import TitleIcon from "../icons/title-icon";

const navButtonBase =
  "block w-full px-3 py-2 text-left text-slate-100 hover:bg-slate-800";

const navButtonClass = `${navButtonBase} hover:text-primary`;
const logoutButtonClass = `${navButtonBase} hover:text-red-400`;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  // Close on click outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={rootRef} className="flex w-full items-center justify-between">
      <TitleIcon className="w-20 text-primary" />

      {/* Anchor wrapper */}
      <div className="relative">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="flex flex-col gap-[3px]">
            <span className="h-[2px] w-5 bg-slate-100" />
            <span className="h-[2px] w-5 bg-slate-100" />
            <span className="h-[2px] w-5 bg-slate-100" />
          </span>
        </button>

        {open && (
          <div
            className="
            absolute right-0 top-full mt-3 w-44
            rounded-md border border-slate-700 bg-slate-900 text-sm shadow-lg z-50
            overflow-hidden
          "
          >
            <Link
              href="/dashboard"
              onClick={close}
              className={`border-b border-slate-800 ${navButtonClass}`}
            >
              Dashboard
            </Link>
            <Link
              href="/dailylog"
              onClick={close}
              className={`border-b border-slate-800 ${navButtonClass}`}
            >
              Daily Log
            </Link>
            <Link
              href="/workouts"
              onClick={close}
              className={`border-b border-slate-800 ${navButtonClass}`}
            >
              Workouts
            </Link>
            <Link
              href="/exercises"
              onClick={close}
              className={`border-b border-slate-800 ${navButtonClass}`}
            >
              Exercises
            </Link>
            <Link
              href="/charts"
              onClick={close}
              className={`border-b border-slate-800 ${navButtonClass}`}
            >
              Charts
            </Link>
            <LogoutNavLink className={logoutButtonClass} />
          </div>
        )}
      </div>
    </div>
  );
}
