import React, { useState, useEffect } from "react";
import { 
  Home, 
  MessageSquare, 
  History, 
  Settings, 
  Smile,
  Lightbulb,
  Heart,
  Volume2,
  X,
  VolumeX,
  Cat,
  Sparkles
} from "lucide-react";
import { WeatherInfo, ChatMessage, HistoryItem, UserSettings } from "./types";
import HomeTab from "./components/HomeTab";
import ChatTab from "./components/ChatTab";
import HistoryTab from "./components/HistoryTab";
import SettingsTab from "./components/SettingsTab";
import WalkTab from "./components/WalkTab";
import { motion, AnimatePresence } from "motion/react";

// Initial historical data matching the mockup
const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: "h1",
    type: "chat",
    title: "たまとおしゃべり",
    detail: "朝のお散歩についてお話ししました。",
    timestamp: "10:45 AM",
    dateLabel: "今日"
  },
  {
    id: "h2",
    type: "lunch",
    title: "お昼ごはんの記録",
    detail: "記録：健康的な鮭のサラダ",
    timestamp: "昨日",
    dateLabel: "昨日"
  },
  {
    id: "h3",
    type: "checkin",
    title: "毎日の確認",
    detail: "様子：とても元気！",
    timestamp: "昨日",
    dateLabel: "昨日"
  }
];

