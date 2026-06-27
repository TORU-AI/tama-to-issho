import React, { useState, useEffect } from "react";
import { 
  PawPrint, 
  MessageSquare, 
  Heart, 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake, 
  CloudLightning,
  AlertCircle
} from "lucide-react";
import { WeatherInfo, UserSettings } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HomeTabProps {
  weather: WeatherInfo | null;
  loadingWeather: boolean;
  boke: string;
  loadingBoke: boolean;
  settings: UserSettings;
  onNavigate: (tab: 'home' | 'chat' | 'history' | 'settings' | 'walk') => void;
  onQuickCheckIn: () => void;
  onMeow: () => void;
  meowTrigger: number;
}

export default function HomeTab({
  weather,
  loadingWeather,
  boke,
  loadingBoke,
  settings,
  onNavigate,
  onQuickCheckIn,
  onMeow,
  meowTrigger
}: HomeTabProps) {
  const [greeting, setGreeting] = useState("おはよう、");
  const [tapEffect, setTapEffect] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting("おはよう、");
    } else if (hour >= 11 && hour < 18) {
      setGreeting("こんにちは、");
    } else {
      setGreeting("こんばんは、");
    }
  }, []);

  const handleCatTap = () => {
    onMeow();
    setTapEffect(true);
    setTimeout(() => setTapEffect(false), 500);
  };

  // Get matching weather icon
  const getWeatherIcon = (cond: string) => {
    if (cond.includes("雨")) return <CloudRain className="w-10 h-10 text-blue-500 animate-bounce" />;
    if (cond.includes("くもり") || cond.includes("曇")) return <Cloud className="w-10 h-10 text-gray-400" />;
    if (cond.includes("雪")) return <Snowflake className="w-10 h-10 text-sky-300 animate-spin" />;
    if (cond.includes("雷")) return <CloudLightning className="w-10 h-10 text-yellow-500" />;
    return <Sun className="w-10 h-10 text-amber-500 animate-pulse" />;
  };

  // Map settings text size to tailwind classes
  const getTextSizeClass = () => {
    if (settings.textSize === "large") return "text-[26px] leading-relaxed";
    if (settings.textSize === "huge") return "text-[32px] leading-relaxed";
    return "text-[22px] leading-relaxed";
  };

  const getHeadlineSizeClass = () => {
    if (settings.textSize === "large") return "text-4xl";
    if (settings.textSize === "huge") return "text-5xl";
    return "text-3xl";
  };

  return (
    <div className="space-y-10">
      {/* Greeting Section */}
      <section className="text-left py-2">
        <h2 className={`${getHeadlineSizeClass()} font-extrabold text-on-background leading-tight`}>
          {greeting}
          <br />
          <span className="text-primary underline decoration-primary-fixed decoration-wavy">
            {settings.userName}！
          </span>
        </h2>
      </section>

      {/* Tama Section */}
      <section className="relative flex flex-col items-center">
        {/* Central Illustration of Tama */}
        <div 
          onClick={handleCatTap}
          className="w-64 h-64 relative mb-6 cursor-pointer select-none active:scale-95 transition-transform"
        >
          <motion.img 
            animate={
              tapEffect 
                ? { scale: [1, 1.15, 0.95, 1], rotate: [0, 8, -8, 0] } 
                : { y: [0, -6, 0] }
            }
            transition={
              tapEffect 
                ? { duration: 0.5 } 
                : { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }
            alt="たま（手書き風の猫）" 
            className="w-full h-full object-contain filter drop-shadow-md" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJzV9W11iBWAN2vK41UvcNTwO1N8vHvdNBneVAmMSRMJjbAVGyTW5kiktYCyMy3swbY9NsA3fNkzpayZKoCmgbNUR93y5HJMFJ7MGqxtSJkHbp-C3bCKDviWfbdMiSVMcFEGXDX2cquxq58NuZQjuL-TxRZSws_Ozym9PYrOxz5gtsVpliUhyJnh3qkB_VPe2GkUK0ZMW6waCXdCQysl3JNuXJixNo6u8wZbRLubpOZBGVAso4DGh9cs2jhRuMKbOKNj3rQW9CTdEc"
          />
          <AnimatePresence>
            {tapEffect && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: -40, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 right-4 bg-primary-container text-on-primary-container font-extrabold px-4 py-2 rounded-full border-2 border-outline shadow-md"
              >
                にゃ〜ん！🐾
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Speech Bubble */}
        <div className="speech-bubble p-6 w-full shadow-md bg-white border-4 border-outline rounded-3xl relative z-10">
          {loadingBoke ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-outline">たまがボケを考えているにゃ...</p>
            </div>
          ) : (
            <p className={`${getTextSizeClass()} text-on-surface font-extrabold text-center italic`}>
              「{boke}」
            </p>
          )}
        </div>
        <p className="text-sm text-outline font-bold mt-2 text-center animate-pulse">
          🐾 たまの画像をタップすると meow 鳴くよ！
        </p>
      </section>

      {/* Action Buttons */}
      <section className="grid grid-cols-1 gap-6">
        {/* Primary Action: Talk with Tama */}
        <button 
          id="btn-talk"
          onClick={() => onNavigate('chat')}
          className="btn-press active-sink w-full h-[120px] flex items-center justify-center gap-4 bg-primary text-on-primary rounded-3xl shadow-lg border-b-8 border-on-primary-fixed-variant cursor-pointer select-none"
        >
          <MessageSquare className="w-12 h-12 stroke-[3]" />
          <span className="text-[26px] font-black">たまにおしゃべり</span>
        </button>

        {/* Walk Action: Walk with Tama */}
        <button 
          id="btn-walk"
          onClick={() => onNavigate('walk')}
          className="btn-press active-sink w-full h-[120px] flex items-center justify-center gap-4 bg-tertiary-container text-on-tertiary-container rounded-3xl shadow-lg border-b-8 border-tertiary cursor-pointer select-none"
        >
          <PawPrint className="w-12 h-12 stroke-[3] fill-current animate-pulse" />
          <span className="text-[26px] font-black">たまとお散歩に行く🐾</span>
        </button>

        {/* Secondary Action: I'm Doing Well! */}
        <button 
          id="btn-checkin"
          onClick={onQuickCheckIn}
          className="btn-press active-sink w-full h-[120px] flex items-center justify-center gap-4 bg-secondary text-on-secondary rounded-3xl shadow-lg border-b-8 border-on-secondary-fixed-variant cursor-pointer select-none"
        >
          <Heart className="w-12 h-12 stroke-[3]" />
          <span className="text-[26px] font-black">元気だよ！</span>
        </button>
      </section>

      {/* Weather/Status Island (Extra Homely Detail grounded by Google Search) */}
      <section className="hand-drawn-border p-6 bg-surface-container-lowest rounded-3xl">
        {loadingWeather ? (
          <div className="flex items-center justify-center py-4 gap-4">
            <div className="w-6 h-6 border-3 border-tertiary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-bold text-on-surface-variant">今日の本当の天気を調べているにゃ...</span>
          </div>
        ) : weather ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weather.condition)}
                <div>
                  <h4 className="text-xl font-black text-on-surface-variant">現在の天気 ({weather.condition})</h4>
                  <p className="text-sm text-outline font-bold">Google検索のリアルデータ</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-primary">{weather.temperature}℃</span>
              </div>
            </div>
            
            <div className="p-4 bg-surface-container rounded-2xl border-2 border-outline-variant">
              <p className="text-lg font-bold text-on-surface-variant leading-relaxed">
                {weather.description}
              </p>
            </div>
            {weather.sourceUrl && (
              <div className="text-right">
                <a 
                  href={weather.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-tertiary hover:underline inline-flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  天気情報の検索元を見る
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2 text-outline font-bold">
            天気情報の読み込みに失敗しました。
          </div>
        )}
      </section>
    </div>
  );
}
