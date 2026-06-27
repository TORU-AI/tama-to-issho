<div align="center">

# 🐱 Tama to Issho（たまといっしょ）

### A boke-cat AI companion that keeps Japan's home-alone seniors sharp, active & connected.
ボケる猫「たま」と、毎日たのしく脳と骨を元気にする高齢者見守りAIエージェント

**Gemini AI Hackathon 2026 — Submission by Toru Ito（伊東 徹）**

🌐 **Live Demo (Google Cloud Run):** https://service-519694522769.us-west1.run.app

</div>

---

## 🎯 The Problem ／ 課題

In Japan, young people move to Tokyo for work while their parents and grandparents
stay behind in the countryside, **living alone**. Simply by living an ordinary daily life,
these seniors gradually lose conversation, movement, and human contact — and end up
**socially isolated**, accelerating cognitive decline and physical frailty.

> 若者は東京へ。地方に残された親・祖父母は一人暮らしの中で、“普通に生活しているだけ”で
> 会話・運動・人との接点を失い、社会的に孤立し、認知機能と運動機能が落ちていく。

**The danger isn't illness — it's a day with no one to talk to.**
病気の前に、“話す相手のいない毎日”そのものがリスクになる。

---

## 💡 The Solution ／ 解決

Meet **Tama**, a slightly clumsy cat who makes a gentle joke (*boke*) every day.
The senior *retorts* (*tsukkomi*) — and that one playful exchange becomes natural brain training.
A habit-forming AI agent that wraps health, movement, joy, and family connection into a cat you want to see every day.

たまが毎日ボケる →「ツッコミ」を入れる、その一往復が自然な脳トレに。
健康・運動・楽しみ・家族のつながりを、可愛い猫の習慣に包んで届ける**習慣化AIエージェント**。

---

## ✨ Features ／ 主な機能

| Feature | What it does | Powered by |
|---|---|---|
| 🧠 **Cognitive — Boke → Tsukkomi** ／ 認知予防 | Tama generates a fresh joke every day, **grounded in today's real weather**. The retort sparks cognition. | **Gemini API** + **Google Search Grounding** |
| 🦴 **Bones — Walk with Tama** ／ 骨粗鬆症予防 | A walk timer computes time, steps & **calories (METs 3.0)**; nudges sunlight & vitamin D for bone health. | Gemini API + METs model |
| 🎧 **Joy — Tama the DJ** ／ 今日の一曲 | After the retort, Tama spins "today's song" — a **real YouTube link** matched to mood & weather. | **Gemini API** + **Google Search Grounding** |
| 👨‍👩‍👧 **Family Circle** ／ 家族見守り | Chats, walks & meals are shared with distant family. "She's doing well today." | Activity timeline |

> **Two independent Search Grounding pipelines** (weather **and** music) keep Tama tied to real-time, real-world data — not hallucinations.

---

## 🤖 Multi-Agent Orchestration ／ マルチエージェント連携（審査基準②：革新性）

The daily **AI Watch-Over Report** is produced by **four specialised Gemini agents** that
collaborate in sequence — a coordinator dispatches each agent and merges their outputs into
one card. Each agent has a distinct role and reads the day's activity data.

| Agent | Role |
|---|---|
| 🐱 **Conversation Agent (たま)** | The personality — daily weather-grounded boke & replies |
| 🩺 **Health Concierge** | Reads today's walk/chat records → one gentle, prioritised health nudge |
| 🎧 **DJ Agent** | Grounded song discovery → today's real YouTube pick |
| ✉️ **Family Report Agent** | Synthesises the above into a reassuring summary for distant family |

> 4つの専門エージェント（会話・健康コンシェルジュ・DJ・家族レポート）が順に連携し、
> その日の記録を読んで1枚の「AI見守りレポート」を共同生成する。

## 🎙️ Multimodal ／ マルチモーダル（審査基準②：革新性）

- **Voice output (TTS):** every Tama utterance can be read aloud with a senior-tuned, slowed Japanese voice — a "🔊 read aloud" button on each agent card.
- **Voice input (STT):** a giant mic button lets seniors *retort by speaking* — speech is recognised, transcribed, and sent to Tama hands-free. Ideal for users uncomfortable with keyboards.
- Auto read-aloud is toggleable in Settings.

---

## ☁️ Google Cloud Integration ／ Google Cloud 統合（審査基準①）

This project is built **end-to-end on Google's stack**:

- **Gemini API** — generates every boke, conversational reply, health nudge, and song pick.
- **Google Search Grounding ×2** — two separate grounded pipelines: (1) today's **live weather** → drives the daily joke & greeting; (2) **real song discovery** → returns an actual YouTube URL.
- **Google Cloud Run** — the production deployment serving the live, mobile-ready app.
- **Server-side key handling** — the `GEMINI_API_KEY` lives only in the Express backend (`server.ts`) and is **never exposed** to the browser.

```
[ React 19 + Vite ]  →  [ Express server ]  →  [ Gemini API ]
   elderly-first UI       hides the API key      boke / reply / song
        (mobile)                                      │
                                                      ▼
                                        [ Google Search Grounding ×2 ]
                                          live weather  +  real songs
                                                      │
                                                      ▼
                                          [ Google Cloud Run · live URL ]
```

---

## 🛠 Tech Stack ／ 技術構成

- **Frontend:** React 19 + Vite + TypeScript — large-type, high-contrast UI for ages 70–80+
- **Backend:** Express (`server.ts`) — server-side Gemini calls, API key never exposed
- **AI:** Google **Gemini API** + **Google Search Grounding** (weather & music)
- **Deploy:** **Google Cloud Run** (live, runs on smartphones)

## 👵 Designed for Seniors ／ 高齢者向けのこだわり

- Extra-large fonts, thick tactile buttons, generous tap targets
- High-contrast warm palette (pale cream × terracotta)
- Gentle hiragana-rich Japanese, with read-aloud support

## 🚀 Run Locally ／ ローカル実行

```bash
npm install
# set GEMINI_API_KEY in .env.local
npm run dev
```
**Prerequisite:** Node.js

---

<div align="center">
Made with ❤️ for おじいちゃん・おばあちゃん ／ Gemini AI Hackathon 2026 · Toru Ito
</div>
