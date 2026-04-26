"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Upload, Camera, Droplets, 
  AlertTriangle, CheckCircle, Loader2, 
  RefreshCw, ImageIcon
} from "lucide-react";

interface DiseaseResult {
  label: string;
  disease: { english: string; tamil: string };
  crop: { english: string; tamil: string };
  confidence: number;
  advice: { english: string; tamil: string };
}

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const texts = {
    en: {
      back: "Home",
      title: "Upload Leaf Photo",
      placeholder: "Tap to select or drag & drop image",
      chooseButton: "Select Image",
      detectButton: "Analyze Crop",
      detecting: "Analyzing...",
      detectingDetailed: "AI is analyzing your plant...",
      crop: "Crop",
      advice: "Treatment Advice",
      confidence: "Confidence",
      errorTitle: "Detection Failed",
      errorRetry: "Try Again",
      healthy: "Plant is Healthy!",
      unhealthy: "Disease Detected",
      selectFirst: "Please select an image first"
    },
    ta: {
      back: "முகப்பு",
      title: "இலை புகைப்படம்",
      placeholder: "தட்டவும் அல்லது இழுக்கவும்",
      chooseButton: "படத்தைத் தேர்வுசெய்",
      detectButton: "பகுப்பாய்வு செய்",
      detecting: "விவிச்சித்தல்...",
      detectingDetailed: "AI உங்கள் செடியை விவிச்சித்துக் கொண்டிருக்கிறது...",
      crop: "பயிர்",
      advice: "சிகிச்சை ஆலோசனை",
      confidence: "நம்பகத்தன்மை",
      errorTitle: "கண்டறிய முடியவில்லை",
      errorRetry: "மீண்டும் முயற்சி",
      healthy: "செடி ஆரோக்கியமாக உள்ளது!",
      unhealthy: "நோய் கண்டறியப்பட்டது",
      selectFirst: "முதலில் ஒரு படத்தைத் தேர்வுசெய்யவும்"
    }
  };

  const t = texts[language];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setSelectedImage(imageUrl);
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const imageUrl = URL.createObjectURL(droppedFile);
      setSelectedImage(imageUrl);
      setResult(null);
      setError(null);
    }
  };

  const detectDisease = async () => {
    if (!file) {
      setError(t.selectFirst);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Detection failed");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = result && (
    result.disease.english.toLowerCase().includes("healthy") || 
    result.confidence < 30
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors no-underline font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.back}
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              language === "en"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 hover:bg-green-100"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("ta")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              language === "ta"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 hover:bg-green-100"
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">{t.title}</h1>

        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-green-300 rounded-2xl h-72 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all"
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-center p-4">
              <ImageIcon className="w-16 h-16 mx-auto text-green-400 mb-3" />
              <p className="text-green-600 font-medium">{t.placeholder}</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mt-4 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <Camera className="w-5 h-5" />
          {t.chooseButton}
        </button>

        {selectedImage && (
          <button
            onClick={detectDisease}
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.detectingDetailed}
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                {t.detectButton}
              </>
            )}
          </button>
        )}

        {error && (
          <div className="mt-5 p-4 bg-red-50 rounded-2xl border border-red-200">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-bold">{t.errorTitle}</h2>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-5 space-y-4">
            <div className={`rounded-2xl p-5 border-2 ${
              isHealthy ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isHealthy ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-bold text-lg ${
                  isHealthy ? "text-green-700" : "text-red-700"
                }`}>
                  {isHealthy ? t.healthy : t.unhealthy}
                </span>
              </div>
              
              <h2 className="font-bold text-xl text-gray-800">
                {language === "en" ? result.disease.english : result.disease.tamil}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {language === "en" ? result.crop.english : result.crop.tamil}
              </p>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">{t.confidence}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isHealthy ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="font-bold text-gray-700 min-w-[45px]">{result.confidence}%</span>
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-gray-900 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-green-400 text-lg">{t.advice}</h3>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                {language === "en" ? result.advice.english : result.advice.tamil}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}