"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "../hooks/use-toast";

type ServicesNeeded = {
  [key: string]: string;
};

export type FormData = {
  visited_doctor: string;
  no_visit_reasons: string[];
  services_needed: ServicesNeeded;
  use_wellness_centre: string;
  cghs_importance: string;
  wrong_treatment: string;
  wrong_treatment_details: string;
  blood_test_cost: string;
  generic_medicines: string;
  visit_hours: string[];
  health_sessions: string;
  health_topics: string;
  feedback: string;
  follow_up: string;
  phone: string;
  whatsapp: string;
  satisfaction: string;
  name: string;
  age: string;
  area: string;
  other_reason: string;
  gender: string;
  contact: string;
  address: string;
  emergency_contact: string;
  blood_group: string;
};

interface QuestionnaireFormProps {
  onSubmit: (data: FormData) => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    visited_doctor: "",
    no_visit_reasons: [],
    services_needed: {},
    use_wellness_centre: "",
    cghs_importance: "",
    wrong_treatment: "",
    wrong_treatment_details: "",
    blood_test_cost: "",
    generic_medicines: "",
    visit_hours: [],
    health_sessions: "",
    health_topics: "",
    feedback: "",
    follow_up: "",
    phone: "",
    whatsapp: "",
    satisfaction: "",
    name: "",
    age: "",
    area: "",
    other_reason: "",
    gender: "",
    contact: "",
    address: "",
    emergency_contact: "",
    blood_group: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (
    field: keyof FormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...((prev[field] as string[]) || []), value]
        : ((prev[field] as string[]) || []).filter(
            (item: string) => item !== value
          ),
    }));
  };

  const handleRankingChange = (service: string, rank: string) => {
    setFormData((prev) => ({
      ...prev,
      services_needed: {
        ...prev.services_needed,
        [service]: rank,
      },
    }));
  };

  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate mandatory personal info
    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.contact
    ) {
      setError("Please fill all mandatory personal information fields.");
      return;
    }
    if (
      !formData.address ||
      !formData.emergency_contact ||
      !formData.blood_group
    ) {
      setError(
        "Please fill all mandatory address, emergency contact, and blood group fields."
      );
      return;
    }
    setError("");

    // Prepare data for Supabase (serialize arrays/objects to JSON)
    const supabaseData = {
      ...formData,
      no_visit_reasons: JSON.stringify(formData.no_visit_reasons),
      services_needed: JSON.stringify(formData.services_needed),
      visit_hours: JSON.stringify(formData.visit_hours),
      visited_doctor: formData.visited_doctor,
      use_wellness_centre: formData.use_wellness_centre,
      cghs_importance: formData.cghs_importance,
      wrong_treatment: formData.wrong_treatment,
      wrong_treatment_details: formData.wrong_treatment_details,
      blood_test_cost: formData.blood_test_cost,
      generic_medicines: formData.generic_medicines,
      health_sessions: formData.health_sessions,
      health_topics: formData.health_topics,
      feedback: formData.feedback,
      follow_up: formData.follow_up,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      satisfaction: formData.satisfaction,
      other_reason: formData.other_reason,
    };

    // Check if supabase is configured
    if (!supabase) {
      toast({
        title: "Submission Failed",
        description:
          "Supabase is not configured. Please contact the administrator.",
        variant: "destructive",
      });
      setError("Supabase is not configured. Please contact the administrator.");
      return;
    }

    try {
      const { error } = await supabase
        .from("questionnaire_responses")
        .insert([supabaseData]);
      if (error) {
        toast({
          title: "Submission Failed",
          description:
            "There was an error saving your response. Please try again.",
          variant: "destructive",
        });
        setError("Failed to save response. Please try again.");
        return;
      }
      toast({
        title: "Submitted Successfully!",
        description:
          "Your healthcare questionnaire has been saved securely. Thank you for your valuable feedback.",
      });
      onSubmit(formData);
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "Unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setError("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-medical-100">
      <div className="container mx-auto px-2 py-4 max-w-4xl">
        <div className="form-container rounded-lg shadow-xl watermark-bg">
          <div className="text-center border-b border-healthcare-200 pb-4 mb-6">
            <img
              src="/images/ziagnosis-header.png"
              alt="Ziagnosis Wellness Clinic & Diagnostic Lab"
              className="w-full max-w-full mx-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-healthcare-700 mb-1">
              Preventive Healthcare & Wellness Centre
            </h1>
            <h2 className="text-lg font-semibold hindi-text text-healthcare-600 mb-3">
              निवारक स्वास्थ्य और कल्याण केंद्र
            </h2>
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-8 h-0.5 bg-healthcare-500 rounded-full"></div>
              <span className="text-sm font-medium text-healthcare-700">
                Patient Questionnaire / रोगी प्रश्नावली
              </span>
              <div className="w-8 h-0.5 bg-healthcare-500 rounded-full"></div>
            </div>
            <p className="text-xs text-medical-600 bg-healthcare-50 rounded-md p-2 border border-healthcare-200">
              (For OPD, Daycare, Super-speciality, Diagnostics, CGHS/CAPF and
              Generic Medicine support in Chhatarpur Area)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-healthcare-50 p-4 rounded-lg border-l-3 border-healthcare-500">
              <h3 className="text-sm font-semibold text-healthcare-700 mb-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-healthcare-500 rounded-full mr-2"></span>
                Purpose / उद्देश्य
              </h3>
              <p className="text-xs text-medical-700 mb-2 leading-relaxed">
                We want to understand local healthcare needs and improve
                services. Your answers will help set up reliable, affordable,
                and trustworthy care in Chhatarpur.
              </p>
              <p className="hindi-text text-xs text-medical-700 leading-relaxed">
                हम आपके इलाके की स्वास्थ्य ज़रूरतें समझना चाहते हैं ताकि
                Chhatarpur में भरोसेमंद और सस्ती सेवाएँ दी जा सकें।
              </p>
            </div>

            <div className="bg-warning-50 p-4 rounded-lg border-l-3 border-warning-500">
              <h3 className="text-sm font-semibold text-warning-800 mb-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full mr-2"></span>
                Instructions / निर्देश
              </h3>
              <ul className="space-y-1 text-xs text-medical-700">
                <li className="flex items-start">
                  <span className="text-warning-600 mr-1 text-xs">•</span>
                  Please answer honestly. / कृपया ईमानदारी से जवाब दें।
                </li>
                <li className="flex items-start">
                  <span className="text-warning-600 mr-1 text-xs">•</span>
                  All answers are confidential. / सभी उत्तर गोपनीय रखे जाएँगे।
                </li>
              </ul>
            </div>
          </div>

          {/* Mandatory Personal Information Section */}
          <div className="question-group print-avoid-break mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Personal Information{" "}
              <span className="text-red-600">(Required)</span> / व्यक्तिगत
              जानकारी
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Your name / आपका नाम <span className="text-red-600">*</span>
                    :
                  </span>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Age / आयु <span className="text-red-600">*</span>:
                  </span>
                  <input
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    required
                  />
                </label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Gender / लिंग <span className="text-red-600">*</span>:
                  </span>
                  <select
                    value={formData.gender || ""}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male / पुरुष</option>
                    <option value="female">Female / महिला</option>
                    <option value="other">Other / अन्य</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Contact Details <span className="text-red-600">*</span>:
                  </span>
                  <input
                    type="tel"
                    value={formData.contact || ""}
                    onChange={(e) =>
                      handleInputChange("contact", e.target.value)
                    }
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    required
                    placeholder="Phone or Email"
                  />
                </label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Address / पता <span className="text-red-600">*</span>:
                  </span>
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    required
                    placeholder="Full address"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Emergency Contact / आपातकालीन संपर्क{" "}
                    <span className="text-red-600">*</span>:
                  </span>
                  <input
                    type="tel"
                    value={formData.emergency_contact || ""}
                    onChange={(e) =>
                      handleInputChange("emergency_contact", e.target.value)
                    }
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    required
                    placeholder="Emergency phone number"
                  />
                </label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Blood Group / रक्त समूह{" "}
                    <span className="text-red-600">*</span>:
                  </span>
                  <select
                    value={formData.blood_group || ""}
                    onChange={(e) =>
                      handleInputChange("blood_group", e.target.value)
                    }
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Local area / स्थानीय क्षेत्र:
                  </span>
                  <input
                    type="text"
                    value={formData.area || ""}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                    placeholder="Locality or area"
                  />
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="text-red-600 font-semibold mb-2">{error}</div>
            )}
            {/* Question 1 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                1. Have you visited any trained doctor (MBBS/MD/MS/DM/MCh) in
                Chhatarpur in the last 12 months?
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                क्या आपने पिछले 12 महीनों में Chhatarpur में किसी प्रशिक्षित
                डॉक्टर (MBBS/MD/MS/DM/MCh) से इलाज कराया है?
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visited_doctor"
                    value="yes"
                    checked={formData.visited_doctor === "yes"}
                    onChange={(e) =>
                      handleInputChange("visited_doctor", e.target.value)
                    }
                    className="mr-3"
                  />
                  <span>Yes / हाँ</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visited_doctor"
                    value="no"
                    checked={formData.visited_doctor === "no"}
                    onChange={(e) =>
                      handleInputChange("visited_doctor", e.target.value)
                    }
                    className="mr-3"
                  />
                  <span>No / नहीं</span>
                </label>
              </div>
            </div>

            {/* Question 2 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                2. If NO, why? (Choose all that apply)
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                अगर नहीं, तो वजह क्या थी? (सभी लागू विकल्प चुनें)
              </p>
              <div className="space-y-2">
                {[
                  {
                    value: "no-trained-doctor",
                    label:
                      "No trained doctor nearby / पास प्रशिक्षित डॉक्टर नहीं",
                  },
                  {
                    value: "prefer-local",
                    label:
                      "Prefer local/quack because cheaper / सस्ता होने के कारण स्थानीय/क्वैक चुनते हैं",
                  },
                  {
                    value: "long-waiting",
                    label: "Long waiting / लम्बा इंतज़ार",
                  },
                  { value: "cost", label: "Cost of treatment / इलाज की लागत" },
                  {
                    value: "lack-awareness",
                    label: "Lack of awareness / जानकारी की कमी",
                  },
                ].map((option) => (
                  <label key={option.value} className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.no_visit_reasons?.includes(
                        option.value
                      )}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "no_visit_reasons",
                          option.value,
                          e.target.checked
                        )
                      }
                      className="mr-3 mt-1"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="block">
                  <span className="text-gray-700">
                    Other (please specify) / अन्य (कृपया बताएं):
                  </span>
                  <input
                    type="text"
                    value={formData.other_reason || ""}
                    onChange={(e) =>
                      handleInputChange("other_reason", e.target.value)
                    }
                    className="mt-1 block w-full"
                  />
                </label>
              </div>
            </div>

            {/* Question 3 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                3. Which services do you need most in your area? (Rank top 3)
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                आपके क्षेत्र में किन सेवाओं की सबसे ज़्यादा ज़रूरत है? (टॉप 3
                चुनें और क्रम दें)
              </p>
              <div className="space-y-3">
                {[
                  { value: "general-opd", label: "General OPD / सामान्य OPD" },
                  {
                    value: "daycare",
                    label:
                      "Daycare treatments (minor procedures) / डेकेयर ट्रीटमेंट (छोटी प्रक्रियाएँ)",
                  },
                  {
                    value: "super-speciality",
                    label:
                      "Super-speciality consultations (cardiology, neurology, etc.) / सुपर‑स्पेशलिटी परामर्श (हृदय, तंत्रिका आदि)",
                  },
                  {
                    value: "diagnostic",
                    label:
                      "Diagnostic lab & imaging (reliable tests) / डायग्नोस्टिक लैब और इमेजिंग (भरोसेमंद टेस्ट)",
                  },
                  {
                    value: "cghs-support",
                    label:
                      "CGHS / CAPF empanelment support / CGHS / CAPF सहायता",
                  },
                  {
                    value: "generic-medicines",
                    label: "Affordable generic medicines / सस्ती जेनेरिक दवाएँ",
                  },
                  {
                    value: "preventive-checkups",
                    label: "Preventive health checkups / निवारक स्वास्थ्य जांच",
                  },
                ].map((service) => (
                  <div
                    key={service.value}
                    className="flex items-center space-x-4"
                  >
                    <span className="flex-1">{service.label}</span>
                    <select
                      value={formData.services_needed?.[service.value] || ""}
                      onChange={(e) =>
                        handleRankingChange(service.value, e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Rank</option>
                      <option value="1">1st</option>
                      <option value="2">2nd</option>
                      <option value="3">3rd</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Question 4 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4. Would you use a local wellness centre if AIIMS-trained
                doctors and reliable diagnostics were available at affordable
                prices?
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                यदि AIIMS-प्रशिक्षित डॉक्टर और भरोसेमंद डायग्नोस्टिक सस्ती कीमत
                पर उपलब्ध हों, क्या आप स्थानीय वेलनेस सेंटर का उपयोग करेंगे?
              </p>
              <div className="space-y-2">
                {[
                  { value: "definitely", label: "Definitely / ज़रूर" },
                  { value: "maybe", label: "Maybe / शायद" },
                  {
                    value: "not-interested",
                    label: "Not interested / रुचि नहीं",
                  },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="useWellnessCentre"
                      value={option.value}
                      checked={formData.use_wellness_centre === option.value}
                      onChange={(e) =>
                        handleInputChange("use_wellness_centre", e.target.value)
                      }
                      className="mr-3"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 5 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                5. How important is having CGHS/CAPF empanelled services nearby
                for you or your family? (1 = Not important, 5 = Very important)
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                CGHS/CAPF सेवाएँ आपके लिए कितनी ज़रूरी हैं? (1 = बिल्कुल आवश्यक
                नहीं, 5 = बहुत ज़रूरी)
              </p>
              <div className="flex space-x-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="flex items-center">
                    <input
                      type="radio"
                      name="cghs_importance"
                      value={String(num)}
                      checked={formData.cghs_importance === String(num)}
                      onChange={(e) =>
                        handleInputChange("cghs_importance", e.target.value)
                      }
                      className="mr-2 h-4 w-4 border-gray-400 focus:ring-medical-500"
                    />
                    <span className="text-base">{num}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 6 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                6. Have you ever received wrong or unnecessary tests/treatments
                locally?
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                क्या आपको स्थानीय स्तर पर कभी गलत या अनावश्यक टेस्ट/इलाज मिला
                है?
              </p>
              <div className="flex flex-col space-y-2 mb-4">
                {[
                  { value: "yes-often", label: "Yes-often / हाँ-अक्सर" },
                  {
                    value: "yes-once-twice",
                    label: "Yes-once or twice / हाँ-एक / दो बार",
                  },
                  { value: "no", label: "No / नहीं" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="wrongTreatment"
                      value={option.value}
                      checked={formData.wrong_treatment === option.value}
                      onChange={(e) =>
                        handleInputChange("wrong_treatment", e.target.value)
                      }
                      className="mr-2 h-4 w-4 border-gray-400 focus:ring-medical-500"
                    />
                    <span className="text-base">{option.label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    If yes, please briefly explain / अगर हाँ, संक्षेप में बताएं:
                  </span>
                  <textarea
                    value={formData.wrong_treatment_details || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "wrong_treatment_details",
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full border-2 border-gray-300 rounded-md focus:border-medical-500 outline-none p-3"
                    rows={3}
                  />
                </label>
              </div>
            </div>

            {/* Question 7 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                7. What is an acceptable average cost for a routine blood test
                package (basic checkup) for families here?
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                यहाँ परिवार के लिए सामान्य ब्लड टेस्ट पैकेज की स्वीकार्य औसत
                लागत क्या है? (रु में)
              </p>
              <div className="space-y-2">
                {[
                  { value: "less-300", label: "Less than ₹300 / ₹300 से कम" },
                  { value: "300-600", label: "₹300-₹600" },
                  { value: "600-1000", label: "₹600-₹1000" },
                  {
                    value: "more-1000",
                    label: "More than ₹1000 / ₹1000 से अधिक",
                  },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="blood_test_cost"
                      value={option.value}
                      checked={formData.blood_test_cost === option.value}
                      onChange={(e) =>
                        handleInputChange("blood_test_cost", e.target.value)
                      }
                      className="mr-3"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 8 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                8. Would you prefer generic medicines dispensed at the centre
                (cheaper) if quality assured?
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                अगर गुणवत्तापूर्ण सुनिश्चित हो तो क्या आप सेंटर पर जेनेरिक
                दवाइयाँ लेना पसंद करेंगे (सस्ती होती हैं)?
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes / हाँ" },
                  { value: "no", label: "No / नहीं" },
                  { value: "unsure", label: "Unsure / निश्चित नहीं" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="genericMedicines"
                      value={option.value}
                      checked={formData.generic_medicines === option.value}
                      onChange={(e) =>
                        handleInputChange("generic_medicines", e.target.value)
                      }
                      className="mr-3"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 9 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                9. Which hours are best for you to visit the wellness centre?
                (Choose all that apply)
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                किस समय आप वेलनेस सेंटर आना पसंद करेंगे? (सभी लागू विकल्प चुनें)
              </p>
              <div className="space-y-2">
                {[
                  {
                    value: "morning",
                    label: "Morning (8am-12pm) / सुबह (8-12)",
                  },
                  {
                    value: "afternoon",
                    label: "Afternoon (12pm-4pm) / दोपहर (12-4)",
                  },
                  { value: "evening", label: "Evening (4pm-8pm) / शाम (4-8)" },
                  {
                    value: "weekend",
                    label:
                      "Weekend availability important / वीकेंड पर खुला होना ज़रूरी",
                  },
                ].map((option) => (
                  <label key={option.value} className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.visit_hours?.includes(option.value)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "visit_hours",
                          option.value,
                          e.target.checked
                        )
                      }
                      className="mr-3 mt-1"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 10 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                10. Would you like community health awareness sessions (free) on
                topics like diabetes, hypertension, women's health, child
                vaccination?
              </h3>
              <p className="hindi-text text-gray-700 mb-4">
                क्या आप मुफ्त सामुदायिक स्वास्थ्य जागरूकता सत्र चाहेंगे (शुगर,
                ब्लड प्रेशर, महिलाओं का स्वास्थ्य, बच्चों का टीकाकरण आदि)?
              </p>
              <div className="space-y-2 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="healthSessions"
                    value="yes"
                    checked={formData.health_sessions === "yes"}
                    onChange={(e) =>
                      handleInputChange("health_sessions", e.target.value)
                    }
                    className="mr-3"
                  />
                  <span>Yes / हाँ</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="healthSessions"
                    value="no"
                    checked={formData.health_sessions === "no"}
                    onChange={(e) =>
                      handleInputChange("health_sessions", e.target.value)
                    }
                    className="mr-3"
                  />
                  <span>No / नहीं</span>
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700">
                    Which topics interest you most? / किन विषयों में रुचि है?
                  </span>
                  <input
                    type="text"
                    value={formData.health_topics || ""}
                    onChange={(e) =>
                      handleInputChange("health_topics", e.target.value)
                    }
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-medical-500 outline-none py-2"
                  />
                </label>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-medical-700 mb-3">
                Feedback & Contact / सुझाव और संपर्क
              </h3>
              <div className="mb-4">
                <label className="block">
                  <span className="text-gray-700 mb-2 block">
                    Please give any suggestions or concerns you have about local
                    healthcare (short):
                  </span>
                  <span className="hindi-text text-gray-700 mb-2 block">
                    कृपया स्थानीय स्वास्थ्य सेवाओं के बारे में अपने
                    सुझाव/चिंताएँ लिखें (संक्षेप):
                  </span>
                  <textarea
                    value={formData.feedback || ""}
                    onChange={(e) =>
                      handleInputChange("feedback", e.target.value)
                    }
                    className="mt-1 block w-full border-2 border-gray-300 rounded-md focus:border-medical-500 outline-none p-3"
                    rows={4}
                  />
                </label>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Would you like a follow-up call or message about the new
                  centre?
                </p>
                <p className="hindi-text text-gray-700 mb-4">
                  क्या आप नए केंद्र के बारे में फोन या संदेश से फॉलो‑अप चाहते
                  हैं?
                </p>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="followUp"
                      value="phone"
                      checked={formData.follow_up === "phone"}
                      onChange={(e) =>
                        handleInputChange("follow_up", e.target.value)
                      }
                      className="mr-3"
                    />
                    <span>Yes / हाँ - Phone / फोन:</span>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="ml-2 border-b border-gray-300 focus:border-medical-500 outline-none py-1 px-2"
                      placeholder="Phone number"
                    />
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="followUp"
                      value="whatsapp"
                      checked={formData.follow_up === "whatsapp"}
                      onChange={(e) =>
                        handleInputChange("follow_up", e.target.value)
                      }
                      className="mr-3"
                    />
                    <span>Yes / हाँ - WhatsApp:</span>
                    <input
                      type="tel"
                      value={formData.whatsapp || ""}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                      className="ml-2 border-b border-gray-300 focus:border-medical-500 outline-none py-1 px-2"
                      placeholder="WhatsApp number"
                    />
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="followUp"
                      value="no"
                      checked={formData.follow_up === "no"}
                      onChange={(e) =>
                        handleInputChange("follow_up", e.target.value)
                      }
                      className="mr-3"
                    />
                    <span>No / नहीं</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Overall satisfaction with local healthcare today (1-5):
                </p>
                <p className="hindi-text text-gray-700 mb-4">
                  आज के स्थानीय स्वास्थ्य सेवाओं से समग्र संतुष्टि (1-5):
                </p>
                <div className="flex space-x-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="satisfaction"
                        value={rating}
                        checked={formData.satisfaction === rating.toString()}
                        onChange={(e) =>
                          handleInputChange("satisfaction", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span>{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <button type="submit" className="btn-primary no-print">
                Submit Questionnaire / प्रश्नावली जमा करें
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-healthcare-300 bg-gradient-to-r from-healthcare-50 to-medical-50 rounded-lg">
            {/* Thank you message */}
            <div className="text-center mb-3">
              <p className="text-xs text-medical-700 mb-1 font-medium hindi-text leading-tight">
                धन्यवाद - आपका कीमती समय और सुझाव हमारे लिए बहुत महत्वपूर्ण हैं।
              </p>
              <p className="text-xs text-medical-700 mb-1 font-medium leading-tight">
                Thank you - your time and feedback are valuable to us.
              </p>
              <div className="text-xs text-medical-600 font-medium">
                Team (AIIMS alumni outreach / Chhatarpur Wellness Initiative)
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-3 gap-2 items-center mb-3 footer-grid">
              {/* Left: Contact Numbers */}
              <div className="text-left">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-healthcare-700">
                      +91-8882689488
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-medical-600">
                      +91-9315947553
                    </span>
                  </div>
                  <div className="ml-6 text-xs text-medical-500 leading-tight">
                    +91-11-41000506
                  </div>
                </div>
              </div>

              {/* Center: QR Code */}
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-1 border-2 border-healthcare-300 rounded-lg p-1 bg-white shadow-sm">
                    <img
                      src="/images/Ziagnosis_Qrcode.jpg"
                      alt="Ziagnosis QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-medical-600 font-medium">
                    Scan Me
                  </p>
                </div>
              </div>

              {/* Right: Website & Social */}
              <div className="text-right">
                <div className="space-y-1">
                  {/* Website */}
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <a
                      href="https://www.ziagnosis.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-healthcare-700 hover:underline"
                    >
                      www.ziagnosis.com
                    </a>
                  </div>
                  {/* Email */}
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <a
                      href="mailto:info@ziagnosis.com"
                      className="text-xs text-medical-600 hover:underline"
                    >
                      info@ziagnosis.com
                    </a>
                  </div>
                  <div className="flex items-center justify-end space-x-2 text-xs">
                    <span className="text-medical-600">
                      Follow us @ziagnosislab:
                    </span>
                    <div className="social-row">
                      <div className="flex items-center space-x-1">
                        {/* Instagram */}
                        <a
                          href="https://www.instagram.com/ziagnosislab"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-sm flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>

                        {/* Facebook */}
                        <a
                          href="https://www.facebook.com/ziagnosislab"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-sm flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>

                        {/* Twitter/X */}
                        <a
                          href="https://twitter.com/ziagnosislab"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-sm flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                          href="https://www.linkedin.com/company/ziagnosislab"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-4 h-4 bg-gradient-to-r from-blue-700 to-blue-800 rounded-sm flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>

                        {/* YouTube */}
                        <a
                          href="https://www.youtube.com/@ziagnosislab"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-4 h-4 bg-gradient-to-r from-red-600 to-red-700 rounded-sm flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Address Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 rounded-md shadow-md address-bar">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs font-medium">
                  D-89, 1st Floor, 100 Feet Rd, Chhatarpur Enclave, Phase - II,
                  New Delhi-110074
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
