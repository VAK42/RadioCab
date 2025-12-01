'use client';
import { Button } from "../components/ui/button";
import { useLanguage } from "./languageContext";
import { Globe } from "lucide-react";
export default function languageToggle() {
  const { language, setLanguage } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };
  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 transition-all duration-300">
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'vi' ? 'VN' : 'EN'}
      </span>
    </Button>
  )
}