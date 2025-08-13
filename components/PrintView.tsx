"use client"

type ServicesNeeded = {
  [key: string]: string;
};

type FormData = {
  visitedDoctor: string;
  noVisitReasons: string[];
  servicesNeeded: ServicesNeeded;
  useWellnessCentre: string;
  cghsImportance: string;
  wrongTreatment: string;
  wrongTreatmentDetails: string;
  bloodTestCost: string;
  genericMedicines: string;
  visitHours: string[];
  healthSessions: string;
  healthTopics: string;
  feedback: string;
  followUp: string;
  phone: string;
  whatsapp: string;
  satisfaction: string;
  name: string;
  age: string;
  area: string;
  otherReason: string;
};

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
    if (!formData.servicesNeeded) return "Not answered";
    const services: Option[] = [
      { value: "general-opd", label: "General OPD / सामान्य OPD" },
      { value: "daycare", label: "Daycare treatments / डेकेयर ट्रीटमेंट" },
      { value: "super-speciality", label: "Super‑speciality consultations / सुपर‑स्पेशलिटी परामर्श" },
      { value: "diagnostic", label: "Diagnostic lab & imaging / डायग्नोस्टिक लैब और इमेजिंग" },
      { value: "cghs-support", label: "CGHS / CAPF support / CGHS / CAPF सहायता" },
      { value: "generic-medicines", label: "Affordable generic medicines / सस्ती जेनेरिक दवाएँ" },
      { value: "preventive-checkups", label: "Preventive health checkups / निवारक स्वास्थ्य जांच" },
    ];

    const ranked = Object.entries(formData.servicesNeeded as ServicesNeeded)
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
          className="btn-secondary bg-white text-healthcare-600 border-healthcare-600 hover:bg-healthcare-600 hover:text-white flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Form</span>
        </button>
        <div className="flex items-center space-x-3">
          <img src="/images/ziagnosis-logo.png" alt="Ziagnosis" className="w-8 h-8" />
          <h2 className="text-xl font-semibold">Questionnaire Response / प्रश्नावली प्रतिक्रिया</h2>
        </div>
        <button
          onClick={onPrint}
          className="print-button bg-white text-healthcare-600 border-2 border-healthcare-600 hover:bg-healthcare-600 hover:text-white flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all"
        >
          <span>🖨️</span>
          <span>Print</span>
        </button>
      </div>

      {/* Print Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl watermark-bg">
        <div className="form-container bg-white rounded-lg shadow-lg p-8">
          {/* Official header with certifications */}
          <div className="text-center mb-8 border-b border-healthcare-200 pb-6">
            <img
              src="/images/ziagnosis-header.png"
              alt="Ziagnosis Wellness Clinic & Diagnostic Lab - CGHS Empaneled, CAPF Ayushman, NABL MC-6586"
              className="w-full max-w-4xl mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-healthcare-700 mb-2">Preventive Healthcare & Wellness Centre</h1>
            <h2 className="text-xl font-semibold hindi-text text-healthcare-600 mb-4">निवारक स्वास्थ्य और कल्याण केंद्र</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-1 bg-healthcare-500 rounded-full"></div>
              <span className="text-lg font-medium text-healthcare-700">
                Patient Questionnaire Response / रोगी प्रश्नावली प्रतिक्रिया
              </span>
              <div className="w-12 h-1 bg-healthcare-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 bg-healthcare-50 rounded-lg p-3 border border-healthcare-200 inline-block">
              Date / दिनांक: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>

          {/* Responses */}
          <div className="space-y-6">
            {/* Question 1 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                1. Have you visited any trained doctor (MBBS/MD/AIIMS alumni) in Chhatarpur in the last 12 months?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                क्या आपने पिछले 12 महीनों में Chhatarpur में किसी प्रशिक्षित डॉक्टर से इलाज कराया है?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("visitedDoctor", [
                  { value: "yes", label: "Yes / हाँ" },
                  { value: "no", label: "No / नहीं" },
                ])}
              </p>
            </div>

            {/* Question 2 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">2. If NO, why? (Choose all that apply)</h3>
              <p className="hindi-text text-gray-700 mb-2">अगर नहीं, तो वजह क्या थी? (सभी लागू विकल्प चुनें)</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getSelectedOptions("noVisitReasons", [
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
              {formData.otherReason && (
                <p className="font-medium text-healthcare-700 mt-2 bg-warning-50 p-2 rounded border-l-4 border-warning-500">
                  Other / अन्य: {formData.otherReason}
                </p>
              )}
            </div>

            {/* Question 3 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                4. Would you use a local wellness centre if AIIMS‑trained doctors and reliable diagnostics were
                available at affordable prices?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                यदि AIIMS‑प्रशिक्षित डॉक्टर और भरोसेमंद डायग्नोस्टिक सस्ती कीमत पर उपलब्ध हों, क्या आप स्थानीय वेलनेस सेंटर का उपयोग
                करेंगे?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("useWellnessCentre", [
                  { value: "definitely", label: "Definitely / ज़रूर" },
                  { value: "maybe", label: "Maybe / शायद" },
                  { value: "not-interested", label: "Not interested / रुचि नहीं" },
                ])}
              </p>
            </div>

            {/* Question 5 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                5. How important is having CGHS/CAPF empanelled services nearby for you or your family?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">CGHS/CAPF सेवाएँ आपके लिए कितनी ज़रूरी हैं?</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर: {formData.cghsImportance ? `${formData.cghsImportance}/5` : "Not answered"}
              </p>
            </div>

            {/* Question 6 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                6. Have you ever received wrong or unnecessary tests/treatments locally?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                क्या आपको स्थानीय स्तर पर कभी गलत या अनावश्यक टेस्ट/इलाज मिला है?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("wrongTreatment", [
                  { value: "yes-often", label: "Yes—often / हाँ—अक्सर" },
                  { value: "yes-once-twice", label: "Yes—once or twice / हाँ—एक / दो बार" },
                  { value: "no", label: "No / नहीं" },
                ])}
              </p>
              {formData.wrongTreatmentDetails && (
                <p className="font-medium text-healthcare-700 mt-2 bg-warning-50 p-2 rounded border-l-4 border-warning-500">
                  Details / विवरण: {formData.wrongTreatmentDetails}
                </p>
              )}
            </div>

            {/* Question 7 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                7. What is an acceptable average cost for a routine blood test package for families here?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                यहाँ परिवार के लिए सामान्य ब्लड टेस्ट पैकेज की स्वीकार्य औसत लागत क्या है?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("bloodTestCost", [
                  { value: "less-300", label: "Less than ₹300 / ₹300 से कम" },
                  { value: "300-600", label: "₹300–₹600" },
                  { value: "600-1000", label: "₹600–₹1000" },
                  { value: "more-1000", label: "More than ₹1000 / ₹1000 से अधिक" },
                ])}
              </p>
            </div>

            {/* Question 8 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                8. Would you prefer generic medicines dispensed at the centre if quality assured?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">
                अगर गुणवत्तापूर्ण सुनिश्चित हो तो क्या आप सेंटर पर जेनेरिक दवाइयाँ लेना पसंद करेंगे?
              </p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("genericMedicines", [
                  { value: "yes", label: "Yes / हाँ" },
                  { value: "no", label: "No / नहीं" },
                  { value: "unsure", label: "Unsure / निश्चित नहीं" },
                ])}
              </p>
            </div>

            {/* Question 9 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                9. Which hours are best for you to visit the wellness centre?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">किस समय आप वेलनेस सेंटर आना पसंद करेंगे?</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getSelectedOptions("visitHours", [
                  { value: "morning", label: "Morning (8am–12pm) / सुबह (8–12)" },
                  { value: "afternoon", label: "Afternoon (12pm–4pm) / दोपहर (12–4)" },
                  { value: "evening", label: "Evening (4pm–8pm) / शाम (4–8)" },
                  { value: "weekend", label: "Weekend availability important / वीकेंड पर खुला होना ज़रूरी" },
                ])}
              </p>
            </div>

            {/* Question 10 */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                10. Would you like community health awareness sessions?
              </h3>
              <p className="hindi-text text-gray-700 mb-2">क्या आप मुफ्त सामुदायिक स्वास्थ्य जागरूकता सत्र चाहेंगे?</p>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                Answer / उत्तर:{" "}
                {getRadioAnswer("healthSessions", [
                  { value: "yes", label: "Yes / हाँ" },
                  { value: "no", label: "No / नहीं" },
                ])}
              </p>
              {formData.healthTopics && (
                <p className="font-medium text-healthcare-700 mt-2 bg-success-50 p-2 rounded border-l-4 border-success-500">
                  Topics of interest / रुचि के विषय: {formData.healthTopics}
                </p>
              )}
            </div>

            {/* Feedback */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Feedback & Suggestions / सुझाव और प्रतिक्रिया</h3>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-3 rounded border-l-4 border-healthcare-500">
                {formData.feedback || "No feedback provided / कोई सुझाव नहीं दिया गया"}
              </p>
            </div>

            {/* Contact Information */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Follow-up Preference / फॉलो-अप प्राथमिकता</h3>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                {formData.followUp === "phone" && formData.phone
                  ? `Phone / फोन: ${formData.phone}`
                  : formData.followUp === "whatsapp" && formData.whatsapp
                    ? `WhatsApp: ${formData.whatsapp}`
                    : formData.followUp === "no"
                      ? "No follow-up requested / फॉलो-अप नहीं चाहिए"
                      : "Not specified / निर्दिष्ट नहीं"}
              </p>
            </div>

            {/* Satisfaction */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Overall satisfaction with local healthcare today / आज के स्थानीय स्वास्थ्य सेवाओं से समग्र संतुष्टि
              </h3>
              <p className="font-medium text-healthcare-700 bg-healthcare-50 p-2 rounded border-l-4 border-healthcare-500">
                {formData.satisfaction ? `${formData.satisfaction}/5` : "Not answered / उत्तर नहीं दिया गया"}
              </p>
            </div>

            {/* Optional Information */}
            <div className="question-group print-avoid-break">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information / व्यक्तिगत जानकारी</h3>
              <div className="space-y-2 bg-healthcare-50 p-3 rounded border-l-4 border-healthcare-500">
                <p className="font-medium text-healthcare-700">
                  Name / नाम: {formData.name || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Age / आयु: {formData.age || "Not provided / नहीं दिया गया"}
                </p>
                <p className="font-medium text-healthcare-700">
                  Local area / स्थानीय क्षेत्र: {formData.area || "Not provided / नहीं दिया गया"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-healthcare-200 text-center">
            <p className="text-gray-600 mb-2 font-medium hindi-text">
              धन्यवाद — आपका कीमती समय और सुझाव हमारे लिए बहुत महत्वपूर्ण हैं।
            </p>
            <p className="text-gray-600 mb-3 font-medium">Thank you — your time and feedback are valuable to us.</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>— Team (AIIMS alumni outreach / Chhatarpur Wellness Initiative)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintView
