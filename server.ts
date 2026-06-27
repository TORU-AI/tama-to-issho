import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini client with proper User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// Comprehensive Japanese weather-specific fallback database for Tama's bokes
const WEATHER_BOKE_FALLBACKS: Record<string, string[]> = {
  rain: [
    "雨が降ってきたから、お傘をお鍋でコトコト煮て、美味しいスープを作ろうとしたにゃ！お出汁が出るかにゃ？",
    "雨の音がきれいで、長靴を両耳にはめてお気に入りの音楽を聴こうとしちゃったにゃ！耳がすっぽり隠れたにゃん！",
    "お外が土砂降りだから、お部屋に傘をたくさん並べて、たま専用の秘密基地を作ろうとしたら怒られたにゃん！"
  ],
  sunny: [
    "今日はお日様がぽかぽかだから、靴下を冷蔵庫にいれて冷え冷えの特製アイスにしようとしたにゃ！食べられないにゃ...",
    "お天気がいいから、お魚を日傘の代わりに頭にのせてお散歩に行こうとしたにゃ！お空のトンビに狙われちゃったにゃ！",
    "日差しがまぶしいから、サングラスをお尻にかけて、後ろ向きにお散歩しようとしちゃったにゃ！前が見えなくて壁にぶつかったにゃ。"
  ],
  cloudy: [
    "曇り空がふわふわの綿あめに見えて、お箸を両手に持って空に向かって大ジャンプしようとしちゃったにゃ！",
    "お空が真っ白だから、たまの白いお腹と間違えて、おじいちゃんのセーターをブラシでゴシゴシしちゃったにゃん！",
    "太陽さんがかくれんぼしてるから、たまもお布団の中に隠れて、一日中冬眠する準備を始めちゃったにゃ🐾"
  ],
  snow: [
    "お外が真っ白で綺麗だから、お塩をいっぱいまき散らして、お家の中もしょっぱい雪景色にしようとしたにゃ！",
    "雪が降って寒いから、コタツの中に冷ええのスイカを温めに入れちゃったにゃ！美味しくなるかにゃん？",
    "寒いからマフラーをマヨネーズのボトルにぐるぐる巻いて、風邪ひかないように温めてあげたにゃ！"
  ],
  general: [
    "あらあら！今朝は寝ぼけちゃって、大事な靴下を冷蔵庫のたまごケースに入れちゃったみたいにゃ！冷え冷えにゃ！",
    "メガネがみつからなくて大騒ぎしたけど、よく見たらたまのしっぽに引っかかってタンスの上で行き倒れてたにゃ！びっくりしたにゃん！",
    "お散歩の準備をしようとして、カバンの中にキャットフードと、間違えておじいちゃんのスリッパを詰め込んじゃったにゃ！"
  ]
};

// Beautiful fallback songs for seniors (Showa, comforting, warm classics) matching weather conditions
const FALLBACK_SONGS: Record<string, Array<{title: string, artist: string, commentary: string, youtubeUrl: string}>> = {
  rain: [
    {
      title: "雨のステーション",
      artist: "荒井由実",
      commentary: "しとしと雨の日は、ユーミンの透き通った歌声が心に優しく響くにゃ。今日の気分にはこの一曲、どうぞ召し上がれ♪",
      youtubeUrl: "https://www.youtube.com/watch?v=Xshm70LpC-w"
    },
    {
      title: "みずいろの手紙",
      artist: "八代亜紀",
      commentary: "雨の音を聴きながら、ハスキーで優しい歌声に耳を傾けるにゃ。懐かしい思い出と一緒に、どうぞ召し上がれ♪",
      youtubeUrl: ""
    },
    {
      title: "あめふりくまのこ",
      artist: "童謡",
      commentary: "雨の中、お水をのぞき込む子ぐまちゃんの可愛いお歌にゃ。心がほっこり和むメロディを、どうぞ召し上がれ♪",
      youtubeUrl: ""
    }
  ],
  sunny: [
    {
      title: "上を向いて歩こう",
      artist: "坂本九",
      commentary: "晴れ渡るお空を見上げながら聴く九ちゃんのハッピーな歌声は最高だにゃ！元気が出るこの一曲、どうぞ召し上がれ♪",
      youtubeUrl: "https://www.youtube.com/watch?v=C35DrtPlUbc"
    },
    {
      title: "川の流れのように",
      artist: "美空ひばり",
      commentary: "お日様の光を浴びながら、ゆったり流れる川のように穏やかな気持ちになれる昭和の大名曲にゃ。どうぞ召し上がれ♪",
      youtubeUrl: "https://www.youtube.com/watch?v=7uV_O6bZ5_M"
    },
    {
      title: "真っ赤な太陽",
      artist: "美空ひばり",
      commentary: "晴れた日には、ひばりさんのエネルギー満点な歌声でノリノリになっちゃうにゃ！パワフルなリズムを、どうぞ召し上がれ♪",
      youtubeUrl: ""
    }
  ],
  cloudy: [
    {
      title: "見上げてごらん夜の星を",
      artist: "坂本九",
      commentary: "雲の向こうにはいつでも綺麗な星空が広がっているにゃ。優しい気持ちに包まれる九ちゃんの名曲、どうぞ召し上がれ♪",
      youtubeUrl: "https://www.youtube.com/watch?v=S0X2gbe7rAw"
    },
    {
      title: "岬めぐり",
      artist: "山本コウタローとウィークエンド",
      commentary: "曇り空の下でも、旅をしているような優しい哀愁と温かい風を感じられる曲にゃ。のんびり気分でどうぞ召し上がれ♪",
      youtubeUrl: ""
    },
    {
      title: "学生時代",
      artist: "ペギー葉山",
      commentary: "懐かしい青春の思い出がよみがえる、上品で温かみのあるメロディにゃ。お茶を飲みながらどうぞ召し上がれ♪",
      youtubeUrl: ""
    }
  ],
  snow: [
    {
      title: "なごり雪",
      artist: "イルカ",
      commentary: "雪の季節に心までじんわり温まる、切なくて優しいフォークソングの名曲にゃ。冷えた体にこの暖かいメロディ、どうぞ召し上がれ♪",
      youtubeUrl: "https://www.youtube.com/watch?v=7M7gS8_wB6E"
    },
    {
      title: "津軽海峡・冬景色",
      artist: "石川さゆり",
      commentary: "こたつで温まりながら聴く、さゆりさんの圧倒的な歌声と雪景色。胸が熱くなるドラマチックな名曲を、どうぞ召し上がれ♪",
      youtubeUrl: ""
    },
    {
      title: "雪の降る街を",
      artist: "高英男",
      commentary: "静かに雪が舞い散る日にぴったりの、優雅でちょっぴりロマンチックな昭和クラシックにゃ。どうぞ召し上がれ♪",
      youtubeUrl: ""
    }
  ],
  general: [
    {
      title: "少年時代",
      artist: "井上陽水",
      commentary: "たまセレクトの定番！あの夏の日の輝きと優しさが、心いっぱいに広がる名曲だにゃ。今日の気分に、どうぞ召し上がれ♪",
      youtubeUrl: ""
    },
    {
      title: "あの素晴しい愛をもう一度",
      artist: "加藤和彦と北山修",
      commentary: "誰もが口ずさみたくなる爽やかで優しいメロディにゃ。みんなでいっしょに歌いたくなる一曲、どうぞ召し上がれ♪",
      youtubeUrl: ""
    },
    {
      title: "四季の歌",
      artist: "芹洋子",
      commentary: "春、夏、秋、冬、それぞれの季節を愛する優しい心を歌った素晴らしいお歌にゃ。のんびりしながらどうぞ召し上がれ♪",
      youtubeUrl: ""
    }
  ]
};

