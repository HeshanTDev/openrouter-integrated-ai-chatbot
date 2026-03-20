# AI Chat — OpenRouter

A modern, fully-featured ChatGPT-like AI chat application built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and the **OpenRouter API**.

![Preview](preview.png)

## ✨ Features

- 🤖 **Multiple AI models** — Switch between Step Flash 3.5, Nemotron 120B, and Trinity Large
- 🌙 **Dark / Light mode** — System-aware theme with manual toggle
- 💬 **Persistent chat history** — Stored in localStorage, survives page refresh
- 📋 **Markdown + Code rendering** — With syntax highlighting and copy button
- 📱 **Fully responsive** — Mobile sidebar overlay, desktop side-by-side
- 🔒 **Secure API key** — Key never exposed to the browser (server-side API route)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/openrouter-integrated-ai-chatbot
cd openrouter-integrated-ai-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
OPENROUTER_API_KEY=your_api_key_here
```

> Get your free API key at [openrouter.ai](https://openrouter.ai)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project**
3. Select your repository
4. Add the environment variable:
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** your OpenRouter API key
5. Click **Deploy**

---

## 📁 Project Structure

```
├── app/
│   ├── api/chat/route.js     # Secure server-side API route
│   ├── layout.js             # Root layout + theme hydration
│   ├── page.js               # Main page (state manager)
│   └── globals.css           # Global styles + CSS variables
├── components/
│   ├── Sidebar.jsx           # Chat history list + theme toggle
│   ├── ChatWindow.jsx        # Main chat area + input
│   ├── MessageBubble.jsx     # User/AI message bubbles
│   ├── ModelSelector.jsx     # Model dropdown
│   └── TypingIndicator.jsx   # Animated loading dots
├── .env.local                # Your API key (not committed)
└── .env.example              # Template for API key setup
```

---

## 🤖 Supported Models (Free Tier)

| Name | ID |
|------|-----|
| Step Flash 3.5 | `stepfun/step-3.5-flash:free` |
| Nemotron 120B | `nvidia/nemotron-3-super-120b-a12b:free` |
| Trinity Large | `arcee-ai/trinity-large-preview:free` |

---

## 🛡️ Security

The `OPENROUTER_API_KEY` is **only** accessed in `app/api/chat/route.js` server-side. It is **never** sent to the browser.
