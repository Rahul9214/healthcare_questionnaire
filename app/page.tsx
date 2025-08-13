"use client"

import { useState } from "react"
import QuestionnaireForm, { type FormData } from "../components/QuestionnaireForm"
import PrintView from "../components/PrintView"

export default function Page() {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [showPrintView, setShowPrintView] = useState(false)

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setShowPrintView(true)
  }

  const handleBackToForm = () => {
    setShowPrintView(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-accent-green-50 to-accent-red-50 watermark-bg">
      {!showPrintView ? (
        <QuestionnaireForm onSubmit={handleFormSubmit} />
      ) : (
        formData && <PrintView formData={formData} onBack={handleBackToForm} onPrint={handlePrint} />
      )}
    </div>
  )
}
