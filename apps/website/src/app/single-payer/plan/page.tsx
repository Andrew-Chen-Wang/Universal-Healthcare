import { planIndexRoute } from "@website/lib/plan/views/plan-index"
import Link from "next/link"

function SinglePayerSummary() {
  return (
    <p className="mb-10 max-w-3xl text-foreground/80">
      The full national ledger for this alternative (what the country buys, who pays, and the
      one-time transition costs) is on{" "}
      <Link href="/single-payer" className="underline">
        Single payer, priced in full
      </Link>
      .
    </p>
  )
}

const route = planIndexRoute("single-payer", SinglePayerSummary)
export const metadata = { title: "Single-payer plan (alternative)" }
export default route.Page
