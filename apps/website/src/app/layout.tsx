import "./globals.css"
import { MobileNav, Sidebar } from "@website/components/site/sidebar"
import { SIDEBAR } from "@website/content/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google"

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
})
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
})
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Universal Healthcare: a costed plan for U.S. universal health care",
    template: "%s · Universal Healthcare",
  },
  description:
    "Every step, every trade-off, and every dollar of moving the United States to universal health care, built on CMS's 2024 National Health Expenditure data.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <MobileNav parts={SIDEBAR} />
        <div className="flex min-h-dvh">
          <Sidebar parts={SIDEBAR} />
          <main className="min-w-0 flex-1">
            {children}
            <footer className="mx-auto max-w-5xl border-t border-rule px-4 pt-6 pb-10 text-xs leading-relaxed text-muted-foreground sm:px-8">
              <nav className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <Link className="hover:text-foreground" href="/">
                  Overview & totals
                </Link>
                <Link className="hover:text-foreground" href="/inputs">
                  Every input number
                </Link>
                <Link className="hover:text-foreground" href="/coverage">
                  Coverage check
                </Link>
                <Link className="hover:text-foreground" href="/method">
                  Method
                </Link>
                <Link className="hover:text-foreground" href="/sources">
                  Sources
                </Link>
                <Link className="hover:text-foreground" href="/glossary">
                  Glossary
                </Link>
              </nav>
              Figures are in 2024 dollars, built on the CMS National Health Expenditure Accounts
              (released December 2025). Every number is computed from the inputs page; estimates
              carry stated ranges and confidence.
            </footer>
          </main>
        </div>
      </body>
    </html>
  )
}
