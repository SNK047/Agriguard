import { NextRequest, NextResponse } from "next/server";

const HF_API_URL = "https://api-inference.huggingface.co/models/nickmuchi/vit-base-patch16-224-plant-disease-accuracy";
const HF_API_KEY = process.env.HF_API_KEY;

interface DiseaseInfo {
  label: string;
  disease: { english: string; tamil: string };
  crop: { english: string; tamil: string };
  advice: { english: string; tamil: string };
}

const DISEASE_DATABASE: Record<string, DiseaseInfo> = {
  "Apple___Apple_scab": {
    label: "Apple Scab",
    disease: { english: "Apple Scab", tamil: "ஆப்பிள் சாக்" },
    crop: { english: "Apple", tamil: "ஆப்பிள்" },
    advice: {
      english: "Apply fungicide with sulfur or captan. Remove infected leaves. Plant resistant varieties.",
      tamil: "சல்பர் அல்லது காப்டான் கொண்ட பூச்சிக்கொல்லை த் தெளிக்கவும். தொற்று அடைந்த இலைகளை அகற்றவும். தடுப்பு வகைகளை வளர்க்கவும்."
    }
  },
  "Apple___Black_rot": {
    label: "Apple Black Rot",
    disease: { english: "Black Rot", tamil: "கருப்பு மக்கல்" },
    crop: { english: "Apple", tamil: "ஆப்பிள்" },
    advice: {
      english: "Remove infected branches and fruits. Apply copper fungicide. Prune for good air circulation.",
      tamil: "தொற்று அடைந்த கிளைகள் மற்றும் பழங்களை அகற்றவும். தங்க பூச்சிக்கொல்லை த் தெளிக்கவும். காற்று சுழற்சி க்காக கத்தரிக்கவும்."
    }
  },
  "Apple___Cedar_apple_rust": {
    label: "Cedar Apple Rust",
    disease: { english: "Cedar Apple Rust", tamil: "சிடார் அழல்" },
    crop: { english: "Apple", tamil: "ஆப்பிள்" },
    advice: {
      english: "Remove nearby cedar trees. Apply myclobutanil fungicide. Use resistant varieties.",
      tamil: "அருகில் உள்ள சிடார் மரங்களை அகற்றவும். மைக்ளோபுடானில் பூச்சிக்கொல்லை த் தெளிக்கவும். தடுப்பு வகைகளை பயன்படுத்தவும்."
    }
  },
  "Apple___healthy": {
    label: "Apple Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Apple", tamil: "ஆப்பிள்" },
    advice: {
      english: "Your apple plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் ஆப்பிள் மகர்ரோ ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Blueberry___healthy": {
    label: "Blueberry Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Blueberry", tamil: "ப்ளூபெர்ரி" },
    advice: {
      english: "Your blueberry plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் ப்ளூபெர்ரி ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Cherry___Powdery_mildew": {
    label: "Cherry Powdery Mildew",
    disease: { english: "Powdery Mildew", tamil: "பவுடரி அழல்" },
    crop: { english: "Cherry", tamil: "செர்ரி" },
    advice: {
      english: "Apply sulfur-based fungicide. Improve air circulation. Remove infected leaves.",
      tamil: "சல்பர் அடிப்படையான பூச்சிக்கொல்லை த் தெளிக்கவும். காற்று சுழற்சியை மேம்படுத்தவும். தொற்று அடைந்த இலைகளை அகற்றவும்."
    }
  },
  "Cherry___healthy": {
    label: "Cherry Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Cherry", tamil: "செர்ரி" },
    advice: {
      english: "Your cherry plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் செர்ரி ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Corn___Cercospora_leaf_spot": {
    label: "Cercospora Leaf Spot (Gray Leaf Spot)",
    disease: { english: "Cercospora Leaf Spot", tamil: "சர்கோஸ்போரா இலை புள்" },
    crop: { english: "Corn", tamil: "மக்காச்சி" },
    advice: {
      english: "Apply fungicide. Rotate crops. Plant resistant varieties. Remove infected debris.",
      tamil: "பூச்சிக்கொல்லை த் தெளிக்கவும். பயிர் மாற்றுங்கள். தடுப்பு வகைகளை வளர்க்கவும். தொற்று உடைய கழிவுகளை அகற்றவும்."
    }
  },
  "Corn___Common_rust": {
    label: "Common Rust",
    disease: { english: "Common Rust", tamil: "பொதுவான அழல்" },
    crop: { english: "Corn", tamil: "மக்காச்சி" },
    advice: {
      english: "Apply fungicide early. Plant resistant varieties. Monitor regularly.",
      tamil: "ஆரம்பத்தில் பூச்சிக்கொல்லை த் தெளிக்கவும். தடுப்பு வகைகளை வளர்க்கவும். தவறாமல் கண்காணிக்கவும்."
    }
  },
  "Corn___Northern_Leaf_Blight": {
    label: "Northern Leaf Blight",
    disease: { english: "Northern Leaf Blight", tamil: "வடக்கு இலை ப்ளைட்" },
    crop: { english: "Corn", tamil: "மக்காச்சி" },
    advice: {
      english: "Apply azoxystrobin fungicide. Rotate crops. Plant resistant hybrids.",
      tamil: "அசோக்ஸிஸ்ட்ரோபின் பூச்சிக்கொல்லை த் தெளிக்கவும். பயிர் மாற்றுங்கள். தடுப்பு கலப்பைகளை வளர்க்கவும்."
    }
  },
  "Corn___healthy": {
    label: "Corn Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Corn", tamil: "மக்காச்சி" },
    advice: {
      english: "Your corn plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் மக்காச்சி ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Grape___Black_rot": {
    label: "Grape Black Rot",
    disease: { english: "Black Rot", tamil: "கருப்பு மக்கல்" },
    crop: { english: "Grape", tamil: "திராட்சை" },
    advice: {
      english: "Apply fungicide. Remove infected leaves and fruits. Improve air circulation.",
      tamil: "பூச்சிக்கொல்லை த் தெளிக்கவும். தொற்று அடைந்த இலைகள் மற்றும் பழங்களை அகற்றவும். காற்று சுழற்சியை மேம்படுத்தவும்."
    }
  },
  "Grape___Esca": {
    label: "Grape Esca (Black Measles)",
    disease: { english: "Esca (Black Measles)", tamil: "எஸ்கா" },
    crop: { english: "Grape", tamil: "திராட்சை" },
    advice: {
      english: "Remove infected vines. Apply fungicide. Avoid pruning during wet weather.",
      tamil: "தொற்று அடைந்த கொடிகளை அகற்றவும். பூச்சிக்கொல்லை த் தெளிக்கவும். மழைக் காலத்தில் கத்தரிப்பதைத் தவிர்க்கவும்."
    }
  },
  "Grape___Leaf_blight": {
    label: "Grape Leaf Blight",
    disease: { english: "Leaf Blight", tamil: "இலை ப்ளைட்" },
    crop: { english: "Grape", tamil: "திராட்சை" },
    advice: {
      english: "Apply copper fungicide. Remove infected leaves. Improve air circulation.",
      tamil: "தங்க பூச்சிக்கொல்லை த் தெளிக்கவும். தொற்று அடைந்த இலைகளை அகற்றவும். காற்று சுழற்சியை மேம்படுத்தவும்."
    }
  },
  "Grape___healthy": {
    label: "Grape Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Grape", tamil: "திராட்சை" },
    advice: {
      english: "Your grape plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் திராட்சை ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Orange___Haunglongbing": {
    label: "Citrus Huanglongbing",
    disease: { english: "Huanglongbing (HLB)", tamil: "கிழக்கு வாழைப்பிடி" },
    crop: { english: "Orange", tamil: "கிழங்கு" },
    advice: {
      english: "Remove infected trees. Control psyllid vectors. Use certified disease-free planting material.",
      tamil: "தொற்று அடைந்த மரங்களை அகற்றவும். சி்ளிட் உண்ணிகளை கட்டுப்படுத்தவும். நோய் தடுப்பு வளர்ப்பு பொருளைப் பயன்படுத்தவும்."
    }
  },
  "Peach___Bacterial_spot": {
    label: "Peach Bacterial Spot",
    disease: { english: "Bacterial Spot", tamil: "பாக்டீரியல் புள்" },
    crop: { english: "Peach", tamil: "பீச்" },
    advice: {
      english: "Apply copper bactericide. Remove infected leaves. Avoid overhead irrigation.",
      tamil: "தங்க பாக்டீரியல் கொல்லி த் தெளிக்கவும். தொற்று அடைந்த இலைகளை அகற்றவும். மேல் பாசனதத்தைத் தவிர்க்கவும்."
    }
  },
  "Peach___healthy": {
    label: "Peach Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Peach", tamil: "பீச்" },
    advice: {
      english: "Your peach plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் பீச் ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Pepper___Bacterial_spot": {
    label: "Pepper Bacterial Spot",
    disease: { english: "Bacterial Spot", tamil: "பாக்டீரியல் புள்" },
    crop: { english: "Bell Pepper", tamil: "மிளகு" },
    advice: {
      english: "Apply copper bactericide. Rotate crops. Remove infected plants.",
      tamil: "தங்க பாக்டீரியல் கொல்லி த் தெளிக்கவும். பயிர் மாற்றுங்கள். தொற்று அடைந்த செடைகளை அகற்றவும்."
    }
  },
  "Pepper___healthy": {
    label: "Pepper Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Bell Pepper", tamil: "மிளகு" },
    advice: {
      english: "Your pepper plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் மிளகு ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Potato___Early_blight": {
    label: "Early Blight",
    disease: { english: "Early Blight", tamil: " awal blight" },
    crop: { english: "Potato", tamil: "உருளைக்கிழங்கு" },
    advice: {
      english: "Apply fungicide. Remove lower infected leaves. Mulch around plants.",
      tamil: "பூச்சிக்கொல்லை த் தெளிக்கவும். கீழ் தொற்று அடைந்த இலைகளை அகற்றவும். சுற்றியே mulching செய்யவும்."
    }
  },
  "Potato___Late_blight": {
    label: "Late Blight",
    disease: { english: "Late Blight", tamil: "late blight" },
    crop: { english: "Potato", tamil: "உருளைக்கிழங்கு" },
    advice: {
      english: "Apply fungicide immediately. Remove infected plants. Do not compost infected material.",
      tamil: "உடனடியாக பூச்சிக்கொல்லை த் தெளிக்கவும். தொற்று அடைந்த செடைகளை அகற்றவும். Compost செய்யாதீர்கள்."
    }
  },
  "Potato___healthy": {
    label: "Potato Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Potato", tamil: "உருளைக்கிழங்கு" },
    advice: {
      english: "Your potato plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் உருளைக்கிழங்க�� ஆ���ோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Raspberry___healthy": {
    label: "Raspberry Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Raspberry", tamil: "ராஸ்பெர்ரி" },
    advice: {
      english: "Your raspberry plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் ராஸ்பெர்ரி ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Soybean___healthy": {
    label: "Soybean Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Soybean", tamil: "சோய்பீன்ஸ்" },
    advice: {
      english: "Your soybean plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் சோய்பீன்ஸ் ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Squash___Powdery_mildew": {
    label: "Squash Powdery Mildew",
    disease: { english: "Powdery Mildew", tamil: "பவுடரி அழல்" },
    crop: { english: "Squash", tamil: "சுரக்காய்" },
    advice: {
      english: "Apply sulfur fungicide. Improve air circulation. Water at base of plant.",
      tamil: "சல்பர் பூச்சிக்கொல்லை த் தெளிக்கவும். காற்று சுழற்சியை மேம்படுத்தவும். செடையின் அடிப்பகுதியில் பாசனம் செய்யவும்."
    }
  },
  "Strawberry___Leaf_spot": {
    label: "Strawberry Leaf Spot",
    disease: { english: "Leaf Spot", tamil: "இலை புள்" },
    crop: { english: "Strawberry", tamil: "ஸ்ட்ராப்பெர்ரி" },
    advice: {
      english: "Remove infected leaves. Apply copper fungicide. Avoid overhead irrigation.",
      tamil: "தொற்று அடைந்த இலைகளை அகற்றவும். தங்க பூச்சிக்கொல்லை த் தெளிக்கவும். மேல் பாசனதத்தைத் தவிர்க்கவும்."
    }
  },
  "Strawberry___healthy": {
    label: "Strawberry Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Strawberry", tamil: "ஸ்ட்ராப்பெர்ரி" },
    advice: {
      english: "Your strawberry plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் ஸ்ட்ராப்பெர்ரி ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  },
  "Tomato___Bacterial_spot": {
    label: "Tomato Bacterial Spot",
    disease: { english: "Bacterial Spot", tamil: "பாக்டீரியல் புள்" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Apply copper bactericide. Rotate crops. Remove infected leaves.",
      tamil: "��ங்க பாக்டீரியல் கொல்லி த் தெளிக்கவும். பயிர் மாற்றுங்கள். தொற்று அடைந்த இலைகளை அகற்றவும்."
    }
  },
  "Tomato___Early_blight": {
    label: "Tomato Early Blight",
    disease: { english: "Early Blight", tamil: " awal blight" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Apply fungicide. Mulch around plants. Remove lower infected leaves.",
      tamil: "பூச்சிக்கொல்லை த் தெளிக்கவும். சுற்றியே mulching செய்யவும். கீழ் தொற்று அடைந்த இலைகளை அகற்றவும்."
    }
  },
  "Tomato___Late_blight": {
    label: "Tomato Late Blight",
    disease: { english: "Late Blight", tamil: "late blight" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Apply fungicide immediately. Remove infected plants. Do not compost infected material.",
      tamil: "உடனடியாக பூச்சிக்கொல்லை த் தெளிக்கவும். தொற்று அடைந்த செடைகளை அகற்றவும். Compost செய்யாதீர்கள்."
    }
  },
  "Tomato___Leaf_Mold": {
    label: "Tomato Leaf Mold",
    disease: { english: "Leaf Mold", tamil: "இலை அழுத்தம்" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Improve air circulation. Apply fungicide. Remove infected leaves.",
      tamil: "காற்று சுழற்சியை மேம்படுத்தவும். பூச்சிக்கொல்லை த் தெளிக்கவும். தொற்று அடைந்த இலைகளை அகற்றவும்."
    }
  },
  "Tomato___Septoria_leaf_spot": {
    label: "Tomato Septoria Leaf Spot",
    disease: { english: "Septoria Leaf Spot", tamil: "செப்டோரியா இலை புள்" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Remove infected leaves. Apply fungicide. Avoid overhead irrigation.",
      tamil: "தொற்று அடைந்த இலைகளை அகற்றவும். பூச்சிக்கொல்லை த் தெளிக்கவும். மேல் பாசனதத்தைத் தவிர்க்கவும்."
    }
  },
  "Tomato___Spider_mites": {
    label: "Tomato Spider Mites",
    disease: { english: "Spider Mites", tamil: "சிலந்தி உண்ணி" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Apply miticide. Spray water on leaves. Introduce predatory mites.",
      tamil: "மைடிசைட் த் தெளிக்கவும். இலைகளில் தண்ணீர் தெளிக்கவும். வேட்டைக் குறிப்பு உண்ணிகளை அறிமுகப்படுத்தவும்."
    }
  },
  "Tomato___Target_Spot": {
    label: "Tomato Target Spot",
    disease: { english: "Target Spot", tamil: "லக்கியம்" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Apply fungicide. Rotate crops. Remove infected debris.",
      tamil: "பூச்சிக்கொல்லை த் தெளிக்கவும். பயிர் மாற்றுங்கள். த���ற���று உடைய கழிவுகளை அகற்றவும்."
    }
  },
  "Tomato___Tomato_mosaic_virus": {
    label: "Tomato Mosaic Virus",
    disease: { english: "Mosaic Virus", tamil: "மொசைக் வைரஸ்" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Remove infected plants. Control aphids. Use virus-free seeds.",
      tamil: "தொற்று அடைந்த செடைகளை அகற்றவும். எப்பிட்களை கட்டுப்படுத்தவும். வைரஸ் இல்லாத விதைகளைப் பயன்படுத்தவும்."
    }
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    label: "Tomato Yellow Leaf Curl Virus",
    disease: { english: "Yellow Leaf Curl Virus", tamil: "மஞ்சள் இலை கரஞ்சும் வைரஸ்" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Control whiteflies. Remove infected plants. Use resistant varieties.",
      tamil: "வெள்ளை ஈக்களை கட்டுப்படுத்தவும். தொற்று அடைந்த செடைகளை அகற்றவும். தடுப்பு வகைகளைப் பயன்படுத்தவும்."
    }
  },
  "Tomato___healthy": {
    label: "Tomato Healthy",
    disease: { english: "Healthy", tamil: "ஆரோக்கியம்" },
    crop: { english: "Tomato", tamil: "தக்காளி" },
    advice: {
      english: "Your tomato plant looks healthy! Continue regular watering and monitoring.",
      tamil: "உங்கள் தக்காளி ஆரோக்கியமாக உள்ளது! தொடர்ந்து வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."
    }
  }
};

function mapLabelToDiseaseInfo(label: string): DiseaseInfo {
  if (DISEASE_DATABASE[label]) {
    return DISEASE_DATABASE[label];
  }
  
  const parts = label.split("___");
  const cropName = parts[0] || "Unknown";
  const diseaseName = parts[1] || "Unknown";
  
  return {
    label: diseaseName,
    disease: { english: diseaseName, tamil: diseaseName },
    crop: { english: cropName, tamil: cropName },
    advice: {
      english: "Please consult a local agricultural officer for specific advice.",
      tamil: "குறிப்பிட்ட ஆலோசனைக்கு தயவுசெய்து உள்ளூர் விவசாய அதிகாரியைத் தொடர்பு கொள்ளவும்."
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured. Please add HF_API_KEY in Vercel environment variables." },
        { status: 500 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });
    
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("Hugging Face API error:", errorText);
      return NextResponse.json(
        { error: "Failed to analyze image. Please try again." },
        { status: 500 }
      );
    }
    
    const predictions = await hfResponse.json() as Array<{ label: string; score: number }>;
    
    if (!predictions || predictions.length === 0) {
      return NextResponse.json(
        { error: "No predictions returned" },
        { status: 500 }
      );
    }
    
    const topPrediction = predictions[0];
    const diseaseInfo = mapLabelToDiseaseInfo(topPrediction.label);
    
    const response = {
      success: true,
      result: {
        label: diseaseInfo.label,
        disease: diseaseInfo.disease,
        crop: diseaseInfo.crop,
        confidence: Math.round(topPrediction.score * 100),
        advice: diseaseInfo.advice,
        allPredictions: predictions.slice(0, 5).map((p) => {
          const info = mapLabelToDiseaseInfo(p.label);
          return {
            score: Math.round(p.score * 100),
            disease: info.disease,
            crop: info.crop,
          };
        }),
      },
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Detection error:", error);
    return NextResponse.json(
      { error: "An error occurred during detection. Please try again." },
      { status: 500 }
    );
  }
}