// Initial settings configuration
const DEFAULT_SETTINGS: UserSettings = {
  userName: "おじいちゃん",
  voiceVolume: 80,
  textSize: "large", // Default to large for elder safety
  notificationsEnabled: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'history' | 'settings' | 'walk'>('home');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  
  // App dialogues state
  const [boke, setBoke] = useState("あらあら！今朝は寝ぼけちゃって、靴下を冷蔵庫にいれちゃったみたいにゃ！");
  const [loadingBoke, setLoadingBoke] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingReply, setLoadingReply] = useState(false);
  
  // History and settings state
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [waveSent, setWaveSent] = useState(false);
  const [meowTrigger, setMeowTrigger] = useState(0);

  // Dynamic overlays & notifications for sensory feedback
  const [feedbackOverlay, setFeedbackOverlay] = useState<{ show: boolean; icon: 'heart' | 'smile' | 'bulb' | 'wave' | 'bell'; color: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Initialize settings, messages and history from localStorage
  useEffect(() => {
    const cachedSettings = localStorage.getItem("tama_settings");
    if (cachedSettings) {
      try {
        setSettings(JSON.parse(cachedSettings));
      } catch (e) {
        console.error(e);
      }
    }

    const cachedHistory = localStorage.getItem("tama_history");
    if (cachedHistory) {
      try {
        setHistoryItems(JSON.parse(cachedHistory));
      } catch (e) {
        console.error(e);
      }
    }

    const cachedMessages = localStorage.getItem("tama_messages");
    if (cachedMessages) {
      try {
        setMessages(JSON.parse(cachedMessages));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Setup initial message
      setMessages([
        {
          id: "m1",
          sender: "tama",
          text: boke,
          timestamp: "午前10時15分"
        }
      ]);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem("tama_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("tama_history", JSON.stringify(historyItems));
  }, [historyItems]);

  useEffect(() => {
    localStorage.setItem("tama_messages", JSON.stringify(messages));
  }, [messages]);

  // 2. Load weather with Google Search Grounding from backend on startup
  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const response = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city: "東京" })
        });
        const data = await response.json();
        setWeather(data);
        
        // Trigger boke generation incorporating actual weather details
        fetchTamaBoke(data.condition, data.temperature);
      } catch (e) {
        console.error("Failed to fetch weather:", e);
        setWeather({
          condition: "晴れ",
          temperature: 22,
          description: "今日はおだやかな天気ですね。のんびりお茶でも飲んで過ごしてくださいにゃ。"
        });
        fetchTamaBoke("晴れ", 22);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  // 3. Text to Speech meows & speech
  const speakText = (text: string) => {
    if (settings.voiceVolume === 0) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      // High pitched sweet cute tone for Tama
      utterance.pitch = 1.45;
      utterance.rate = 1.05;
      utterance.volume = settings.voiceVolume / 100;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 4. Fetch Tama's cute boke matching weather conditions
  const fetchTamaBoke = async (condition: string, temp: number) => {
    setLoadingBoke(true);
    try {
      const response = await fetch("/api/tama/boke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition, temperature: temp })
      });
      const data = await response.json();
      if (data.boke) {
        setBoke(data.boke);
        // Prepend or add initial message in dialogue tab matching the new boke
        const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        setMessages([
          {
            id: `msg-${Date.now()}`,
            sender: "tama",
            text: data.boke,
            timestamp: currentTime
          }
        ]);
        // Let Tama speak!
        setTimeout(() => speakText(data.boke), 1000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBoke(false);
    }
  };

  // 5. Handle user actions: tsukkomi, laugh, or custom messages
  const handleTamaAction = async (action: 'correct' | 'laugh', customText?: string) => {
    const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    let userText = "";
    
    if (customText) {
      userText = customText;
    } else if (action === 'correct') {
      userText = "ちょっと、たまちゃん！靴下は冷蔵庫じゃなくて引き出しだよ！";
    } else {
      userText = "あはは！たまちゃんは本当に面白いね！";
    }

    // Add user message to history
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: currentTime
    };

    setMessages(prev => [...prev, userMessage]);

    // Show visual overlay feedback
    if (action === 'correct') {
      triggerFeedbackOverlay('bulb', 'text-amber-500 bg-amber-50');
    } else {
      triggerFeedbackOverlay('smile', 'text-secondary bg-secondary-fixed');
    }

    setLoadingReply(true);

    try {
      const response = await fetch("/api/tama/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boke,
          action,
          userMessage: customText || undefined,
          weatherCondition: weather?.condition || "晴れ"
        })
      });
      const data = await response.json();
      
      if (data.reply) {
        // Add Tama message response
        const tamaMessage: ChatMessage = {
          id: `t-${Date.now()}`,
          sender: 'tama',
          text: data.reply,
          timestamp: currentTime,
          song: data.song
        };
        setMessages(prev => [...prev, tamaMessage]);
        speakText(data.reply);

        // Update history logger with dialogue record
        const newHistoryItem: HistoryItem = {
          id: `hist-${Date.now()}`,
          type: 'chat',
          title: 'たまとおしゃべり',
          detail: `たまの「${boke.substring(0, 10)}...」にツッコみました。`,
          timestamp: currentTime,
          dateLabel: '今日'
        };
        setHistoryItems(prev => [newHistoryItem, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReply(false);
    }
  };

  // Register quick Check In ("元気だよ！")
  const handleQuickCheckIn = () => {
    const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    
    // Create new history log
    const checkinItem: HistoryItem = {
      id: `check-${Date.now()}`,
      type: 'checkin',
      title: '毎日の元気確認',
      detail: '「元気だよ！」と合図をしました。',
      timestamp: currentTime,
      dateLabel: '今日'
    };
    setHistoryItems(prev => [checkinItem, ...prev]);

    // Trigger overlay animation
    triggerFeedbackOverlay('heart', 'text-rose-500 bg-rose-50');
    showNotification("「元気だよ！」を記録して、家族に送りました🐾");

    // Ask Tama to speak happy words
    const replyText = "おじいちゃんが元気で、たまはすっごく嬉しいにゃ！今日もいっしょに過ごせて幸せにゃん！🐾";
    speakText(replyText);

    // Append to messages list
    setMessages(prev => [
      ...prev,
      {
        id: `u-check-${Date.now()}`,
        sender: 'user',
        text: "たま、私は今日もすっごく元気だよ！",
        timestamp: currentTime
      },
      {
        id: `t-check-${Date.now()}`,
        sender: 'tama',
        text: replyText,
        timestamp: currentTime
      }
    ]);
  };

  // Handle saving walk logs to history
  const handleSaveWalk = (minutes: number, calories: number, steps: number) => {
    const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    
    // Save to history list
    const walkItem: HistoryItem = {
      id: `walk-hist-${Date.now()}`,
      type: 'checkin', // So that it matches the checkin/health records visual category
      title: 'お散歩の記録 🐾',
      detail: `お散歩 ${minutes}分 / ${calories}kcal (${steps}歩)`,
      timestamp: currentTime,
      dateLabel: '今日'
    };
    setHistoryItems(prev => [walkItem, ...prev]);

    // Show visual sweet celebration overlay
    triggerFeedbackOverlay('wave', 'text-amber-500 bg-amber-50');
    showNotification(`お散歩の記録（${minutes}分）を保存しました🐾`);
  };

  // Handle wave back to family
  const handleSendWave = () => {
    setWaveSent(true);
    triggerFeedbackOverlay('wave', 'text-primary bg-primary-fixed');
    showNotification("家族全員に『元気にしてるにゃ🐾』と合図を送りました！");
    speakText("家族のみんなに、元気な合図を届けたにゃん！");
    
    setTimeout(() => {
      setWaveSent(false);
    }, 5000);
  };

  // Speech synthesise standard "meow"
  const handleCatMeow = () => {
    speakText("にゃ〜ん🐾 たまだにゃ！今日もいっぱいツッコミを入れてにゃ！");
    setMeowTrigger(prev => prev + 1);
  };

  // Helpers for feedbacks
  const triggerFeedbackOverlay = (icon: 'heart' | 'smile' | 'bulb' | 'wave' | 'bell', color: string) => {
    setFeedbackOverlay({ show: true, icon, color });
    setTimeout(() => {
      setFeedbackOverlay(null);
    }, 1200);
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const reloadNewBoke = () => {
    if (weather) {
      fetchTamaBoke(weather.condition, weather.temperature);
      showNotification("新しいおボケを用意したにゃん🐾");
    } else {
      fetchTamaBoke("晴れ", 22);
    }
  };

  // Define global styling text class scaling by settings
  const getGlobalTextSizeClass = () => {
    if (settings.textSize === "large") return "text-xl";
    if (settings.textSize === "huge") return "text-2xl";
    return "text-base";
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className={`min-h-screen bg-background font-sans pb-32 flex flex-col max-w-lg mx-auto border-x border-outline-variant shadow-inner ${getGlobalTextSizeClass()}`}>
      
      {/* Top Header App Bar */}
      <header className="bg-background w-full sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b-2 border-outline-variant">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center border-2 border-primary shadow-sm hover:rotate-6 transition-transform cursor-pointer" onClick={handleCatMeow}>
            <img 
              alt="たま" 
              className="w-full h-full object-cover scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJzV9W11iBWAN2vK41UvcNTwO1N8vHvdNBneVAmMSRMJjbAVGyTW5kiktYCyMy3swbY9NsA3fNkzpayZKoCmgbNUR93y5HJMFJ7MGqxtSJkHbp-C3bCKDviWfbdMiSVMcFEGXDX2cquxq58NuZQjuL-TxRZSws_Ozym9PYrOxz5gtsVpliUhyJnh3qkB_VPe2GkUK0ZMW6waCXdCQysl3JNuXJixNo6u8wZbRLubpOZBGVAso4DGh9cs2jhRuMKbOKNj3rQW9CTdEc"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">たまといっしょ</h1>
            <p className="text-xs text-outline font-bold">会話見守り脳トレ</p>
          </div>
        </div>

        {/* Volume status shortcuts */}
        <button 
          onClick={() => {
            const nextVol = settings.voiceVolume === 0 ? 80 : 0;
            handleUpdateSettings({ voiceVolume: nextVol });
            showNotification(nextVol === 0 ? "たまの声を消音（マナーモード）にしたにゃ" : "たまの声をオンにしたにゃ🔊");
          }}
          className="p-3 bg-surface-container hover:bg-surface-container-high rounded-full border-2 border-outline text-primary transition-all active:scale-95 shadow-sm"
        >
          {settings.voiceVolume === 0 ? <VolumeX className="w-6 h-6 stroke-[3]" /> : <Volume2 className="w-6 h-6 stroke-[3]" />}
        </button>
      </header>

      {/* Main Tab Screen Switcher */}
      <main className="flex-grow px-6 pt-4 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'home' && (
              <HomeTab 
                weather={weather}
                loadingWeather={loadingWeather}
                boke={boke}
                loadingBoke={loadingBoke}
                settings={settings}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  speakText(tab === 'chat' ? "おしゃべり画面だにゃ！ツッコミか笑顔のボタンを押してみてにゃ🐾" : "");
                }}
                onQuickCheckIn={handleQuickCheckIn}
                onMeow={handleCatMeow}
                meowTrigger={meowTrigger}
              />
            )}

            {activeTab === 'chat' && (
              <ChatTab 
                messages={messages}
                weather={weather}
                loadingReply={loadingReply}
                boke={boke}
                settings={settings}
                onSendAction={handleTamaAction}
                onReloadBoke={reloadNewBoke}
              />
            )}

            {activeTab === 'history' && (
              <HistoryTab 
                historyItems={historyItems}
                settings={settings}
                onSendWave={handleSendWave}
                waveSent={waveSent}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab 
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onShowNotification={showNotification}
              />
            )}

            {activeTab === 'walk' && (
              <WalkTab 
                settings={settings}
                onSaveWalk={handleSaveWalk}
                onBack={() => setActiveTab('home')}
                speakText={speakText}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Large Nav Bar Navigation */}
      {activeTab !== 'walk' && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-24 flex justify-around items-center px-4 pb-4 bg-surface-container border-t-4 border-outline shadow-2xl z-30 rounded-t-3xl">
        {/* Home */}
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[90px] transition-all duration-150 cursor-pointer select-none active:scale-95 ${activeTab === 'home' ? 'bg-primary text-on-primary border-2 border-outline shadow-md -translate-y-2' : 'text-on-surface-variant hover:bg-primary-fixed-dim'}`}
        >
          <Home className="w-8 h-8 stroke-[2.5]" />
          <span className="text-sm font-black mt-1">ホーム</span>
        </button>

        {/* Chat */}
        <button 
          onClick={() => {
            setActiveTab('chat');
            speakText("おしゃべり画面だにゃ！");
          }}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[90px] transition-all duration-150 cursor-pointer select-none active:scale-95 ${activeTab === 'chat' ? 'bg-primary text-on-primary border-2 border-outline shadow-md -translate-y-2' : 'text-on-surface-variant hover:bg-primary-fixed-dim'}`}
        >
          <MessageSquare className="w-8 h-8 stroke-[2.5]" />
          <span className="text-sm font-black mt-1">おしゃべり</span>
        </button>

        {/* History */}
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[90px] transition-all duration-150 cursor-pointer select-none active:scale-95 ${activeTab === 'history' ? 'bg-primary text-on-primary border-2 border-outline shadow-md -translate-y-2' : 'text-on-surface-variant hover:bg-primary-fixed-dim'}`}
        >
          <History className="w-8 h-8 stroke-[2.5]" />
          <span className="text-sm font-black mt-1">これまでの記録</span>
        </button>

        {/* Settings */}
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[90px] transition-all duration-150 cursor-pointer select-none active:scale-95 ${activeTab === 'settings' ? 'bg-primary text-on-primary border-2 border-outline shadow-md -translate-y-2' : 'text-on-surface-variant hover:bg-primary-fixed-dim'}`}
        >
          <Settings className="w-8 h-8 stroke-[2.5]" />
          <span className="text-sm font-black mt-1">設定</span>
        </button>
      </nav>
      )}

      {/* Dynamic Interaction Overlay Feedbacks */}
      <AnimatePresence>
        {feedbackOverlay && feedbackOverlay.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-black/20"
          >
            <motion.div 
              initial={{ scale: 0.3, rotate: -20 }}
              animate={{ scale: 1.2, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`p-10 rounded-full shadow-2xl ${feedbackOverlay.color} flex items-center justify-center border-4 border-outline`}
            >
              {feedbackOverlay.icon === 'heart' && <Heart className="w-28 h-28 stroke-[2.5] fill-current" />}
              {feedbackOverlay.icon === 'smile' && <Smile className="w-28 h-28 stroke-[2.5] fill-current" />}
              {feedbackOverlay.icon === 'bulb' && <Lightbulb className="w-28 h-28 stroke-[2.5] fill-current" />}
              {feedbackOverlay.icon === 'wave' && <Sparkles className="w-28 h-28 stroke-[2.5] animate-spin" />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beautiful Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-on-background/95 text-background px-6 py-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 font-bold text-center text-lg border-2 border-outline"
          >
            <Cat className="w-6 h-6 text-primary animate-bounce flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
