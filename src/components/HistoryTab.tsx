import React, { useState } from "react";
import { 
  Users, 
  CheckCircle, 
  Activity, 
  Utensils, 
  Heart,
  Eye,
  Hand,
  ArrowRight
} from "lucide-react";
import { HistoryItem, UserSettings } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HistoryTabProps {
  historyItems: HistoryItem[];
  settings: UserSettings;
  onSendWave: () => void;
  waveSent: boolean;
}

export default function HistoryTab({
  historyItems,
  settings,
  onSendWave,
  waveSent
}: HistoryTabProps) {
  
  // Quick mapping of items to icons
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <div className="w-14 h-14 bg-primary-fixed text-on-primary-fixed flex items-center justify-center rounded-2xl flex-shrink-0"><Activity className="w-8 h-8 text-primary" /></div>;
      case 'lunch':
        return <div className="w-14 h-14 bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center rounded-2xl flex-shrink-0"><Utensils className="w-8 h-8 text-secondary" /></div>;
      case 'checkin':
      default:
        return <div className="w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center rounded-2xl flex-shrink-0"><Heart className="w-8 h-8 text-rose-500 fill-rose-500" /></div>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Message Section (Family is Watching) */}
      <section className="hand-drawn-border bg-surface-container-low p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Users className="w-10 h-10 text-primary" />
          <h2 className="text-2xl font-black text-on-surface">家族が見守っています</h2>
        </div>
        <p className="text-lg text-on-surface-variant font-bold leading-relaxed">
          ご家族が今日のたまとの会話を確認しました！あなたが元気そうで安心していますよ。
        </p>
        <div className="flex items-center gap-2 text-secondary font-black text-base">
          <CheckCircle className="w-6 h-6 text-secondary" />
          <span>家族4人とつながっています</span>
        </div>
      </section>

      {/* Family Members Horizontal Scroll */}
      <section>
        <h3 className="text-sm font-black text-outline mb-3 uppercase tracking-wider">最近見てくれた家族</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {/* Family Card 1: Sarah */}
          <div className="flex-shrink-0 w-36 bg-surface-container-highest rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-outline-variant shadow-sm active:translate-y-0.5 transition-transform">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-primary-fixed">
                <img 
                  alt="Sarah" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIg5MlAnrE3IcjtMJoqqMqWwdweFLot0S0qYEvnQwkl6O6dJHDq5xsujCsI8BG31kfag2gGs1llVfU98fhN8mL4e2UbztPXskuQeSCmoamsurPts9Jcz3ry35huehGSZRw6UylTm36ghYFGzvCum4shyYWisJRStOPtiYyUeY7UGV8CZC0N2LhkDh9yq2h3tXer5F4NbtK14DveAJY1L2JIVYpG4tnuyOwml2I_tSoBwvcdXtkQg3btGArvnnQDYNdEls34EGzDzyO"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full p-1 border-2 border-surface animate-pulse">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <span className="font-black text-on-surface text-base">Sarah</span>
            <span className="text-xs text-outline font-bold">10分前</span>
          </div>

          {/* Family Card 2: David */}
          <div className="flex-shrink-0 w-36 bg-surface-container-highest rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-outline-variant shadow-sm active:translate-y-0.5 transition-transform">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-primary-fixed">
                <img 
                  alt="David" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJPV8CPzrCkcqMGi12x6Hp8QIL6KR9_b4en6jzyrfrnCZPa7xgZ1EAgdfsVST-6uYnAqlVZUJCvBwJwKy-b87zOeRHI2rUYxh0Vm8u5CMVPU9E8j0kbScjm2r5dtlbpMPlhbd82C7qlCIADYZp6F_8N2H7T2GkyY9ArwF2Bpy_wZCD9cQr_h87U1zvvZKQmFQLrr7j6e6tetC8t_tcmjxqiMATKOubUv56Q6nzRlKSmUb8DzvyiAFw0MvbT-_qr5_8f5WRfA2O9NMk"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full p-1 border-2 border-surface">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <span className="font-black text-on-surface text-base">David</span>
            <span className="text-xs text-outline font-bold">2時間前</span>
          </div>

          {/* Family Card 3: Leo */}
          <div className="flex-shrink-0 w-36 bg-surface-container-highest rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-outline-variant shadow-sm active:translate-y-0.5 transition-transform">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-primary-fixed">
                <img 
                  alt="Leo" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF6rDyXj-PeaYYVGWpqGhAKdu63V2vWELyPT4M88T1LRQ_hcW6_Tu4I3_Hao-nSpjZLRcAtLwIldUVh5VnqB5UrCiCrG4WT4LxiMKTiqf18d_QkXOn59f6ONwJ3sWvRdbvWYODZROjvexdcjz2TB1zUeo-0A2kORaXuzUrXfT6nKdOnNZ4uYT5j3ZYs2WQctv9hhTSfZhk3jAYCYhaOv-4w9w1N_LH1JCMiaQIJVwhGPAJbuKH_rm4LQTmZ2mdz6lJ6YLPP0rpixVi"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full p-1 border-2 border-surface">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <span className="font-black text-on-surface text-base">Leo</span>
            <span className="text-xs text-outline font-bold">今日</span>
          </div>
        </div>
      </section>

      {/* Activity History List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-on-surface">これまでの記録</h3>
          <span className="text-sm font-bold text-outline">活動履歴</span>
        </div>

        <div className="space-y-4">
          {historyItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 p-5 bg-surface-container-low rounded-2xl border-2 border-outline-variant shadow-sm"
            >
              {getItemIcon(item.type)}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-black text-on-surface text-lg">{item.title}</p>
                  <span className="text-outline font-bold text-xs">{item.timestamp}</span>
                </div>
                <p className="text-on-surface-variant font-bold text-base mt-1 italic">
                  「{item.detail}」
                </p>
                <div className="mt-2 text-xs text-outline font-bold">
                  日付: {item.dateLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Warm Reassuring Action (Send a wave) */}
      <section className="py-4 flex flex-col items-center text-center">
        <div className="bg-primary-container text-on-primary-container p-8 rounded-3xl w-full flex flex-col gap-4 border-4 border-outline">
          <Heart className="w-14 h-14 mx-auto text-white fill-white animate-pulse" />
          <h4 className="text-2xl font-black">家族に合図（あいず）を送る？</h4>
          <p className="text-lg font-bold">あなたも家族のことを想っていると、簡単に知らせることができますよ。</p>
          
          <button 
            onClick={onSendWave}
            disabled={waveSent}
            className={`font-black py-4 px-8 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-3 mt-2 min-h-[64px] border-2 border-outline cursor-pointer select-none ${waveSent ? 'bg-secondary text-on-secondary border-secondary' : 'bg-white text-primary hover:bg-surface'}`}
          >
            <Hand className={`w-8 h-8 ${waveSent ? '' : 'animate-bounce'}`} />
            <span className="text-xl">
              {waveSent ? '合図を送りました！' : '合図（ウェーブ）を送る'}
            </span>
          </button>
          
          <AnimatePresence>
            {waveSent && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-bold text-secondary-container mt-2"
              >
                🐾 家族に「元気にしてるにゃ！」と通知を届けました
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