// Helper to check for quota or rate limit errors
function isQuotaError(error: any): boolean {
  if (!error) return false;
  const errMsg = String(error.message || "").toLowerCase();
  return (
    error.status === "RESOURCE_EXHAUSTED" ||
    error.statusCode === 429 ||
    errMsg.includes("quota") ||
    errMsg.includes("rate limit") ||
    errMsg.includes("limit exceeded") ||
    errMsg.includes("exhausted")
  );
}

// API Endpoints

/**
 * 1. Fetch current weather in Japan (defaults to Tokyo) using Google Search Grounding
 */
app.post("/api/weather", async (req, res) => {
  try {
    const city = req.body.city || "東京";
    const prompt = `Search for the current actual weather and temperature in ${city}, Japan today.
Return a structured JSON object detailing:
- condition: The general weather condition in Japanese (e.g., "晴れ", "雨", "くもり", "雪", "雷雨")
- temperature: The current actual temperature in Celsius as an integer
- description: A warm, friendly greeting text in Japanese suitable for an elderly user, mentioning the actual weather and advising them (e.g., "今日は気持ちのいい晴れですね。水分をしっかり取ってくださいにゃ。")`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            condition: {
              type: Type.STRING,
              description: "Weather condition in Japanese (晴れ, 雨, くもり, etc.)",
            },
            temperature: {
              type: Type.INTEGER,
              description: "Temperature in Celsius as an integer",
            },
            description: {
              type: Type.STRING,
              description: "Warm elderly-friendly greeting in Japanese",
            },
          },
          required: ["condition", "temperature", "description"],
        },
      },
    });

    const text = response.text || "{}";
    const weatherData = JSON.parse(text);

    // Extract search grounding sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let sourceUrl = "";
    if (chunks && chunks.length > 0) {
      sourceUrl = chunks[0]?.web?.uri || "";
    }
    weatherData.sourceUrl = sourceUrl;

    res.json(weatherData);
  } catch (error: any) {
    if (isQuotaError(error)) {
      console.warn("⚠️ [Gemini API WARNING] Quota exceeded or Rate limited in /api/weather. Using beautiful local fallback.");
    } else {
      console.error("❌ Weather search error:", error);
    }
    
    // Graceful fallback weather data
    res.json({
      condition: "晴れ",
      temperature: 22,
      description: "お天気情報を調べるのがお休みみたいにゃ。でも今日もおだやかな良い一日にしましょうにゃ🐾",
      sourceUrl: "",
      fallback: true,
    });
  }
});

/**
 * 2. Generate Tama's soft, cute "boke" based on weather context
 */
