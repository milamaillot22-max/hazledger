import type { SVGProps } from "react";

/** Tooth icon drawn to match Lucide's 24px / 2px-stroke grid (Lucide has none). */
export function Tooth(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.5 3C5 3 3.5 5 3.5 7.5c0 2.5 1.2 4 1.7 6.5.6 3 1 7 2.8 7 1.4 0 1.6-2.4 2.2-4.4.4-1.3 1.2-1.6 1.8-1.6s1.4.3 1.8 1.6c.6 2 .8 4.4 2.2 4.4 1.8 0 2.2-4 2.8-7 .5-2.5 1.7-4 1.7-6.5C20.5 5 19 3 16.5 3c-2 0-2.8 1-4.5 1S9.5 3 7.5 3Z" />
    </svg>
  );
}
