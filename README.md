# ACCOUNTABILITY - Daily Enforcement System

A brutal, no-excuses productivity app designed for students who need **structure over motivation**.

**What this is:** A strict accountability system that tracks your daily compliance and makes failures visible. No snooze, no skip, no motivation speeches.

**What this isn't:** A reminder app or motivational tool.

---

## 🎯 Quick Start (5 minutes)

### 1. Clone or Download
```bash
cd accountability-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Firebase

1. Go to https://console.firebase.google.com
2. Create a new project (any name)
3. Create a **Realtime Database** (Start in test mode)
4. Enable **Email/Password Authentication**
5. Copy your Firebase config from Project Settings → Web App

### 4. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:
```
VITE_FIREBASE_API_KEY=abc123...
VITE_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myproject
VITE_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
VITE_FIREBASE_DATABASE_URL=https://myproject.firebaseio.com
```

### 5. Run Locally
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📱 Features Explained

### Daily Non-Negotiable Checklist
Every task in your schedule appears with two buttons: **DONE** or **SKIP**.
- DONE = You completed it (visible immediately)
- SKIP = You failed it (permanent mark on your record)

No "snooze" option. No "do it later."

### Strict Time Blocks
Your schedule is locked in at setup. Each time has one specific task.
- The app shows you what you should be doing RIGHT NOW
- If you're overdue, it highlights in red

### Streak System
- **Current Streak**: Days in a row where you completed 100% of tasks
- **Longest Streak**: Your personal best
- Break the streak = lose progress (the pain is intentional)

### Failure Visibility
Every missed task is permanently logged. Weekly review shows:
- Daily completion rate
- Total tasks failed
- Pattern analysis

### Completion Rate
- 0-50%: Red (You're repeating past failures)
- 50-80%: Yellow (Inconsistent)
- 80-100%: Green (You're building a real streak)

### Focus Timer
Simple 25-minute Pomodoro timer. Tracks sessions completed.

---

## 🔧 How to Use

### First Login
1. Sign up with your university email
2. You'll get a default schedule (wake up → classes → study blocks → sleep)
3. Go to Settings and customize it

### Daily Workflow
1. **Open the app** first thing in the morning
2. **Check your schedule** for today
3. **Complete tasks** as you go
4. **Mark as DONE** when finished
5. **Mark as SKIP** if you give up (no hiding)
6. **Hit LOCK IN DAY** when all tasks are done (or accept failure)

### Weekly Review
Go to `/review` to see your weekly patterns:
- Days you crushed it (100%)
- Days you failed (below 50%)
- Average consistency score

---

## 🗄️ Data Structure (Firebase)

```json
users/
  {uid}/
    email: "student@university.edu"
    createdAt: 1234567890
    schedule: {
      "06:00": "Wake up & shower",
      "07:00": "Breakfast",
      "09:00": "Attend class",
      ...
    }

tasks/
  {uid}/
    2025-05-01/
      "wake-up": {
        "title": "Wake up & shower",
        "time": "06:00",
        "completed": true,
        "completedAt": 1234567890
      }
      "attend-class": {
        "completed": false,
        "failed": true  // You skipped it
      }

streaks/
  {uid}/
    current: 7
    longest: 21
    lastCompletedDate: "2025-05-01"
    lastFailDate: "2025-04-24"
```

---

## 🎨 Design Philosophy

**Brutalist + Utilitarian**
- Black background, high contrast
- Monospace font (feels like a terminal/contract)
- Red for failures, green for wins
- Zero decorative elements
- Information-dense layout

**Psychological Design**
- Breaking a streak should HURT (visually and emotionally)
- Completed tasks are de-emphasized (they're expected)
- Failed tasks GLOW RED
- No positive affirmations or motivational language

---

## 🚀 Deployment

### Deploy to Vercel (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Vercel will:
1. Build your React app
2. Host it on a global CDN
3. Give you a live URL

Your Firebase backend works automatically (no server needed).

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

---

## 📊 Key Metrics to Track

### Personal Streak
- **Goal**: 30+ days straight with 100% completion
- **Reality check**: Most students hit 3-5 days before life happens
- **The point**: Breaking the streak should feel like real consequences

### Weekly Consistency
- **Good**: 80%+
- **At risk**: 50-80%
- **Failing**: <50% (this pattern got you Cs and Fs before)

### Monthly Pattern
- Week 1: Usually high (new motivation)
- Week 2-3: Reality sets in (consistency tested)
- Week 4: Habits form or break here

---

## 🔐 Privacy & Data

- **Your data is yours**: Stored in your Firebase project
- **No tracking**: No analytics or user tracking
- **Offline-first**: App stores data locally, syncs when online
- **Sign out anytime**: All data stays in Firebase

---

## ⚙️ Customization

### Change Default Schedule
Edit `src/utils/firebase.js`, function `initializeUser()`:

```javascript
const defaultSchedule = {
  '06:00': 'Wake up & shower',
  '07:00': 'Breakfast',
  // ... your custom schedule
};
```

### Change Timer Length
In `src/components/FocusTimer.jsx`, line 8:
```javascript
const [minutes, setMinutes] = useState(25);  // Change 25 to any number
```

### Change Colors
Edit `src/styles/globals.css` variables:
```css
--color-red-600: #dc2626;
--color-green-600: #16a34a;
```

---

## 🐛 Troubleshooting

**"Tasks not saving"**
- Check Firebase Realtime Database rules are in test mode or public
- Check your `.env.local` file has correct credentials
- Check browser console for error messages

**"Stuck on loading"**
- Check internet connection
- Check Firebase project is active
- Clear localStorage: `localStorage.clear()` in console

**"App feels slow on mobile"**
- This is normal for Firebase on slow networks
- Consider enabling PWA caching

---

## 📈 Success Metrics

After 4 weeks, you should see:
- ✓ Attending most classes
- ✓ Consistent daily study blocks
- ✓ At least one 7-day streak
- ✓ Average weekly consistency above 70%

After 12 weeks:
- ✓ 30+ day streak
- ✓ Classes attended consistently
- ✓ Assignments completed on time
- ✓ Weekly consistency above 85%

---

## 🤝 Support

This is an open-source project. Feel free to:
- Add features
- Change the design
- Deploy your own version
- Share with classmates

---

## The Real Talk

You're here because you failed courses. Calculus I and CS II are hard, but thousands of students pass them every year. The difference isn't IQ—it's **consistency**.

This app doesn't make you smarter. It makes you **visible to yourself**. Every red missed task is a choice you made. Every broken streak is proof that discipline is optional.

Use this app like your GPA depends on it. Because it does.

---

**Version:** 1.0.0  
**Built for:** Students tired of being their own worst enemy
