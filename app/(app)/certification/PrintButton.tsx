"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-primary">
      <Download className="size-4" /> Print / Save as PDF
    </button>
  );
}
