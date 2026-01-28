"use client";

import React, { useEffect, useRef, useState } from "react";

const editButtonBase =
  "block w-full px-3 py-2 text-left text-slate-100 hover:bg-slate-800";

const editButtonClass = `${editButtonBase} hover:text-primary`;
const deleteButtonClass = `${editButtonBase} hover:text-red-400`;

type SetActionsMenuProps = {
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export default function SetActionsMenu({
  onEdit,
  onCopy,
  onDelete,
}: SetActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-card/40 text-muted-foreground hover:bg-card/70"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Set actions"
      >
        ⋯
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-9 z-50 w-40 overflow-hidden rounded-md border border-border bg-background/95 shadow-lg backdrop-blur"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className={`${editButtonClass}`}
          >
            Edit
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onCopy();
            }}
            className={`${editButtonClass}`}
          >
            Copy set
          </button>

          <div className="h-px bg-border/70" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className={`${deleteButtonClass}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
