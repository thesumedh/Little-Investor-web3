# 💰 LittleInvestors — Financial Education for Kids

**Built for:** [Mind the Product — World Product Day "Everyone Ships Now" Hackathon 2026](https://devpost.com)

[![Live Demo](https://img.shields.io/badge/Live-Demo-2AA46A?style=for-the-badge)](https://littleinvestors.up.railway.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-1a2332?style=for-the-badge)](https://github.com/thesumedh/Little-Investors)

---

## 🎯 What is LittleInvestors?

LittleInvestors is a **parent-child collaborative financial literacy app** that makes learning about money genuinely fun for kids aged 8–16.

**The core insight:** Kids don't learn money from textbooks — they learn it by doing, with parents involved. LittleInvestors bridges that gap.

- 👧 **Kids** learn through video lessons, interactive quizzes, and simulating real stock investments
- 👨‍👩‍ **Parents** send virtual allowances, track progress, and collaborate on financial decisions
- 🤖 **AI coach "Penny"** answers any money question in plain, kid-friendly language

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🏠 **Dashboard** | Real-time portfolio view with animated balance, stock prices, buy/sell simulator |
| 📚 **5 Lessons** | Video-based lessons with XP rewards: Money, Saving, Spending, Risk, Investing |
| 🏆 **Quiz System** | 3-question quizzes after each lesson, with confetti on perfect scores |
| 🤖 **AI Chatbot** | Powered by Google Gemini — kid-friendly answers to money questions |
| 👨‍👩‍👧 **Parent Mode** | Parents send virtual allowances, view child's progress and activity feed |
| 📈 **Stock Simulator** | Buy/sell Apple, Amazon, Walmart with virtual coins — no real money |
| 📈 **Live Trend Sparklines** | Dynamic inline SVG sparkline graphs rendering real Yahoo Finance 5-day historical trend lines |
| 📰 **Market News Feed** | A curated stream of financial news updates displayed directly on the dashboard |
| 🎖️ **Achievements** | 7 achievement badges: Baby Buffett, Quiz Ace, Level Up, and more |
| 🔥 **Streak System** | Daily streak tracking + XP progression system |

---

## 🚀 Demo

**Live app:** https://little-investors-delta.vercel.app/

**Demo video:** [YouTube](#)

**Devpost submission:** [Link](#)

### Screenshots

<table>
  <tr>
    <td><b>Landing Page</b></td>
    <td><b>Dashboard</b></td>
    <td><b>Courses</b></td>
  </tr>
  <tr>
    <td><img src="demo/slide1.png" width="280"/></td>
    <td><img src="demo/slide2.png" width="280"/></td>
    <td><img src="demo/slide3.png" width="280"/></td>
  </tr>
  <tr>
    <td><b>Quiz</b></td>
    <td><b>AI Chatbot</b></td>
    <td><b>Parent Mode</b></td>
  </tr>
  <tr>
    <td><img src="demo/slide4.png" width="280"/></td>
    <td><img src="demo/slide5.png" width="280"/></td>
    <td><img src="demo/slide5.png" width="280"/></td>
  </tr>
</table>

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** EJS templates + Vanilla CSS + Vanilla JS
- **AI:** Google Gemini 2.5 Flash API
- **Analytics:** Novus.ai
- **Storage:** localStorage (client-side state)
- **Deployment:** Railway

---

## 🏃 Run Locally

```bash
git clone https://github.com/thesumedh/Little-Investors.git
cd Little-Investors
npm install
# Add GEMINI_API_KEY to src/.env
npm start
# Open http://localhost:3000
```

### Environment Variables (`src/.env`)
```
PORT=3000
GEMINI_API_KEY=your_key_here  # Get free at aistudio.google.com
NOVUS_TOKEN=your_token_here   # Get at novus.ai
```

---

## 📖 What I Built, Who It's For, What I Learned

**What I built:** A mobile-first web app that turns financial education into a collaborative game for families. Instead of boring lectures, kids invest virtual money in real stocks after completing bite-sized lessons — with parents participating by sending virtual allowances.

**Who it's for:** Parents who want to give their children a financial head start, especially in underrepresented communities where formal financial education is lacking. Kids aged 8–16 who learn best by doing.

**Tools used:** Built with Node.js/Express/EJS, styled with pure CSS, AI powered by Google Gemini, analytics via Novus.ai.

**What I learned:** The parent-child dynamic is the product's superpower. The moment you make financial learning a shared experience rather than homework, engagement transforms. Kids love showing their parents their quiz scores and stock picks.

---

## 🔮 What's Next

- Real stock price API integration (Polygon.io)
- Push notifications for parent deposits
- iMessage integration for family finance chats
- Expanded asset classes (crypto, ETFs, bonds)
- Teacher mode for classrooms

---

## 🧗 Challenges

- **Gemini API for kids**: Getting the AI to consistently give age-appropriate answers required careful system prompting and temperature tuning
- **State without a database**: Using localStorage for all game state required careful design of the data model
- **The parent-child UX split**: Designing one app that serves two very different user types (parent + child) without being confusing for either

---

*Built with ❤️ for the Mind the Product World Product Day Hackathon 2026*
*"Everyone Ships Now" — and we shipped! 🚀*