app.post("/api/tama/boke", async (req, res) => {
  const { condition } = req.body;
  const weatherText = String(condition || "晴れ");
  
  // Pick matching contextual fallback in advance
  let fallbackList = WEATHER_BOKE_FALLBACKS.general;
  if (weatherText.includes("雨")) {
    fallbackList = WEATHER_BOKE_FALLBACKS.rain;
  } else if (weatherText.includes("晴") || weatherText.includes("快晴")) {
    fallbackList = WEATHER_BOKE_FALLBACKS.sunny;
  } else if (weatherText.includes("くもり") || weatherText.includes("曇")) {
    fallbackList = WEATHER_BOKE_FALLBACKS.cloudy;
  } else if (weatherText.includes("雪")) {
    fallbackList = WEATHER_BOKE_FALLBACKS.snow;
  }
  const defaultBoke = fallbackList[Math.floor(Math.random() * fallbackList.length)];

  try {
    const prompt = `あなたは猫のキャラクター「たま」です。少しおっちょこちょいで可愛い猫。
高齢者が思わずクスッと笑ってツッコミを入れたくなるような、優しく安全なおボケを1つ言います。

条件：
- 現在の天気状況：${weatherText}
- この天気情報や季節感を取り入れたおボケにしてください。
- 高齢者向けに、優しく、安全で、不安にさせない内容にしてください。
- 日本語で、50文字以内の話し言葉（語尾は「〜にゃ」「〜にゃん」など）で返してください。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            boke: {
              type: Type.STRING,
              description: "たまの可愛いボケのセリフ（日本語・50文字以内）",
            },
          },
          required: ["boke"],
        },
      },
    });

    const text = response.text || "{}";
    const bokeData = JSON.parse(text);
    res.json(bokeData);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("⚠️ [Gemini API WARNING] Quota exceeded or Rate limited in /api/tama/boke. Using dynamic local fallback.");
    } else {
      console.error("❌ Tama boke generation error:", error);
    }
    
    res.json({
      boke: defaultBoke,
    });
  }
});

/**
 * 3. Generate Tama's reaction to a tsukkomi or laughter, with DJ Tama song recommendation on correct/tsukkomi action
 */
app.post("/api/tama/reply", async (req, res) => {
  const { boke, action, userMessage, weatherCondition } = req.body;
  const weatherText = String(weatherCondition || "晴れ");
  
  // Choose beautiful Japanese default replies beforehand to be highly robust
  let defaultReply = "えへへ、気づいてくれて嬉しいにゃ！次は間違えないように頑張るにゃん🐾";
  if (action === "correct") {
    const correctReplies = [
      "あちゃー！ばれちゃったにゃ！おじいちゃんはやっぱり何でも知っててすごいにゃ〜🐾",
      "えへへ、さすがツッコミが冴えてるにゃ！たま、次から引き出しにしまうようにするにゃん🐾",
      "にゃん！ツッコんでくれて嬉しいにゃ！たま、またお勉強になったにゃ🐾"
    ];
    defaultReply = correctReplies[Math.floor(Math.random() * correctReplies.length)];
  } else if (action === "laugh") {
    const laughReplies = [
      "にゃはは！いっしょに笑うと、お腹の底からぽかぽか温かくなるにゃん！嬉しいにゃ〜🐾",
      "たまのボケでたくさん笑って、今日も元気いっぱいに過ごしてほしいにゃん🐾",
      "おじいちゃんのニコニコ笑顔が見られて、たまは世界一しあわせな猫だにゃ🐾"
    ];
    defaultReply = laughReplies[Math.floor(Math.random() * laughReplies.length)];
  }

  // Pre-configured fallback song selection if API fails or doesn't generate song properly
  let songFallbackList = FALLBACK_SONGS.general;
  if (weatherText.includes("雨")) {
    songFallbackList = FALLBACK_SONGS.rain;
  } else if (weatherText.includes("晴") || weatherText.includes("快晴")) {
    songFallbackList = FALLBACK_SONGS.sunny;
  } else if (weatherText.includes("くもり") || weatherText.includes("曇")) {
    songFallbackList = FALLBACK_SONGS.cloudy;
  } else if (weatherText.includes("雪")) {
    songFallbackList = FALLBACK_SONGS.snow;
  }
  const chosenFallbackSong = songFallbackList[Math.floor(Math.random() * songFallbackList.length)];
  const robustFallbackSongObj = {
    title: chosenFallbackSong.title,
    artist: chosenFallbackSong.artist,
    youtubeUrl: chosenFallbackSong.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(chosenFallbackSong.title + " " + chosenFallbackSong.artist)}`,
    commentary: chosenFallbackSong.commentary
  };

  try {
    let actionDesc = "";
    if (action === "correct") {
      actionDesc = "おじいちゃん・おばあちゃんから愛のある『ツッコミ』をもらいました。おっちょこちょいを優しく指摘されて、照れながらも嬉しそうにしています。";
    } else if (action === "laugh") {
      actionDesc = "おじいちゃん・おばあちゃんが『いっしょに笑って』くれました。たまは嬉しくて大はしゃぎしています。";
    } else if (userMessage) {
      actionDesc = `おじいちゃん・おばあちゃんから直接おしゃべりメッセージ『${userMessage}』をもらいました。`;
    }

    let prompt = `あなたは猫のキャラクター「たま」です。
おじいちゃん・おばあちゃんとの会話を楽しんでいます。

直前のたまのボケ：「${boke}」
ユーザーのリアクション：${actionDesc}

これに対する「たま」の可愛くて嬉しいお返事を生成してください。
- 高齢者が温かい気持ちになり、脳が刺激されるような、優しくて明るい対話にしてください。
- 50文字以内で、ひらがなを多めにした読みやすい日本語にしてください。
- 語尾は「〜にゃ」「〜にゃん」にしてください。`;

    if (action === "correct") {
      prompt += `\n\nさらに、あなたは「DJたま」としての一面を持っています。
今日の天気状況（${weatherText}）や、たまのボケにツッコミを入れてくれたユーザーの気分に合わせて、
高齢者（おじいちゃん・おばあちゃん）が懐かしく感じたり、心が穏やかに和む実在の有名な曲（昭和の名曲、昭和歌謡、童謡、やさしいフォークソングなど）を1曲おすすめしてください。

Google検索（Google Search grounding）を使って、その実在する曲のYouTube個別動画のURL（例: https://www.youtube.com/watch?v=...）を必ず探して提示してください。
たまのおすすめコメントは、少し粋で優しいDJ風（例：「今日の気分にはこの一曲、どうぞ召し上がれ♪」のようなDJ口調）にしてください。`;
    }

    const responseSchemaProperties: any = {
      reply: {
        type: Type.STRING,
        description: "たまのお返事セリフ（日本語・50文字以内）",
      },
    };
    const responseSchemaRequired = ["reply"];

    if (action === "correct") {
      responseSchemaProperties.song = {
        type: Type.OBJECT,
        description: "たまがおすすめする今日の一曲。実在する有名な曲の情報を必ず含めてください。",
        properties: {
          title: {
            type: Type.STRING,
            description: "おすすめする実在の有名な曲名（日本語表記、例: 上を向いて歩こう）"
          },
          artist: {
            type: Type.STRING,
            description: "曲の歌手・アーティスト名（日本語表記、例: 坂本九）"
          },
          youtubeUrl: {
            type: Type.STRING,
            description: "実在するその曲のYouTube動画URL（例: https://www.youtube.com/watch?v=...）。見つからない場合は空にしてください。"
          },
          commentary: {
            type: Type.STRING,
            description: "DJたまとしての少し粋で優しい日本語の紹介コメント（50〜100文字程度。「どうぞ召し上がれ♪」などのDJ口調を含む）"
          }
        },
        required: ["title", "artist", "youtubeUrl", "commentary"]
      };
      responseSchemaRequired.push("song");
    }

    const config: any = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: responseSchemaProperties,
        required: responseSchemaRequired,
      },
    };

    if (action === "correct") {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: config,
    });

    const text = response.text || "{}";
    const replyData = JSON.parse(text);

    // If action is correct and song is returned, validate and fallback YouTube URL
    if (action === "correct") {
      if (!replyData.song) {
        replyData.song = robustFallbackSongObj;
      } else {
        const s = replyData.song;
        if (!s.title || !s.artist) {
          replyData.song = robustFallbackSongObj;
        } else if (!s.youtubeUrl || (!s.youtubeUrl.includes("youtube.com") && !s.youtubeUrl.includes("youtu.be"))) {
          s.youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(s.title + " " + s.artist)}`;
        }
      }
    }

    res.json(replyData);
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("⚠️ [Gemini API WARNING] Quota exceeded or Rate limited in /api/tama/reply. Using robust dynamic fallback.");
    } else {
      console.error("❌ Tama reply generation error:", error);
    }
    
    const replyRes: any = {
      reply: defaultReply,
    };
    if (action === "correct") {
      replyRes.song = robustFallbackSongObj;
    }
    res.json(replyRes);
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
