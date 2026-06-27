export interface WeatherInfo {
  condition: string;
  temperature: number;
  description: string;
  sourceUrl?: string;
}

export interface RecommendedSong {
  title: string;
  artist: string;
  youtubeUrl: string;
  commentary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'tama' | 'user';
  text: string;
  timestamp: string;
  song?: RecommendedSong;
}

export interface HistoryItem {
  id: string;
  type: 'chat' | 'checkin' | 'lunch';
  title: string;
  detail: string;
  timestamp: string;
  dateLabel: string;
}

export interface UserSettings {
  userName: string;
  voiceVolume: number;
  textSize: 'normal' | 'large' | 'huge';
  notificationsEnabled: boolean;
  weight?: number; // 体重(kg) for METs walking calorie calculation
}
