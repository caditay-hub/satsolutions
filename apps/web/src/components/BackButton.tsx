"use client";

import { useRouter } from "next/navigation";

export function BackButton({ label = "← Назад" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
      style={{ backgroundColor: "rgb(50 143 168)" }}
    >
      {label}
    </button>
  );
}

