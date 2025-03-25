"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SiteFooter } from "@/components/site-footer"
import {
  Loader2,
  Send,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Info,
  FileQuestion,
  Briefcase,
  Award,
  GraduationCap,
  MessageSquare,
  Star,
  FileDown,
  FileIcon as FilePdf,
  Building,
  History,
  User,
  Sparkles,
  CheckCircle,
  Eye,
  HelpCircle,
  Search,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react"

export default function AIGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [proofreadContent, setProofreadContent] = useState("")
  const [isProofreading, setIsProofreading] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [darkMode, setDarkMode] = useState(false)
  const [formData, setFormData] = useState({
    criteriaQuestion: "",
    jobTitle: "",
    experience: "1-3",
    skills: "",
    achievements: "",
    education: "",
    currentEmployer: "",
    previousEmployer: "",
    candidateName: "",
    candidateStrengths: "",
    format: "standard",
    tone: "professional",
    useStar: false,
    humanize: false,
  })

  const responseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (generatedContent) {
      // Calculate word count
      const words = generatedContent.trim().split(/\s+/).filter(Boolean).length
      setWordCount(words)

      // Calculate character count
      setCharCount(generatedContent.length)
    } else {
      setWordCount(0)
      setCharCount(0)
    }
  }, [generatedContent])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const generateResponse = async () => {
    setIsGenerating(true)
    setGeneratedContent("")
    setProofreadContent("")
    setError("")

    try {
      // Build the prompt for OpenAI
      const formatInstruction = formData.useStar
        ? "Use the STAR (Situation, Task, Action, Result) format."
        : "Use a standard paragraph format with clear examples."

      const humanizeInstruction = formData.humanize
        ? "Make the response sound natural and conversational, as if written by a human. Vary sentence structure and use a more personal tone."
        : "Keep the response professional and structured."

      const prompt = `
        Create a detailed selection criteria response for the following:
        
        Selection Criteria: ${formData.criteriaQuestion}
        Job Title: ${formData.jobTitle}
        Years of Experience: ${formData.experience}
        Key Skills: ${formData.skills}
        Notable Achievements: ${formData.achievements}
        Education/Qualifications: ${formData.education}
        Current Employer: ${formData.currentEmployer || "Not specified"}
        Previous Employer: ${formData.previousEmployer || "Not specified"}
        Candidate First Name: ${formData.candidateName || "Not specified"}
        Candidate Strengths: ${formData.candidateStrengths || "Not specified"}
        
        Format: ${formatInstruction}
        Tone: ${formData.tone}
        Style: ${humanizeInstruction}
        
        Make the response specific, detailed, and focused on demonstrating how the candidate meets the selection criteria.
        Include concrete examples and quantifiable results where possible.
        If current or previous employer is specified, include relevant experience from these organizations.
        If candidate name is specified, personalize the response appropriately.
      `

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      // Parse the response as text first to debug
      const responseText = await response.text()

      let data
      try {
        // Try to parse the response text as JSON
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText)
        throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate response")
      }

      setGeneratedContent(data.content || "")
    } catch (error) {
      console.error("Error generating response:", error)
      setError(error instanceof Error ? error.message : "An error occurred while generating your response")
    } finally {
      setIsGenerating(false)
    }
  }

  const proofreadResponse = async () => {
    if (!generatedContent) return

    setIsProofreading(true)

    try {
      const prompt = `
        Proofread and improve the following selection criteria response. 
        Fix any grammatical errors, improve clarity, and enhance the overall quality.
        Make it more compelling and persuasive without changing the core content.
        
        ${generatedContent}
      `

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const responseText = await response.text()

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText)
        throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to proofread response")
      }

      setProofreadContent(data.content || "")
    } catch (error) {
      console.error("Error proofreading response:", error)
      setError(error instanceof Error ? error.message : "An error occurred while proofreading your response")
    } finally {
      setIsProofreading(false)
    }
  }

  const copyToClipboard = (content: string) => {
    if (content) {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 2000)
        })
        .catch((err) => console.error("Failed to copy text:", err))
    }
  }

  const downloadAsWord = (content: string) => {
    if (content) {
      const blob = new Blob([content], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "selection_criteria_response.docx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const downloadAsPdf = (content: string) => {
    if (content) {
      // In a real implementation, you would use a library like jsPDF
      // For now, we'll create a simple text file with a .pdf extension
      const blob = new Blob([content], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "selection_criteria_response.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const resetForm = () => {
    setFormData({
      criteriaQuestion: "",
      jobTitle: "",
      experience: "1-3",
      skills: "",
      achievements: "",
      education: "",
      currentEmployer: "",
      previousEmployer: "",
      candidateName: "",
      candidateStrengths: "",
      format: "standard",
      tone: "professional",
      useStar: false,
      humanize: false,
    })
    setGeneratedContent("")
    setProofreadContent("")
    setError("")
  }

  const InfoTooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-1">
      <Info className="w-4 h-4 text-gray-400 cursor-help" />
      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-48 z-10">
        {text}
        <div className="absolute top-full left-0 w-2 h-2 bg-black transform rotate-45 -mt-1"></div>
      </div>
    </div>
  )

  const renderPreviewTab = () => <div className="prose prose-sm max-w-none whitespace-pre-line">{generatedContent}</div>

  const renderHelpCenterTab = () => (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search examples and guides"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">Learn to write a cover letter.</h2>
        <p className="text-lg text-gray-600">Everything you need to know to create your best cover letter yet.</p>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-6 flex items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Getting Started</h3>
            <p className="text-gray-600 mb-4">
              Don't know where to begin?
              <br />
              Try here.
            </p>
            <a href="#" className="text-red-500 flex items-center hover:underline">
              View Guides <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="ml-4">
            <div className="w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="#FFD1D1" stroke="#FF6B6B" strokeWidth="4" />
                <path
                  d="M50,20 C32,20 20,35 20,50"
                  stroke="#FF6B6B"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 flex items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Cover Letter Examples</h3>
            <p className="text-gray-600 mb-4">Cover letter examples for any profession.</p>
            <a href="#" className="text-red-500 flex items-center hover:underline">
              View Examples <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="ml-4">
            <div className="w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="20" y="20" width="15" height="60" fill="#D1E5FF" stroke="#4A7AFF" strokeWidth="2" />
                <rect x="40" y="30" width="15" height="50" fill="#D1E5FF" stroke="#4A7AFF" strokeWidth="2" />
                <rect x="60" y="10" width="15" height="70" fill="#D1E5FF" stroke="#4A7AFF" strokeWidth="2" />
                <circle cx="47" cy="40" r="8" fill="#FF6B6B" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"} flex flex-col`}>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">AI Selection Criteria Generator</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Questionnaire Section - 40% */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center uppercase text-black dark:text-white">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Selection Criteria Questionnaire
            </h2>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 thin-scrollbar">
              <div>
                <label
                  htmlFor="criteriaQuestion"
                  className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                >
                  <FileQuestion className="w-4 h-4 mr-2 text-blue-500" />
                  Selection Criteria Question*
                  <InfoTooltip text="Enter the selection criteria question you need to respond to" />
                </label>
                <textarea
                  id="criteriaQuestion"
                  name="criteriaQuestion"
                  value={formData.criteriaQuestion}
                  onChange={handleInputChange}
                  placeholder="e.g., Demonstrated ability to work effectively in a team environment"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm h-24"
                  required
                />
              </div>

              {/* STAR Format */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center justify-between uppercase">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-blue-500" />
                    STAR Format{" "}
                    <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">
                      (Situation, Task, Action, Result)
                    </span>
                    <InfoTooltip text="STAR format helps structure your response with a clear Situation, Task, Action, Result" />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="useStar" className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="useStar"
                        name="useStar"
                        className="sr-only"
                        checked={formData.useStar}
                        onChange={handleToggleChange}
                      />
                      <div
                        className={`w-10 h-5 rounded-full transition-colors ${formData.useStar ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.useStar ? "translate-x-5" : "translate-x-0"}`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </label>
              </div>

              {/* Tone */}
              <div>
                <label
                  htmlFor="tone"
                  className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                  Tone
                  <InfoTooltip text="Choose the writing style for your response" />
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="professional">Professional</option>
                  <option value="confident">Confident</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              {/* Humanize Toggle */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center justify-between uppercase">
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    Humanize Content
                    <InfoTooltip text="Make the response sound more natural and conversational, as if written by a human" />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="humanize" className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="humanize"
                        name="humanize"
                        className="sr-only"
                        checked={formData.humanize}
                        onChange={handleToggleChange}
                      />
                      <div
                        className={`w-10 h-5 rounded-full transition-colors ${formData.humanize ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.humanize ? "translate-x-5" : "translate-x-0"}`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </label>
              </div>

              {/* Job Title and Experience on same line */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                  >
                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                    Job Title*
                    <InfoTooltip text="Enter the job position you're applying for" />
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Project Manager, Software Developer"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Years of Experience
                    <InfoTooltip text="Select your years of relevant work experience" />
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              {/* Current and Previous Employer on same line */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="currentEmployer"
                    className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                  >
                    <Building className="w-4 h-4 mr-2 text-blue-500" />
                    Current Employer
                    <InfoTooltip text="Enter your current employer's name" />
                  </label>
                  <input
                    type="text"
                    id="currentEmployer"
                    name="currentEmployer"
                    value={formData.currentEmployer}
                    onChange={handleInputChange}
                    placeholder="e.g., Acme Corporation"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="previousEmployer"
                    className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                  >
                    <History className="w-4 h-4 mr-2 text-blue-500" />
                    Previous Employer
                    <InfoTooltip text="Enter your previous employer's name" />
                  </label>
                  <input
                    type="text"
                    id="previousEmployer"
                    name="previousEmployer"
                    value={formData.previousEmployer}
                    onChange={handleInputChange}
                    placeholder="e.g., XYZ Company"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Candidate First Name */}
              <div>
                <label
                  htmlFor="candidateName"
                  className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                >
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Candidate First Name
                  <InfoTooltip text="Enter your first name to personalize the response" />
                </label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  placeholder="e.g., John"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                >
                  <Award className="w-4 h-4 mr-2 text-blue-500" />
                  Key Skills (comma separated)
                  <InfoTooltip text="List relevant skills for the position" />
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., Project Management, Stakeholder Communication, Agile Methodologies"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="achievements"
                  className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 15l-2-5 5-2-5-2 2-5-2 5-5 2 5 2-2 5z" />
                  </svg>
                  Notable Achievements
                  <InfoTooltip text="List your notable accomplishments relevant to this role" />
                </label>
                <textarea
                  id="achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  placeholder="e.g., Led a team of 5 to deliver a project under budget, Increased efficiency by 30%"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm h-20"
                />
              </div>

              <div>
                <label
                  htmlFor="education"
                  className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                >
                  <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                  Education/Qualifications
                  <InfoTooltip text="List your degrees, certifications, or other qualifications" />
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's in Business, PMP Certification"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Candidate Strengths */}
              <div>
                <label
                  htmlFor="candidateStrengths"
                  className="block text-sm font-medium text-black dark:text-white mb-1 flex items-center uppercase"
                >
                  <Award className="w-4 h-4 mr-2 text-blue-500" />
                  Candidate Strengths
                  <InfoTooltip text="List your key personal and professional strengths" />
                </label>
                <textarea
                  id="candidateStrengths"
                  name="candidateStrengths"
                  value={formData.candidateStrengths}
                  onChange={handleInputChange}
                  placeholder="e.g., Leadership, Problem-solving, Attention to detail, Communication"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm h-20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={generateResponse}
                  disabled={isGenerating || !formData.criteriaQuestion || !formData.jobTitle}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Generate Response
                    </>
                  )}
                </button>

                <button
                  onClick={resetForm}
                  className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-md transition-colors text-sm w-1/3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Response Section - 60% */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 uppercase text-black dark:text-white">Generated Response</h2>

              {/* Tab Navigation - Moved inside the response box */}
              <div className="flex mb-4">
                <div className="inline-flex rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center px-6 py-2 ${
                      activeTab === "preview"
                        ? "bg-white dark:bg-gray-800 text-red-500 border-b-2 border-red-500"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("help")}
                    className={`flex items-center px-6 py-2 ${
                      activeTab === "help"
                        ? "bg-white dark:bg-gray-800 text-red-500 border-b-2 border-red-500"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Help Center
                  </button>
                </div>
              </div>

              <div
                ref={responseRef}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[400px] mb-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto thin-scrollbar"
              >
                {activeTab === "help" ? (
                  renderHelpCenterTab()
                ) : error ? (
                  <div className="text-red-500 p-4">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                    <p className="mt-2 text-sm">Please check your OpenAI API key and try again.</p>
                  </div>
                ) : isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Generating your selection criteria response...</p>
                  </div>
                ) : generatedContent ? (
                  renderPreviewTab()
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <FileText className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-center">
                      Fill in the questionnaire and click "Generate Response" to create your selection criteria
                      response.
                    </p>
                  </div>
                )}
              </div>

              {/* Word and Character Count */}
              {generatedContent && activeTab === "preview" && (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-4 mb-4">
                  <span>Words: {wordCount}</span>
                  <span>Characters: {charCount}</span>
                </div>
              )}

              {generatedContent && activeTab === "preview" && (
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => copyToClipboard(generatedContent)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors text-sm"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadAsWord(generatedContent)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md transition-colors text-sm"
                  >
                    <FileDown className="w-4 h-4" />
                    Download as Word
                  </button>

                  <button
                    onClick={() => downloadAsPdf(generatedContent)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition-colors text-sm"
                  >
                    <FilePdf className="w-4 h-4" />
                    Download as PDF
                  </button>

                  <button
                    onClick={proofreadResponse}
                    disabled={isProofreading}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-md transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isProofreading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Proofreading...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Proofread & Enhance
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Proofread Section */}
              {proofreadContent && activeTab === "preview" && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3 flex items-center uppercase text-black dark:text-white">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Proofread Version
                  </h3>

                  <div className="border border-green-200 dark:border-green-900 rounded-lg p-4 bg-green-50 dark:bg-green-900/20 mb-4 overflow-y-auto max-h-[300px] thin-scrollbar">
                    <div className="prose prose-sm max-w-none whitespace-pre-line dark:prose-invert">
                      {proofreadContent}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => copyToClipboard(proofreadContent)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Proofread Version
                    </button>

                    <button
                      onClick={() => downloadAsWord(proofreadContent)}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md transition-colors text-sm"
                    >
                      <FileDown className="w-4 h-4" />
                      Download as Word
                    </button>

                    <button
                      onClick={() => downloadAsPdf(proofreadContent)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition-colors text-sm"
                    >
                      <FilePdf className="w-4 h-4" />
                      Download as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}

