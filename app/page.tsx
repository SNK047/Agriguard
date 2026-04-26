"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Leaf, CloudRain, Globe } from "lucide-react";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "ta">("en");

  const texts = {
    en: {
      title: "AgriGuard",
      subtitle: "AI Crop Disease Detector for Tamil Nadu",
      button: "Get Started",
      tagline: "Detect diseases in paddy, groundnut, sugarcane & more",
      weatherTitle: "Today's Weather",
      weatherInfo: "Villupuram: Rain expected - delay spraying",
      weatherAdvice: "Check local weather before applying pesticides"
    },
    ta: {
      title: "அக்ரிகார்ட்",
      subtitle: "AI பயிர் நோய் கண்டறியும்",
      button: "தொடக்கு",
      tagline: "நெல், வேர்க்கடலை, கரும்பு மற்றும் பலவற்றில் நோய் கண்டறியலாம்",
      weatherTitle: "இன்றைய வானம்",
      weatherInfo: "விழுப்புரம்: மழை எதிர்பார்க்கப்படுகிறது",
      weatherAdvice: "பூச்சிக்கொல்லைத் தெளிக்கத் தடைவதைத் தவிர்க்கவும்"
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <Leaf className="w-24 h-24 mx-auto text-green-600 mb-4 animate-pulse" />
        <h1 className="text-5xl font-bold text-green-800 mb-2">{t.title}</h1>
        <p className="text-xl text-green-700 mb-8">{t.subtitle}</p>

        <Link
          href="/crop-identification"
          className="bg-green-600 hover:bg-green-700 text-white text-2xl font-bold px-12 py-5 rounded-2xl flex items-center gap-3 mx-auto shadow-xl inline-block no-underline transition-all hover:scale-105"
        >
          <Camera className="w-7 h-7" />
          {t.button}
        </Link>

        <p className="mt-6 text-green-600 font-medium">{t.tagline}</p>

        <div className="mt-8 bg-white/80 backdrop-blur rounded-2xl p-5 shadow-lg border border-green-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CloudRain className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-green-800">{t.weatherTitle}</h3>
          </div>
          <p className="text-green-700 font-semibold">{t.weatherInfo}</p>
          <p className="text-sm text-green-600 mt-1">{t.weatherAdvice}</p>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button 
            onClick={() => setLanguage("en")} 
            className={`px-5 py-2 rounded-full font-medium transition-all ${language === "en" ? "bg-green-600 text-white shadow-lg" : "bg-white text-green-600 hover:bg-green-50"}`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage("ta")} 
            className={`px-5 py-2 rounded-full font-medium transition-all ${language === "ta" ? "bg-green-600 text-white shadow-lg" : "bg-white text-green-600 hover:bg-green-50"}`}
          >
            தமிழ்
          </button>
        </div>
      </div>
    </div>
  );
}