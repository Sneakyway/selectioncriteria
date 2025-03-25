import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full max-w-5xl mb-8">
      <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="flex items-center mb-4 md:mb-0">
          <div className="w-8 h-8 mr-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="2" />
              <path d="M50,5 L85,85 L15,85 Z" fill="none" stroke="black" strokeWidth="2" />
              <path d="M50,5 L50,95" fill="none" stroke="black" strokeWidth="2" />
              <path d="M15,50 L85,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-xl font-medium">Criteria Master</span>
        </Link>

        <div className="flex items-center space-x-8 mb-4 md:mb-0">
          <Link href="/" className="text-base hover:underline">
            Home
          </Link>
          <Link href="#" className="text-base hover:underline">
            About us
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="Facebook">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-400 transition-colors" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </Link>
          <Link href="#" className="text-gray-700 hover:text-pink-600 transition-colors" aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </Link>
          <Link href="#" className="text-gray-700 hover:text-blue-800 transition-colors" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>

        <Link
          href="/criteria"
          className="bg-[#1a1a1a] text-white px-6 py-2 rounded-md text-base font-medium hover:bg-black transition-colors mt-4 md:mt-0 md:ml-4"
        >
          Start Now
        </Link>
      </div>
    </footer>
  )
}

