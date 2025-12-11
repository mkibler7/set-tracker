"use client";

import { useState } from "react";
import Link from "next/link";

const navButtonClass =
  "block px-3 py-2 text-slate-100 hover:bg-slate-800 hover:text-primary";

export default function MobileNavBar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800"
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        {/* simple hamburger icon */}
        <span className="flex flex-col gap-[3px]">
          <span className="h-[2px] w-5 bg-slate-100" />
          <span className="h-[2px] w-5 bg-slate-100" />
          <span className="h-[2px] w-5 bg-slate-100" />
        </span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-700 bg-slate-900  text-sm shadow-lg z-50 ">
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
          <Link href="/charts" onClick={close} className={`${navButtonClass}`}>
            Charts
          </Link>

          <div className="mt-1 border-t border-slate-800" />

          {/* <Link
            href="/login"
            onClick={close}
            className="block px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            Log in
          </Link> */}
        </div>
      )}
    </div>
  );
}
