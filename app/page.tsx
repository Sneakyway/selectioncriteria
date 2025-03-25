import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8f6f1] items-center overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-24 w-full max-w-5xl">
        <div>
          <div className="w-24 h-24 mx-auto mb-12">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="2" />
              <path d="M50,5 L85,85 L15,85 Z" fill="none" stroke="black" strokeWidth="2" />
              <path d="M50,5 L50,95" fill="none" stroke="black" strokeWidth="2" />
              <path d="M15,50 L85,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
          </div>

          {/* No sign-up badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <div className="w-5 h-5 mr-2 flex items-center justify-center bg-gray-200 rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">No sign-up. No credit card required</span>
            </div>
          </div>

          <h1 className="text-center font-bold text-5xl md:text-6xl tracking-tight text-[rgb(27,25,24)] mb-8">
            Master Your Selection
            <br />
            Criteria with AI
          </h1>

          <p className="text-center text-xl md:text-2xl mb-16">
            AI will craft the full selection criteria, perfect it, humanize the tone, and it's totally free of cost.
          </p>

          <div className="flex justify-center">
            <Link
              href="/ai-generator"
              className="bg-black text-white px-12 py-5 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started—It's free
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mb-6">
        <SiteFooter />
      </div>
    </main>
  )
}

