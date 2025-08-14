"use client";

import type { FormData } from "./QuestionnaireForm";

type Option = {
  value: string;
  label: string;
};

interface PrintViewProps {
  formData: FormData;
  onBack: () => void;
  onPrint: () => void;
}

const PrintView: React.FC<PrintViewProps> = ({ formData, onBack, onPrint }) => {
  const getSelectedOptions = (field: keyof FormData, options: Option[]): string => {
    const values = formData[field] as string[] | undefined;
    if (!values || values.length === 0) return "Not answered";
    return values
      .map((value: string) => {
        const option = options.find((opt: Option) => opt.value === value);
        return option ? option.label : value;
      })
      .join(", ");
  } 

  const getRadioAnswer = (field: keyof FormData, options: Option[]): string => {
    const value = formData[field] as string | undefined;
    if (!value) return "Not answered";
    const option = options.find((opt: Option) => opt.value === value);
    return option ? option.label : value;
  }

  const getRankingAnswers = (): string => {
    if (!formData.services_needed) return "Not answered";
    const services: Option[] = [
      { value: "general-opd", label: "General OPD / सामान्य OPD" },
      { value: "daycare", label: "Daycare treatments / डेकेयर ट्रीटमेंट" },
      { value: "super-speciality", label: "Super‑speciality consultations / सुपर‑स्पेशलिटी परामर्श" },
      { value: "diagnostic", label: "Diagnostic lab & imaging / डायग्नोस्टिक लैब और इमेजिंग" },
      { value: "cghs-support", label: "CGHS / CAPF support / CGHS / CAPF सहायता" },
      { value: "generic-medicines", label: "Affordable generic medicines / सस्ती जेनेरिक दवाएँ" },
      { value: "preventive-checkups", label: "Preventive health checkups / निवारक स्वास्थ्य जांच" },
    ];

  const ranked = Object.entries(formData.services_needed)
      .filter(([_, rank]) => !!rank)
      .sort(([_, a], [__, b]) => Number.parseInt(a as string) - Number.parseInt(b as string))
      .map(([service, rank]) => {
        const serviceObj = services.find((s: Option) => s.value === service);
        return `${rank}. ${serviceObj ? serviceObj.label : service}`;
      });

    return ranked.length > 0 ? ranked.join("; ") : "Not answered";
  } 

  return (
    <div className="min-h-screen bg-medical-50">
      {/* Print Controls - FIXED */}
      <div className="no-print bg-healthcare-600 text-white p-4 flex justify-between items-center shadow-lg print-button">
        <button
          onClick={onBack}
          className="btn-primary flex items-center space-x-2 text-lg font-extrabold rounded-xl shadow-lg px-7 py-3 transition-all duration-200 bg-gradient-to-r from-blue-500 via-green-500 to-blue-700 text-white hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span className="mr-2 text-xl">←</span>
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-3">
          <img src="/images/ziagnosis-logo-watermark.png" alt="Ziagnosis" className="w-10 h-10 rounded-full shadow-md" />
          <h2 className="text-2xl font-bold gradient-text drop-shadow">Questionnaire Response / प्रश्नावली प्रतिक्रिया</h2>
        </div>
        <button
          onClick={onPrint}
          className="print-button btn-primary flex items-center space-x-2 px-5 py-2 rounded-md font-semibold shadow-md text-base"
        >
          <span>🖨️</span>
          <span>Print</span>
        </button>
      </div>

      {/* Print Content */}
      <div className="container mx-auto px-2 py-4 max-w-3xl watermark-bg">
        <div className="form-container bg-white rounded-xl shadow-xl p-4">
          {/* Official header with certifications */}
          <div className="text-center mb-6 border-b border-healthcare-200 pb-4">
            <img
              src="/images/ziagnosis-header.png"
              alt="Ziagnosis Wellness Clinic & Diagnostic Lab - CGHS Empaneled, CAPF Ayushman, NABL MC-6586"
              className="w-full max-w-2xl mx-auto mb-4 rounded-lg shadow-md"
            />
            <h1 className="text-3xl font-extrabold gradient-text mb-1 drop-shadow">Preventive Healthcare & Wellness Centre</h1>
            <h2 className="text-xl font-bold hindi-text text-healthcare-600 mb-2 drop-shadow">निवारक स्वास्थ्य और कल्याण केंद्र</h2>
            <div className="flex items-center justify-center space-x-4 mb-2">
              <div className="w-10 h-1 bg-healthcare-500 rounded-full"></div>
              <span className="text-lg font-bold gradient-text drop-shadow">
                Patient Questionnaire Response / रोगी प्रश्नावली प्रतिक्रिया
              </span>
              <div className="w-10 h-1 bg-healthcare-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-700 bg-healthcare-50 rounded-lg p-2 border border-healthcare-200 inline-block font-semibold">
              Date / दिनांक: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>

          {/* Responses */}
          <div className="space-y-4">
            {/* Question 1 */}
            <div className="question-group print-avoid-break shadow-sm">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                1. Have you visited any trained doctor (MBBS/MD/AIIMS alumni) in Chhatarpur in the last 12 months?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                क्या आपने पिछले 12 महीनों में Chhatarpur में किसी प्रशिक्षित डॉक्टर से इलाज कराया है?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("visited_doctor", [
                  { value: "yes", label: "Yes / हाँ" },
                  { value: "no", label: "No / नहीं" },
                ])}
              </p>
            </div>

            {/* Question 2 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                2. If NO, why? (Choose all that apply)
              </h3>
              <p className="hindi-text text-gray-700 mb-2">अगर नहीं, तो वजह क्या थी? (सभी लागू विकल्प चुनें)</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getSelectedOptions("no_visit_reasons", [
                  { value: "no-trained-doctor", label: "No trained doctor nearby / पास प्रशिक्षित डॉक्टर नहीं" },
                  {
                    value: "prefer-local",
                    label: "Prefer local/quack because cheaper / सस्ता होने के कारण स्थानीय/क्वैक चुनते हैं",
                  },
                  { value: "long-waiting", label: "Long waiting / लम्बा इंतज़ार" },
                  { value: "cost", label: "Cost of treatment / इलाज की लागत" },
                  { value: "lack-awareness", label: "Lack of awareness / जानकारी की कमी" },
                ])}
              </p>
              {formData.other_reason && (
                <p className="font-medium text-healthcare-700 mt-2 bg-warning-50 p-2 rounded border-l-4 border-warning-500">
                  Other / अन्य: {formData.other_reason}
                </p>
              )}
            </div>

            {/* Question 3 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                3. Which services do you need most in your area? (Rank top 3)
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                आपके क्षेत्र में किन सेवाओं की सबसे ज़्यादा ज़रूरत है? (टॉप 3 चुनें और क्रम दें)
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर: {getRankingAnswers()}
              </p>
            </div>

            {/* Question 4 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                4. Would you use a local wellness centre if AIIMS-trained doctors and reliable diagnostics were available at affordable prices?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                यदि AIIMS‑प्रशिक्षित डॉक्टर और भरोसेमंद डायग्नोस्टिक सस्ती कीमत पर उपलब्ध हों, क्या आप स्थानीय वेलनेस सेंटर का उपयोग
                करेंगे?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("use_wellness_centre", [
                  { value: "definitely", label: "Definitely / ज़रूर" },
                  { value: "maybe", label: "Maybe / शायद" },
                  { value: "not-interested", label: "Not interested / रुचि नहीं" },
                ])}
              </p>
            </div>

            {/* Question 5 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                5. How important is having CGHS/CAPF empanelled services nearby for you or your family?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">CGHS/CAPF सेवाएँ आपके लिए कितनी ज़रूरी हैं?</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर: {formData.cghs_importance ? `${formData.cghs_importance}/5` : "Not answered"}
              </p>
            </div>

            {/* Question 6 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                6. Have you ever received wrong or unnecessary tests/treatments locally?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                क्या आपको स्थानीय स्तर पर कभी गलत या अनावश्यक टेस्ट/इलाज मिला है?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("wrong_treatment", [
                  { value: "yes-often", label: "Yes—often / हाँ—अक्सर" },
                  { value: "yes-once-twice", label: "Yes—once or twice / हाँ—एक / दो बार" },
                  { value: "no", label: "No / नहीं" },
                ])}
              </p>
              {formData.wrong_treatment_details && (
                <p className="font-medium text-healthcare-700 mt-2 bg-warning-50 p-2 rounded border-l-4 border-warning-500">
                  Details / विवरण: {formData.wrong_treatment_details}
                </p>
              )}
            </div>

            {/* Question 7 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                7. What is an acceptable average cost for a routine blood test package for families here?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                यहाँ परिवार के लिए सामान्य ब्लड टेस्ट पैकेज की स्वीकार्य औसत लागत क्या है?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("blood_test_cost", [
                  { value: "less-300", label: "Less than ₹300 / ₹300 से कम" },
                  { value: "300-600", label: "₹300-₹600" },
                  { value: "600-1000", label: "₹600-₹1000" },
                  { value: "more-1000", label: "More than ₹1000 / ₹1000 से अधिक" },
                ])}
              </p>
            </div>

            {/* Question 8 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                8. Would you prefer generic medicines dispensed at the centre if quality assured?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                अगर गुणवत्तापूर्ण सुनिश्चित हो तो क्या आप सेंटर पर जेनेरिक दवाइयाँ लेना पसंद करेंगे?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("generic_medicines", [
                  { value: "yes", label: "Yes / हाँ" },
                  { value: "no", label: "No / नहीं" },
                  { value: "unsure", label: "Unsure / निश्चित नहीं" },
                ])}
              </p>
            </div>

            {/* Question 9 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                9. Which hours are best for you to visit the wellness centre?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">किस समय आप वेलनेस सेंटर आना पसंद करेंगे?</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getSelectedOptions("visit_hours", [
                  { value: "morning", label: "Morning (8am-12pm) / सुबह (8-12)" },
                  { value: "afternoon", label: "Afternoon (12pm-4pm) / दोपहर (12-4)" },
                  { value: "evening", label: "Evening (4pm-8pm) / शाम (4-8)" },
                  { value: "weekend", label: "Weekend availability important / वीकेंड पर खुला होना ज़रूरी" },
                ])}
              </p>
            </div>

            {/* Question 10 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                10. Would you like community health awareness sessions?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">क्या आप मुफ्त सामुदायिक स्वास्थ्य जागरूकता सत्र चाहेंगे?</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("health_sessions", [
                  { value: "yes", label: "Yes / हाँ" },
                  { value: "no", label: "No / नहीं" },
                ])}
              </p>
              {formData.health_topics && (
                <p className="font-medium text-healthcare-700 mt-2 bg-success-50 p-2 rounded border-l-4 border-success-500">
                  Topics of interest / रुचि के विषय: {formData.health_topics}
                </p>
              )}
            </div>

            {/* Feedback */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                Feedback & Suggestions / सुझाव और प्रतिक्रिया
              </h3>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-3 rounded border-l-4 border-healthcare-500">
                {formData.feedback || "No feedback provided / कोई सुझाव नहीं दिया गया"}
              </p>
            </div>

            {/* Contact Information */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                Follow-up Preference / फॉलो-अप प्राथमिकता
              </h3>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                {formData.follow_up === "phone" && formData.phone
                  ? `Phone / फोन: ${formData.phone}`
                  : formData.follow_up === "whatsapp" && formData.whatsapp
                    ? `WhatsApp: ${formData.whatsapp}`
                    : formData.follow_up === "no"
                      ? "No follow-up requested / फॉलो-अप नहीं चाहिए"
                      : "Not specified / निर्दिष्ट नहीं"}
              </p>
            </div>

            {/* Satisfaction */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                Overall satisfaction with local healthcare today / आज के स्थानीय स्वास्थ्य सेवाओं से समग्र संतुष्टि
              </h3>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                {formData.satisfaction ? `${formData.satisfaction}/5` : "Not answered / उत्तर नहीं दिया गया"}
              </p>
            </div>

            {/* Personal Information - All Required Fields */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-extrabold mb-2" style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #059669 60%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(59,130,246,0.10)'
              }}>
                Personal Information / व्यक्तिगत जानकारी
              </h3>
              <div className="space-y-2 bg-healthcare-50 p-3 rounded border-l-4 border-healthcare-500">
                <p className="font-medium text-healthcare-700">
                  Name / नाम: {formData.name || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Age / आयु: {formData.age || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Gender / लिंग: {formData.gender ? (formData.gender === "male" ? "Male / पुरुष" : formData.gender === "female" ? "Female / महिला" : "Other / अन्य") : "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Contact / संपर्क: {formData.contact || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Address / पता: {formData.address || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Local area / स्थानीय क्षेत्र: {formData.area || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Emergency Contact / आपातकालीन संपर्क: {formData.emergency_contact || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Blood Group / रक्त समूह: {formData.blood_group || "Not provided / नहीं दिया गया"}
                </p>
              </div>
            </div>
          </div>

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
            <div className="grid grid-cols-3 gap-2 items-center mb-3">
              {/* Left: Contact Numbers */}
              <div className="text-left">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-healthcare-700">+91-8882689488</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-medical-600">+91-9315947553</span>
                  </div>
                  <div className="ml-6 text-xs text-medical-500 leading-tight">+91-8595195353 / +91-11-41000506</div>
                </div>
              </div>

              {/* Center: QR Code */}
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-1 border-2 border-healthcare-300 rounded-lg p-1 bg-white shadow-sm">
                    <img src="/images/qr-code.png" alt="Ziagnosis QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-medical-600 font-medium">Scan for Info</p>
                </div>
              </div>

              {/* Right: Website & Social */}
              <div className="text-right">
                <div className="space-y-1">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-healthcare-700">www.ziagnosis.com</span>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-xs text-medical-600">info@ziagnosis.com</span>
                  </div>
                  <div className="flex items-center justify-end space-x-1 text-xs">
                    <span className="text-medical-600">Follow @ziagnosislab:</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-sm flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-sm flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-sm flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-700 to-blue-800 rounded-sm flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <div className="w-3 h-3 bg-gradient-to-r from-red-600 to-red-700 rounded-sm flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 rounded-md shadow-md">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs font-medium">
                  D-89, 1st Floor, 100 Feet Rd, Chhatarpur Enclave, Phase - II, New Delhi-110074
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintView;
