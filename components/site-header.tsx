"use client"

import Link from "next/link"
import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="w-full bg-white py-4 border-b border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="flex items-center mb-4 md:mb-0">
          <div className="w-8 h-8 mr-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="2" />
              <path d="M50,5 L85,85 L15,85 Z" fill="none" stroke="black" strokeWidth="2" />
              <path d="M50,5 L50,95" fill="none" stroke="black" strokeWidth="2" />
              <path d="M15,50 L85,50" fill="none" stroke="black" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-lg font-medium">AI Selection Criteria</span>
        </Link>

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
      </div>
    </header>
  )
}

