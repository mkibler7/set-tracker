"use client";

import React, { useEffect, useRef } from "react";

type FocusOverlayProps = {
  open: boolean;
  title?: string;
  onClose?: () => void; // optional (you can require cancel only if you want)
  children: React.ReactNode;
  maxWidthClassName?: string; // lets you reuse for other dialogs later
};

export default function FocusOverlay({
  open,
  onClose,
  children,
  maxWidthClassName = "max-w-xl",
}: FocusOverlayProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);

    // autofocus panel for better keyboard feel
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close overlay"
        onClick={() => onClose?.()}
        className="absolute inset-0 cursor-default bg-background/55 backdrop-blur-sm"
      />

      {/* Centered panel */}
      <div className="relative flex h-full w-full items-center justify-center px-4 py-6">
        {/* This inner wrapper handles small screens by allowing scroll */}
        <div className="max-h-full w-full overflow-y-auto py-8 sm:py-0">
          <div
            ref={panelRef}
            tabIndex={-1}
            className={[
              "mx-auto w-full",
              maxWidthClassName,
              "outline-none",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
