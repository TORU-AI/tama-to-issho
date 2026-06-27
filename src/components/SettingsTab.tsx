import React, { useState } from "react";
import { 
  Volume2, 
  Type, 
  Bell, 
  Phone, 
  HelpCircle,
  Check,
  User,
  AlertTriangle
} from "lucide-react";
import { UserSettings } from "../types";
import { motion } from "motion/react";

interface SettingsTabProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onShowNotification: (msg: string) => void;
}

export default function SettingsTab({
  settings,
  onUpdateSettings,
  onShowNotification
}: SettingsTabProps) {
  const [tempName, setTempName] = useState(settings.userName);

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateSettings({ userName: tempName.trim() });
      onShowNotification(`お名前を「${tempName.trim()}」に変更したにゃ🐾`);
    }
  };

  const handleTextSizeChange = (val: 'normal' | 'large' | 'huge') => {
    onUpdateSettings({ textSize: val });
    onShowNotification(`文字の大きさを変更しましたにゃ！`);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    onUpdateSettings({ voiceVolume: vol });
  };

  const handleNotifToggle = () => {
    const nextVal = !settings.notificationsEnabled;
    onUpdateSettings({ notificationsEnabled: nextVal });
    onShowNotification(nextVal ? "お知らせをオンにしたにゃ！" : "お知らせをオフにしたにゃ！");
  };

  const handleSpeechToggle = () => {
    const nextVal = settings.voiceSpeechEnabled === false ? false : true;
    const toggled = !nextVal;
    onUpdateSettings({ voiceSpeechEnabled: toggled });
    onShowNotification(toggled ? "たまの自動おしゃべりをオンにしたにゃ🐾🔊" : "たまの自動おしゃべりをオフにしたにゃ🔇");
  };

  const handleCallFamily = () => {
    onShowNotification("家族のスマートフォンへ発信中だにゃ📞（モック動作）");
  };

  const handleCallSupport = () => {
    onShowNotification("たまのサポートセンターへ発信中だにゃ📞（モック動作）");
  };

  return (
    <div className="space-y-8 pb-10">
      <section className="mb-6">
        <h2 className="text-3xl font-black mb-2 text-on-surface-variant">設定</h2>
        <p className="text-lg text-outline font-bold">たまの声や文字の大きさを、使いやすく調整しましょう。</p>
      </section>

      {/* Settings Cards Cluster */}
      <div className="flex flex-col gap-6">
        
        {/* User Name Customization */}
        <div className="bg-surface-container-lowest hand-drawn-border p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <User className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-black">たまからの呼ばれ方</h3>
          </div>
          <form onSubmit={handleNameSave} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setTempName("おじいちゃん");
                  onUpdateSettings({ userName: "おじいちゃん" });
                  onShowNotification("「おじいちゃん」に呼ばれ方を変更したにゃ！");
                }}
                className={`flex-1 py-2 rounded-xl font-bold border-2 transition-all ${settings.userName === "おじいちゃん" ? "bg-primary text-on-primary border-outline" : "bg-white text-on-surface border-outline-variant"}`}
              >
                おじいちゃん
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempName("おばあちゃん");
                  onUpdateSettings({ userName: "おばあちゃん" });
                  onShowNotification("「おばあちゃん」に呼ばれ方を変更したにゃ！");
                }}
                className={`flex-1 py-2 rounded-xl font-bold border-2 transition-all ${settings.userName === "おばあちゃん" ? "bg-primary text-on-primary border-outline" : "bg-white text-on-surface border-outline-variant"}`}
              >
                おばあちゃん
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="自分で名前を入力する..."
                className="flex-1 bg-white border-2 border-outline rounded-xl px-4 py-3 text-lg font-bold"
              />
              <button
                type="submit"
                className="bg-secondary text-on-secondary px-6 rounded-xl font-black border-2 border-outline hover:bg-secondary-container"
              >
                保存
              </button>
            </div>
          </form>
        </div>

        {/* Voice Volume */}
        <div className="bg-surface-container-lowest hand-drawn-border p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Volume2 className="w-8 h-8 text-primary" />
            <label className="text-2xl font-black" htmlFor="voice-volume">
              たまの声の大きさ
            </label>
          </div>
          <div className="relative w-full h-16 flex items-center">
            <input
              id="voice-volume"
              type="range"
              min="0"
              max="100"
              value={settings.voiceVolume}
              onChange={handleVolumeChange}
              className="w-full h-4 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary border-2 border-outline"
            />
          </div>
          <div className="flex justify-between mt-1 font-black text-outline text-base">
            <span>小さめ ({settings.voiceVolume}%)</span>
            <span>大きめ</span>
          </div>
        </div>

        {/* Voice Speech (Read Aloud Toggle) */}
        <div className="bg-surface-container-lowest hand-drawn-border p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Volume2 className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-black">たまの自動おしゃべり</h3>
              <p className="text-sm font-bold text-outline">会話や健康アドバイスを自動で読み上げます</p>
            </div>
          </div>
          <button
            onClick={handleSpeechToggle}
            className={`w-16 h-10 rounded-full border-2 border-outline p-1 transition-colors duration-200 cursor-pointer ${settings.voiceSpeechEnabled !== false ? 'bg-primary' : 'bg-surface-container-high'}`}
          >
            <div
              className={`w-7 h-7 rounded-full bg-white shadow-md border border-outline-variant transition-transform duration-200 ${settings.voiceSpeechEnabled !== false ? 'transform translate-x-6' : ''}`}
            />
          </button>
        </div>

        {/* Text Size */}
        <div className="bg-surface-container-lowest hand-drawn-border p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Type className="w-8 h-8 text-primary" />
            <span className="text-2xl font-black">文字の大きさ</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleTextSizeChange('normal')}
              className={`py-3 rounded-xl font-black text-base border-2 transition-all flex flex-col items-center gap-1 ${settings.textSize === 'normal' ? 'bg-primary text-on-primary border-outline' : 'bg-white text-on-surface border-outline-variant'}`}
            >
              <span>あ</span>
              <span className="text-xs">標準サイズ</span>
            </button>
            <button
              onClick={() => handleTextSizeChange('large')}
              className={`py-3 rounded-xl font-black text-xl border-2 transition-all flex flex-col items-center gap-1 ${settings.textSize === 'large' ? 'bg-primary text-on-primary border-outline' : 'bg-white text-on-surface border-outline-variant'}`}
            >
              <span>あ</span>
              <span className="text-xs">大きく</span>
            </button>
            <button
              onClick={() => handleTextSizeChange('huge')}
              className={`py-3 rounded-xl font-black text-3xl border-2 transition-all flex flex-col items-center gap-1 ${settings.textSize === 'huge' ? 'bg-primary text-on-primary border-outline' : 'bg-white text-on-surface border-outline-variant'}`}
            >
              <span>あ</span>
              <span className="text-xs">特大サイズ</span>
            </button>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="bg-surface-container-lowest hand-drawn-border p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bell className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-black">たまからのお知らせ</h3>
              <p className="text-sm font-bold text-outline">たまが予定やおしゃべりを教えてくれます</p>
            </div>
          </div>
          <button
            onClick={handleNotifToggle}
            className={`w-16 h-10 rounded-full border-2 border-outline p-1 transition-colors duration-200 cursor-pointer ${settings.notificationsEnabled ? 'bg-primary' : 'bg-surface-container-high'}`}
          >
            <div
              className={`w-7 h-7 rounded-full bg-white shadow-md border border-outline-variant transition-transform duration-200 ${settings.notificationsEnabled ? 'transform translate-x-6' : ''}`}
            />
          </button>
        </div>

        {/* Weight Setting for walking calories */}
        <div className="bg-surface-container-lowest hand-drawn-border p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">⚖️</span>
            <div>
              <h3 className="text-xl font-black">お散歩用の体重設定</h3>
              <p className="text-sm font-bold text-outline">お散歩での消費カロリーを正確に計算するために使います</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 bg-surface-container p-4 rounded-2xl border-2 border-outline-variant">
            <button
              type="button"
              onClick={() => {
                const currentWeight = settings.weight ?? 60;
                const nextWeight = Math.max(30, currentWeight - 1);
                onUpdateSettings({ weight: nextWeight });
              }}
              className="w-16 h-16 rounded-full bg-white border-3 border-outline flex items-center justify-center text-3xl font-black shadow-md hover:bg-surface-container-high active:scale-90 select-none cursor-pointer"
            >
              －
            </button>
            <div className="text-center min-w-[120px]">
              <span className="text-4xl font-black text-primary">{settings.weight ?? 60}</span>
              <span className="text-lg font-bold text-on-surface ml-1">kg</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const currentWeight = settings.weight ?? 60;
                const nextWeight = Math.min(150, currentWeight + 1);
                onUpdateSettings({ weight: nextWeight });
              }}
              className="w-16 h-16 rounded-full bg-white border-3 border-outline flex items-center justify-center text-3xl font-black shadow-md hover:bg-surface-container-high active:scale-90 select-none cursor-pointer"
            >
              ＋
            </button>
          </div>
        </div>

        {/* Help & Family Emergency Contact Buttons */}
        <div className="mt-6 flex flex-col gap-4">
          <button 
            onClick={handleCallFamily}
            className="bg-primary text-on-primary h-16 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all shadow-md border-b-6 border-on-primary-fixed-variant cursor-pointer"
          >
            <Phone className="w-6 h-6 fill-white" />
            <span className="text-xl font-black">家族に電話する</span>
          </button>

          <button 
            onClick={handleCallSupport}
            className="bg-white border-4 border-primary text-primary h-16 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer"
          >
            <HelpCircle className="w-6 h-6" />
            <span className="text-xl font-black">使い方の相談（サポート）</span>
          </button>
        </div>

      </div>
    </div>
  );
}
