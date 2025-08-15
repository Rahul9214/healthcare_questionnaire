"use client";

import React, { useState } from "react";
import QuestionnaireForm, { type FormData } from "../components/QuestionnaireForm";
import PrintView from "../components/PrintView";
import { Toaster } from "../components/ui/toaster";
import { toast } from "../hooks/use-toast";

export default function Page() {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [showPrintView, setShowPrintView] = useState(false)

  // Save data to localStorage in real time
  const saveToLocalStorage = (data: FormData) => {
    try {
      localStorage.setItem("questionnaire_response", JSON.stringify(data))
    } catch (err) {
      // fallback: ignore
    }
  }

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setShowPrintView(true)
    saveToLocalStorage(data)
    toast({
      title: "Submitted Successfully!",
      description: "Your healthcare questionnaire has been saved. Thank you for your valuable feedback.",
    })
  }

  const handleBackToForm = () => {
    setShowPrintView(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-accent-green-50 to-accent-red-50 watermark-bg">
      <Toaster />
      {!showPrintView ? (
        <QuestionnaireForm onSubmit={handleFormSubmit} />
      ) : (
        formData && <PrintView formData={formData} onBack={handleBackToForm} onPrint={handlePrint} />
      )}
    </div>
  )
}
