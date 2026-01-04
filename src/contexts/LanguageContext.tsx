import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ne" | "mai";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.verify": "Verify",
    "nav.dashboard": "Dashboard",
    "nav.community": "Community",
    "nav.analytics": "Analytics",
    "hero.badge": "Nepal's Official Truth Verification Platform",
    "hero.title1": "Defend Against",
    "hero.title2": "Digital Deception",
    "hero.subtitle": "AI-powered detection of deepfakes, fake news, and manipulated content. Verify anything in seconds — in Nepali, English, and local languages.",
    "hero.method.upload": "Upload",
    "hero.method.upload.desc": "Image, Video, Audio",
    "hero.method.link": "URL",
    "hero.method.link.desc": "Website or Social",
    "hero.method.text": "Text",
    "hero.method.text.desc": "WhatsApp, FB",
    "hero.upload.title": "Drop file here or browse",
    "hero.upload.desc": "Supports images, videos, audio up to 50MB",
    "hero.input.link": "Paste a URL to verify...",
    "hero.input.text": "Paste text from WhatsApp, Facebook, etc...",
    "hero.button.scan": "Scan",
    "hero.button.initialize": "Initialize Scan",
    "hero.trust.free": "Free to use",
    "hero.trust.noaccount": "No account required",
    "hero.trust.results": "Results in seconds",
    "hero.stats.scans": "Scans",
    "hero.stats.accuracy": "Accuracy",
    "hero.stats.active": "Active",
    "hero.stats.languages": "Languages",
    "features.badge": "Detection Systems",
    "features.title1": "Advanced",
    "features.title2": "Detection",
    "features.title3": "Capabilities",
    "features.subtitle": "Multi-layered AI analysis protects against all forms of digital misinformation targeting Nepal's information ecosystem.",
    "features.f1.title": "Fake News Detection",
    "features.f1.desc": "AI analyzes text content for misinformation patterns, propaganda techniques, and false claims using Nepal-specific context.",
    "features.f2.title": "Deepfake Image Detection",
    "features.f2.desc": "Advanced neural networks detect AI-generated faces, manipulated photos, and synthetic imagery with 98%+ accuracy.",
    "features.f3.title": "Video Manipulation Analysis",
    "features.f3.desc": "Frame-by-frame analysis identifies edited videos, face swaps, and artificially generated video content.",
    "features.f4.title": "Audio Deepfake Detection",
    "features.f4.desc": "Voice cloning and synthetic audio detection to protect against audio-based misinformation campaigns.",
    "features.f5.title": "Multilingual Support",
    "features.f5.desc": "Full support for Nepali, English, Maithili, Bhojpuri, and other regional languages spoken in Nepal.",
    "features.f6.title": "Phishing & Scam Detection",
    "features.f6.desc": "Identifies fraudulent links, scam messages, and phishing attempts targeting Nepali citizens.",
    "profile.title": "User Profile",
    "profile.username": "Username",
    "profile.email": "Email",
    "profile.update": "Update Profile"
  },
  ne: {
    "nav.verify": "प्रमाणित गर्नुहोस्",
    "nav.dashboard": "ड्यासबोर्ड",
    "nav.community": "समुदाय",
    "nav.analytics": "विश्लेषण",
    "hero.badge": "नेपालको आधिकारिक सत्य प्रमाणीकरण प्लेटफर्म",
    "hero.title1": "विरुद्ध रक्षा गर्नुहोस्",
    "hero.title2": "डिजिटल छल",
    "hero.subtitle": "डीपफेक, फेक न्यूज र हेरफेर गरिएका सामग्रीहरूको AI-द्वारा सञ्चालित पहिचान। सेकेन्डमै जे पनि प्रमाणित गर्नुहोस् - नेपाली, अंग्रेजी र स्थानीय भाषाहरूमा।",
    "hero.method.upload": "अपलोड",
    "hero.method.upload.desc": "फोटो, भिडियो, अडियो",
    "hero.method.link": "लिंक",
    "hero.method.link.desc": "वेबसाइट वा सामाजिक सञ्जाल",
    "hero.method.text": "पाठ",
    "hero.method.text.desc": "व्हाट्सएप, फेसबुक",
    "hero.upload.title": "फाइल यहाँ छोड्नुहोस् वा ब्राउज गर्नुहोस्",
    "hero.upload.desc": "५०MB सम्मका फोटो, भिडियो, अडियो समर्थन गर्दछ",
    "hero.input.link": "प्रमाणित गर्न URL टाँस्नुहोस्...",
    "hero.input.text": "व्हाट्सएप, फेसबुक, आदिबाट पाठ टाँस्नुहोस्...",
    "hero.button.scan": "स्क्यान",
    "hero.button.initialize": "स्क्यान सुरु गर्नुहोस्",
    "hero.trust.free": "प्रयोग गर्न नि:शुल्क",
    "hero.trust.noaccount": "खाता आवश्यक छैन",
    "hero.trust.results": "सेकेन्डमै नतिजा",
    "hero.stats.scans": "स्क्यानहरू",
    "hero.stats.accuracy": "सटीकता",
    "hero.stats.active": "सक्रिय",
    "hero.stats.languages": "भाषाहरू",
    "features.badge": "पहिचान प्रणाली",
    "features.title1": "उन्नत",
    "features.title2": "पहिचान",
    "features.title3": "क्षमताहरू",
    "features.subtitle": "बहु-स्तरिय AI विश्लेषणले नेपालको सूचना प्रणालीलाई लक्षित गर्ने सबै प्रकारका डिजिटल गलत सूचनाहरू विरुद्ध सुरक्षा प्रदान गर्दछ।",
    "features.f1.title": "फेक न्यूज पहिचान",
    "features.f1.desc": "AI ले नेपाल-विशिष्ट सन्दर्भ प्रयोग गरी गलत सूचना ढाँचाहरू, प्रचार प्रविधिहरू, र गलत दाबीहरूको लागि पाठ सामग्री विश्लेषण गर्दछ।",
    "features.f2.title": "डीपफेक फोटो पहिचान",
    "features.f2.desc": "उन्नत न्यूरल नेटवर्कहरूले AI-द्वारा निर्मित अनुहारहरू, हेरफेर गरिएका फोटोहरू, र कृत्रिम चित्रणहरू ९८%+ सटीकताका साथ पत्ता लगाउँछन्।",
    "features.f3.title": "भिडियो हेरफेर विश्लेषण",
    "features.f3.desc": "फ्रेम-दर-फ्रेम विश्लेषणले सम्पादन गरिएका भिडियोहरू, अनुहार परिवर्तन, र कृत्रिम रूपमा निर्मित भिडियो सामग्री पहिचान गर्दछ।",
    "features.f4.title": "अडियो डीपफेक पहिचान",
    "features.f4.desc": "अडियो-आधारित गलत सूचना अभियानहरू विरुद्ध सुरक्षा गर्न आवाज क्लोनिङ र कृत्रिम अडियो पहिचान।",
    "features.f5.title": "बहुभाषिक समर्थन",
    "features.f5.desc": "नेपालमा बोलिने नेपाली, अंग्रेजी, मैथिली, भोजपुरी र अन्य क्षेत्रीय भाषाहरूको पूर्ण समर्थन।",
    "features.f6.title": "फिसिङ र घोटाला पहिचान",
    "features.f6.desc": "नेपाली नागरिकहरूलाई लक्षित गर्ने धोखाधडी लिङ्कहरू, घोटाला सन्देशहरू, र फिसिङ प्रयासहरू पहिचान गर्दछ।",
    "profile.title": "प्रयोगकर्ता प्रोफाइल",
    "profile.username": "प्रयोगकर्ता नाम",
    "profile.email": "इमेल",
    "profile.update": "प्रोफाइल अपडेट गर्नुहोस्"
  },
  mai: {
    "nav.verify": "सत्यापित करू",
    "nav.dashboard": "ड्यासबोर्ड",
    "nav.community": "समुदाय",
    "nav.analytics": "विश्लेषण",
    "hero.badge": "नेपालक आधिकारिक सत्य प्रमाणीकरण प्लेटफर्म",
    "hero.title1": "विरुद्ध रक्षा करू",
    "hero.title2": "डिजिटल छल",
    "hero.subtitle": "डीपफेक, फेक न्यूज आर हेरफेर कएल गेल सामग्रीक AI-द्वारा संचालित पहिचान। सेकेन्डमे किछुओ प्रमाणित करू - नेपाली, अंग्रेजी आर स्थानीय भाषामे।",
    "hero.method.upload": "अपलोड",
    "hero.method.upload.desc": "फोटो, भिडियो, अडियो",
    "hero.method.link": "लिंक",
    "hero.method.link.desc": "वेबसाइट वा सामाजिक सञ्जाल",
    "hero.method.text": "पाठ",
    "hero.method.text.desc": "व्हाट्सएप, फेसबुक",
    "hero.upload.title": "फाइल एतय छोडू वा ब्राउज करू",
    "hero.upload.desc": "५०MB धरिक फोटो, भिडियो, अडियो समर्थन करैत अछि",
    "hero.input.link": "प्रमाणित करबाक लेल URL टाँसू...",
    "hero.input.text": "व्हाट्सएप, फेसबुक, आदि सँ पाठ टाँसू...",
    "hero.button.scan": "स्क्यान",
    "hero.button.initialize": "स्क्यान सुरु करू",
    "hero.trust.free": "प्रयोग करबाक लेल नि:शुल्क",
    "hero.trust.noaccount": "खाताक आवश्यकता नहि",
    "hero.trust.results": "सेकेन्डमे नतिजा",
    "hero.stats.scans": "स्क्यान सभ",
    "hero.stats.accuracy": "सटीकता",
    "hero.stats.active": "सक्रिय",
    "hero.stats.languages": "भाषा सभ",
    "features.badge": "पहिचान प्रणाली",
    "features.title1": "उन्नत",
    "features.title2": "पहिचान",
    "features.title3": "क्षमता सभ",
    "features.subtitle": "बहु-स्तरिय AI विश्लेषण नेपालक सूचना प्रणालीकेँ लक्षित करय बला सभ प्रकारक डिजिटल गलत सूचनाक विरुद्ध सुरक्षा प्रदान करैत अछि।",
    "features.f1.title": "फेक न्यूज पहिचान",
    "features.f1.desc": "AI नेपाल-विशिष्ट सन्दर्भक प्रयोग कए गलत सूचनाक ढाँचा, प्रचार प्रविधि आर गलत दाबीक लेल पाठ सामग्रीक विश्लेषण करैत अछि।",
    "features.f2.title": "डीपफेक फोटो पहिचान",
    "features.f2.desc": "उन्नत न्यूरल नेटवर्क सभ AI-द्वारा निर्मित चेहरा, हेरफेर कएल गेल फोटो आर कृत्रिम चित्रण ९८%+ सटीकताक साथ पत्ता लगाबैत अछि।",
    "features.f3.title": "भिडियो हेरफेर विश्लेषण",
    "features.f3.desc": "फ्रेम-दर-फ्रेम विश्लेषण सम्पादन कएल गेल भिडियो, चेहरा परिवर्तन आर कृत्रिम रूप सँ निर्मित भिडियो सामग्री पहिचान करैत अछि।",
    "features.f4.title": "अडियो डीपफेक पहिचान",
    "features.f4.desc": "अडियो-आधारित गलत सूचना अभियानक विरुद्ध सुरक्षाक लेल आवाज क्लोनिङ आर कृत्रिम अडियो पहिचान।",
    "features.f5.title": "बहुभाषिक समर्थन",
    "features.f5.desc": "नेपालमे बोलल जाए बला नेपाली, अंग्रेजी, मैथिली, भोजपुरी आर अन्य क्षेत्रीय भाषाक पूर्ण समर्थन।",
    "features.f6.title": "फिसिङ आर घोटाला पहिचान",
    "features.f6.desc": "नेपाली नागरिककेँ लक्षित करय बला धोखाधडी लिंक, घोटाला सन्देश आर फिसिङ प्रयास पहिचान करैत अछि।",
    "profile.title": "उपयोगकर्ता प्रोफाइल",
    "profile.username": "उपयोगकर्ता नाम",
    "profile.email": "इमेल",
    "profile.update": "प्रोफाइल अपडेट करू"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
