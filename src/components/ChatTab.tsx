import React, { useState, useRef, useEffect } from "react";
import { 
  CheckCircle2, 
  Smile, 
  Send, 
  RefreshCw,
  Loader2,
  Heart,
  Music
} from "lucide-react";
import { ChatMessage, UserSettings, WeatherInfo } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatTabProps {
  messages: ChatMessage[];
  weather: WeatherInfo | null;
  loadingReply: boolean;
  boke: string;
  settings: UserSettings;
  onSendAction: (action: 'correct' | 'laugh', customText?: string) => void;
  onReloadBoke: () => void;
}

export default function ChatTab({
  messages,
  weather,
  loadingReply,
  boke,
  settings,
  onSendAction,
  onReloadBoke
}: ChatTabProps) {
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingReply]);

  const handleSendCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendAction('correct', inputText);
    setInputText("");
  };

  const handleQuickSuggestion = (text: string) => {
    onSendAction('correct', text);
  };

  // Map settings text size to tailwind classes
  const getTextSizeClass = () => {
    if (settings.textSize === "large") return "text-[24px] leading-relaxed";
    if (settings.textSize === "huge") return "text-[28px] leading-relaxed";
    return "text-[20px] leading-relaxed";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[800px]">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-outline-variant">
        <div>
          <h3 className="text-xl font-black text-on-background">たまとの会話</h3>
          <p className="text-sm text-outline font-bold">ツッコミやメッセージを送ろう</p>
        </div>
        <button
          onClick={onReloadBoke}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest active:scale-95 transition-all text-primary font-bold rounded-full border-2 border-outline text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          新しいボケを聞く
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 no-scrollbar">
        {messages.map((msg, index) => {
          const isTama = msg.sender === 'tama';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-4 max-w-[90%] ${isTama ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-outline shadow-sm ${isTama ? "bg-primary-fixed" : "bg-secondary-fixed"}`}>
                {isTama ? (
                  <img 
                    alt="たま" 
                    className="w-full h-full object-cover scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJzV9W11iBWAN2vK41UvcNTwO1N8vHvdNBneVAmMSRMJjbAVGyTW5kiktYCyMy3swbY9NsA3fNkzpayZKoCmgbNUR93y5HJMFJ7MGqxtSJkHbp-C3bCKDviWfbdMiSVMcFEGXDX2cquxq58NuZQjuL-TxRZSws_Ozym9PYrOxz5gtsVpliUhyJnh3qkB_VPe2GkUK0ZMW6waCXdCQysl3JNuXJixNo6u8wZbRLubpOZBGVAso4DGh9cs2jhRuMKbOKNj3rQW9CTdEc"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary text-on-secondary font-black text-xl">
                    {settings.userName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Message Content Bubble */}
              <div className={`p-5 rounded-2xl hand-drawn-card relative ${isTama ? "bg-surface-container-high text-on-surface w-full" : "bg-primary text-on-primary border-primary-container"}`}>
                <p className={`${getTextSizeClass()} font-black`}>
                  {msg.text}
                </p>

                {/* Retro DJ Tama "Today's Select" Block */}
                {isTama && msg.song && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 p-5 rounded-2xl border-4 border-outline bg-amber-50 text-on-surface shadow-md space-y-4"
                  >
                    {/* Header line with nostalgic musical style */}
                    <div className="flex items-center justify-between border-b-2 border-outline-variant pb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary text-on-primary font-black text-sm px-3 py-1.5 rounded-full border-2 border-outline shadow-sm">
                          <Music className="w-4 h-4 fill-current animate-bounce" />
                          今日のたまセレクト♪
                        </span>
                      </div>
                      <span className="text-sm font-black text-primary bg-primary-container px-2.5 py-1 rounded-md border-2 border-outline">
                        DJたま
                      </span>
                    </div>

                    {/* DJ voice commentary with slightly larger font */}
                    <div className="p-3 bg-white/70 rounded-xl border-2 border-dashed border-outline-variant">
                      <p className="text-lg font-bold text-on-surface italic leading-relaxed">
                        「{msg.song.commentary}」
                      </p>
                    </div>

                    {/* Real-world song details displayed with extra large text for senior accessibility */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-outline tracking-wider block">今日の一曲</span>
                        <h4 className="text-[26px] md:text-[30px] font-black text-on-surface leading-tight tracking-tight">
                          {msg.song.title}
                        </h4>
                        <p className="text-xl font-bold text-primary flex items-center gap-1.5">
                          歌手: <span className="underline decoration-2">{msg.song.artist}</span>
                        </p>
                      </div>

                      {/* Giant comfortable round play button to open YouTube in new tab */}
                      <a
                        href={msg.song.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-press flex items-center justify-center gap-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-black text-xl px-8 py-5 rounded-full border-4 border-outline shadow-lg active:scale-95 transition-all text-center select-none"
                        title="YouTubeで曲を聴く"
                      >
                        <span className="text-2xl animate-pulse">▶</span>
                        この曲を聴く
                      </a>
                    </div>
                  </motion.div>
                )}

                <div className={`mt-2 text-xs font-bold ${isTama ? "text-outline" : "text-primary-fixed"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Loading Spinner for Tama's Reply */}
        {loadingReply && (
          <div className="flex items-start gap-4 max-w-[90%] mr-auto">
            <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-outline bg-primary-fixed animate-pulse">
              <img 
                alt="たま" 
                className="w-full h-full object-cover scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJzV9W11iBWAN2vK41UvcNTwO1N8vHvdNBneVAmMSRMJjbAVGyTW5kiktYCyMy3swbY9NsA3fNkzpayZKoCmgbNUR93y5HJMFJ7MGqxtSJkHbp-C3bCKDviWfbdMiSVMcFEGXDX2cquxq58NuZQjuL-TxRZSws_Ozym9PYrOxz5gtsVpliUhyJnh3qkB_VPe2GkUK0ZMW6waCXdCQysl3JNuXJixNo6u8wZbRLubpOZBGVAso4DGh9cs2jhRuMKbOKNj3rQW9CTdEc"
              />
            </div>
            <div className="bg-surface-container-high hand-drawn-card p-5 text-on-surface rounded-2xl flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="font-bold">たまが言葉を返しているにゃ...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Atmospheric Help Prompt */}
      <div className="text-center italic text-on-surface-variant py-2 text-sm font-bold opacity-80 border-t border-outline-variant">
        たまがちょっと勘違いしているみたい。どうしてあげようか？
      </div>

      {/* Bottom Panel Actions */}
      <div className="bg-surface-container-low p-4 rounded-3xl border-2 border-outline-variant space-y-4">
        {/* Quick Suggestion Chips for Fast Tap Responses */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => handleQuickSuggestion("靴下は冷蔵庫じゃなくて、タンスだよ！")}
            className="flex-shrink-0 bg-white border-2 border-outline text-on-surface font-bold px-4 py-2 rounded-full text-base active:scale-95 transition-all shadow-sm"
          >
            🧦 タンスだよ！
          </button>
          <button 
            onClick={() => handleQuickSuggestion("おもしろいボケだね！")}
            className="flex-shrink-0 bg-white border-2 border-outline text-on-surface font-bold px-4 py-2 rounded-full text-base active:scale-95 transition-all shadow-sm"
          >
            😄 おもしろいね！
          </button>
          <button 
            onClick={() => handleQuickSuggestion("たま、よしよし、なでなで。")}
            className="flex-shrink-0 bg-white border-2 border-outline text-on-surface font-bold px-4 py-2 rounded-full text-base active:scale-95 transition-all shadow-sm"
          >
            🐈 なでなで
          </button>
          <button 
            onClick={() => handleQuickSuggestion("朝ごはん、いっしょに食べよう！")}
            className="flex-shrink-0 bg-white border-2 border-outline text-on-surface font-bold px-4 py-2 rounded-full text-base active:scale-95 transition-all shadow-sm"
          >
            🍚 朝ごはん食べる？
          </button>
        </div>

        {/* Main Cognitive Multi-Choice Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {/* Option 1: Correct Tama (Cognitive exercise button - Terracotta) */}
          <button
            onClick={() => onSendAction('correct')}
            className="btn-press bg-primary text-on-primary rounded-2xl min-h-[72px] flex items-center justify-center gap-3 px-4 shadow-md border-b-6 border-on-primary-fixed-variant cursor-pointer select-none"
          >
            <CheckCircle2 className="w-8 h-8 stroke-[3]" />
            <span className="text-xl font-black">ツッコミを入れる</span>
          </button>

          {/* Option 2: Laugh with Tama (Emotional connection button - Sage Green) */}
          <button
            onClick={() => onSendAction('laugh')}
            className="btn-press bg-secondary text-on-secondary rounded-2xl min-h-[72px] flex items-center justify-center gap-3 px-4 shadow-md border-b-6 border-on-secondary-fixed-variant cursor-pointer select-none"
          >
            <Smile className="w-8 h-8 stroke-[3]" />
            <span className="text-xl font-black">いっしょに笑う</span>
          </button>
        </div>

        {/* Custom Text/Keyboard Input Form */}
        <form onSubmit={handleSendCustomText} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="たまにキーボードで自由にメッセージを書く..."
            className="flex-1 bg-white border-2 border-outline rounded-xl px-4 py-3 text-lg font-bold placeholder-outline-variant focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-primary text-on-primary px-6 rounded-xl font-black flex items-center justify-center hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
