"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/** Footer link to the coverage check of the plan the reader is in. */
export function CoverageLink({ className }: { className?: string }) {
  const singlePayer = usePathname()?.startsWith("/single-payer")
  return (
    <Link className={className} href={singlePayer ? "/single-payer/coverage" : "/coverage"}>
      {singlePayer ? "Coverage check (single-payer plan)" : "Coverage check"}
    </Link>
  )
}
