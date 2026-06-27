import React, { useState, useEffect, useRef } from "react";
import { 
  PawPrint, 
  Play, 
  Square, 
  ArrowLeft, 
  Flame, 
  Footprints, 
  Clock, 
  Sun,
  Award
} from "lucide-react";
import { UserSettings } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface WalkTabProps {
  settings: UserSettings;
  onSaveWalk: (minutes: number, calories: number, steps: number) => void;
  onBack: () => void;
  speakText: (text: string) => void;
}

const TAMA_CHEERS = [
  "一歩、二歩、トコトコ歩いて楽しいにゃ🐾",
  "おひさまがぽかぽかで、お骨が喜んでいるのがわかるにゃん☀️",
  "いい調子にゃ！背筋をピンと伸ばして歩くと気持ちいいにゃ♪",
  "焦らずのんびり、たまのペースに合わせるにゃん🐾",
  "水分補給も忘れずににゃ！お茶を一口のむにゃん☕"
];

export default function WalkTab({
  settings,
  onSaveWalk,
  onBack,
  speakText
}: WalkTabProps) {
  const [isWalking, setIsWalking] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [currentCheer, setCurrentCheer] = useState("いっしょにお散歩に行こうにゃ！日光浴は骨にいいんだにゃ♪");
  const [showResult, setShowResult] = useState(false);
  const [finalMetrics, setFinalMetrics] = useState({ minutes: 0, steps: 0, calories: 0 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cheerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Text size classes matching the settings
  const getTextSizeClass = () => {
    if (settings.textSize === "large") return "text-[26px] leading-relaxed";
    if (settings.textSize === "huge") return "text-[32px] leading-relaxed";
    return "text-[22px] leading-relaxed";
  };

  const getButtonTextSizeClass = () => {
    if (settings.textSize === "huge") return "text-3xl";
    return "text-2xl";
  };

  // 1. Walk Timer and Cheering Logic
  useEffect(() => {
    if (isWalking) {
      // Speak on start
      speakText("お散歩スタートにゃ！背筋をのばして、お日様をあびながら出発にゃ🐾");

      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      cheerTimerRef.current = setInterval(() => {
        const randomCheer = TAMA_CHEERS[Math.floor(Math.random() * TAMA_CHEERS.length)];
        setCurrentCheer(randomCheer);
        speakText(randomCheer);
      }, 15000); // Cheer every 15 seconds
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cheerTimerRef.current) clearInterval(cheerTimerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cheerTimerRef.current) clearInterval(cheerTimerRef.current);
    };
  }, [isWalking]);

  // Handle start
  const handleStart = () => {
    setTimeElapsed(0);
    setShowResult(false);
    setIsWalking(true);
  };

  // Handle stop and calculate final stats
  const handleStop = () => {
    setIsWalking(false);
    
    // Calculations
    const finalSeconds = timeElapsed;
    const finalMinutes = Math.max(1, Math.round(finalSeconds / 60));
    
    // Step count estimate: approx. 100 steps per minute
    // 100 / 60 = 1.66 steps per second
    const finalSteps = Math.round(finalSeconds * 1.66);

    // METs Calculation: METs (slow walk = 3.0) * weight * hours
    const userWeight = settings.weight ?? 60;
    const hours = finalSeconds / 3600;
    const finalCalories = Math.round(3.0 * userWeight * hours * 10) / 10; // 1 decimal place

    setFinalMetrics({
      minutes: finalMinutes,
      steps: finalSteps,
      calories: finalCalories
    });
    
    setShowResult(true);

    // Speak on completion
    const congratsMsg = `よくがんばったにゃ！お骨が喜んでるにゃ♪ 今日は${finalMinutes}分お散歩できたにゃん🐾`;
    speakText(congratsMsg);

    // Automatically save history item
    onSaveWalk(finalMinutes, finalCalories, finalSteps);
  };

  // Helper to format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header back navigation */}
      <div className="flex items-center justify-between border-b-4 border-outline pb-4">
        <button 
          onClick={onBack}
          className="btn-press flex items-center gap-2 bg-white hover:bg-surface-container px-4 py-2.5 rounded-2xl border-3 border-outline font-black text-lg select-none cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          戻る
        </button>
        <span className="text-2xl font-black text-on-surface-variant flex items-center gap-2">
          <PawPrint className="w-7 h-7 stroke-[3] text-primary" />
          たまとお散歩
        </span>
        <div className="w-16"></div> {/* Spacer to center title */}
      </div>

      {!showResult ? (
        <div className="space-y-6">
          {/* Walking Tama Character Card */}
          <div className="relative flex flex-col items-center py-6 bg-surface-container-lowest hand-drawn-border p-6 rounded-3xl">
            {/* Bobbing walking Tama illustration */}
            <div className="w-56 h-56 relative mb-4">
              <motion.img 
                animate={
                  isWalking 
                    ? { 
                        y: [0, -12, 0], 
                        rotate: [-6, 6, -6],
                        scale: [1, 1.05, 1]
                      } 
                    : { y: [0, -4, 0] }
                }
                transition={
                  isWalking 
                    ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } 
                    : { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }
                alt="たま（お散歩スタイル）" 
                className="w-full h-full object-contain filter drop-shadow-md" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJzV9W11iBWAN2vK41UvcNTwO1N8vHvdNBneVAmMSRMJjbAVGyTW5kiktYCyMy3swbY9NsA3fNkzpayZKoCmgbNUR93y5HJMFJ7MGqxtSJkHbp-C3bCKDviWfbdMiSVMcFEGXDX2cquxq58NuZQjuL-TxRZSws_Ozym9PYrOxz5gtsVpliUhyJnh3qkB_VPe2GkUK0ZMW6waCXdCQysl3JNuXJixNo6u8wZbRLubpOZBGVAso4DGh9cs2jhRuMKbOKNj3rQW9CTdEc"
              />
              {isWalking && (
                <div className="absolute -bottom-2 flex gap-1 w-full justify-center">
                  <span className="text-2xl animate-bounce delay-100">🐾</span>
                  <span className="text-2xl animate-bounce delay-300">🐾</span>
                </div>
              )}
            </div>

            {/* Speach bubble */}
            <div className="speech-bubble p-6 w-full bg-white border-4 border-outline rounded-3xl relative z-10">
              <p className={`${getTextSizeClass()} text-on-surface font-black text-center italic`}>
                「{currentCheer}」
              </p>
            </div>
          </div>

          {/* Core Walk Screen Controls */}
          <div className="bg-surface-container-high rounded-3xl p-6 border-4 border-outline text-center space-y-6 shadow-md">
            {isWalking ? (
              <div className="space-y-4">
                <span className="text-lg font-black text-outline tracking-wider block">お散歩タイム</span>
                {/* Huge timer display */}
                <h3 className="text-6xl md:text-7xl font-extrabold text-primary font-mono tracking-wider animate-pulse">
                  {formatTime(timeElapsed)}
                </h3>
                
                {/* Estimated active counters */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-3 rounded-2xl border-2 border-outline-variant flex flex-col items-center">
                    <Footprints className="w-8 h-8 text-[#596332] mb-1" />
                    <span className="text-xs font-black text-outline">歩数のめやす</span>
                    <span className="text-2xl font-extrabold text-[#596332]">
                      {Math.round(timeElapsed * 1.66)} 歩
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border-2 border-outline-variant flex flex-col items-center">
                    <Flame className="w-8 h-8 text-[#944524] mb-1" />
                    <span className="text-xs font-black text-outline">消費エネルギー</span>
                    <span className="text-2xl font-extrabold text-[#944524]">
                      {Math.round(3.0 * (settings.weight ?? 60) * (timeElapsed / 3600) * 10) / 10} kcal
                    </span>
                  </div>
                </div>

                <p className="text-base font-bold text-outline animate-pulse flex items-center justify-center gap-1.5">
                  <Sun className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                  日光を浴びることで、骨を丈夫にするビタミンDが作られるにゃん🐾
                </p>

                {/* Big Stop Button */}
                <button
                  onClick={handleStop}
                  className="btn-press w-full h-24 bg-[#E07A5F] hover:bg-[#D56B4E] text-white rounded-2xl border-b-8 border-[#A64F37] font-black text-3xl shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Square className="w-8 h-8 fill-white" />
                  お散歩おわり
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-surface-container p-4 rounded-2xl border-2 border-dashed border-outline-variant space-y-2">
                  <h4 className="text-xl font-black text-on-surface">骨粗鬆症の予防に！</h4>
                  <p className="text-base text-on-surface-variant font-bold leading-relaxed">
                    ゆっくり歩く（METs 3.0）ことで骨に適度な負荷がかかり、お日様の下での日光浴が骨作りに不可欠なビタミンDの生成をうながしますにゃ。
                  </p>
                </div>

                {/* Big Start Button */}
                <button
                  onClick={handleStart}
                  className="btn-press w-full h-28 bg-[#596332] hover:bg-[#4E562A] text-white rounded-3xl border-b-8 border-[#3A421D] font-black text-3xl shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Play className="w-10 h-10 fill-white" />
                  お散歩スタート🐾
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Walking Result Card */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 rounded-3xl p-6 border-4 border-outline shadow-xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2 border-b-4 border-dashed border-outline-variant pb-4">
            <div className="inline-flex items-center justify-center bg-[#596332] text-white rounded-full p-4 border-2 border-outline shadow-md mb-2">
              <Award className="w-12 h-12 stroke-[2.5]" />
            </div>
            <h3 className="text-4xl font-extrabold text-on-surface">お散歩が完了したにゃ！</h3>
            <p className="text-lg text-[#596332] font-black">よくがんばりました！骨がとっても喜んでるにゃ🐾</p>
          </div>

          {/* Metrics Displays with Giant Clear Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time */}
            <div className="bg-white p-5 rounded-2xl border-3 border-outline shadow-sm flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full border border-blue-300">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-black text-outline block">歩いた時間</span>
                <span className="text-3xl font-black text-on-surface">{finalMetrics.minutes}</span>
                <span className="text-lg font-bold text-on-surface ml-1">分</span>
              </div>
            </div>

            {/* Estimated Steps */}
            <div className="bg-white p-5 rounded-2xl border-3 border-outline shadow-sm flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full border border-green-300">
                <Footprints className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-black text-outline block">推定歩数</span>
                <span className="text-3xl font-black text-on-surface">{finalMetrics.steps}</span>
                <span className="text-lg font-bold text-on-surface ml-1">歩</span>
              </div>
            </div>

            {/* Calories */}
            <div className="bg-white p-5 rounded-2xl border-3 border-outline shadow-sm flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full border border-orange-300">
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <span className="text-sm font-black text-outline block">消費エネルギー</span>
                <span className="text-3xl font-black text-on-surface">{finalMetrics.calories}</span>
                <span className="text-lg font-bold text-on-surface ml-1">kcal</span>
              </div>
            </div>
          </div>

          {/* Custom Weight Note */}
          <div className="p-4 bg-white/70 rounded-xl border-2 border-outline-variant text-sm font-bold text-outline text-center">
            💡 体重 <span className="text-primary font-black">{settings.weight ?? 60}kg</span> で計算しています（設定画面で変更できます）。
          </div>

          {/* Tama's feedback speech bubble */}
          <div className="bg-white p-5 rounded-2xl border-3 border-outline space-y-2">
            <p className={`${getTextSizeClass()} text-on-surface font-black text-center italic`}>
              「日光を浴びることでお骨の力がぐんぐん育つにゃ！今日のお散歩、とってもえらかったにゃん🐾」
            </p>
          </div>

          {/* Action to go back home */}
          <button
            onClick={onBack}
            className="btn-press w-full h-20 bg-primary text-on-primary rounded-2xl border-b-8 border-on-primary-fixed-variant font-black text-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            マイホームへ戻る 🐾
          </button>
        </motion.div>
      )}
    </div>
  );
}
