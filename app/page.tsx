"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Leaf } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "ta">("en"); // en = English, ta = Tamil

  const texts = {
    en: {
      title: "AgriGuard 🌱",
      subtitle: "AI Crop Disease Detector for Tamil Nadu Farmers",
      button: "Upload Crop Photo",
      tagline: "Helpful for Paddy, Groundnut, Sugarcane & more",
      weatherTitle: "Today's Weather Tip",
      weatherInfo: "Villupuram: Rain expected – delay spraying",
      weatherAdvice: "Check local weather before applying pesticides"
    },
    ta: {
      title: "அக்ரிகார்ட் 🌱",
      subtitle: "தமிழ்நாடு விவசாயிகளுக்கான AI பயிர் நோய் கண்டறியும் கருவி",
      button: "பயிர் புகைப்படத்தை பதிவேற்றவும்",
      tagline: "நெல், வேர்க்கடலை, கரும்பு மற்றும் பலவற்றுக்கு உதவியாக",
      weatherTitle: "இன்றைய வானிலை குறிப்பு",
      weatherInfo: "விழுப்புரம்: மழை எதிர்பார்க்கப்படுகிறது – தெளிப்பை தாமதப்படுத்துங்கள்",
      weatherAdvice: "பூச்சிக்கொல்லைப் பயன்படுத்துவதற்கு முன் உள்ளூர்வானிலையை சரிபார்க்கவும்"
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Leaf className="w-20 h-20 mx-auto text-green-600 mb-4" />
        <h1 className="text-5xl font-bold text-green-800 mb-2">{t.title}</h1>
        <p className="text-xl text-green-700 mb-8">{t.subtitle}</p>

        <button
          onClick={() => router.push("/upload")}
          className="bg-green-600 hover:bg-green-700 text-white text-xl font-medium px-10 py-4 rounded-2xl flex items-center gap-3 mx-auto shadow-lg cursor-pointer"
        >
          <Camera className="w-6 h-6" />
          {t.button}
        </button>

        <p className="mt-6 text-green-600">{t.tagline}</p>

        <div className="mt-8 bg-white rounded-xl p-4 shadow-md border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">{t.weatherTitle}</h3>
          <p className="text-green-700 font-medium">{t.weatherInfo}</p>
          <p className="text-sm text-green-600 mt-1">{t.weatherAdvice}</p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => setLanguage("en")} className={`px-4 py-2 rounded-full ${language === "en" ? "bg-green-600 text-white" : "bg-white"}`}>English</button>
          <button onClick={() => setLanguage("ta")} className={`px-4 py-2 rounded-full ${language === "ta" ? "bg-green-600 text-white" : "bg-white"}`}>தமிழ்</button>
        </div>
      </div>
    </div>
  );
}
