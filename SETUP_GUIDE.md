# ACCOUNTABILITY APP - COMPLETE SETUP GUIDE

## System Overview

This is a **web-based accountability system** for students. It's designed to be:
- **Frictionless**: One click to check off tasks
- **Brutal**: Makes failures visible permanently
- **Portable**: Works on phone, tablet, desktop
- **Fast**: Instant feedback, no delays

### Tech Stack
- **Frontend**: React 18 + Vite (build tool)
- **Styling**: Tailwind CSS + custom CSS
- **Backend**: Firebase (real-time database + auth)
- **Hosting**: Vercel (recommended) or Firebase Hosting

**Why this stack?**
- React: Component-based, easy to maintain
- Vite: 10x faster builds than Create React App
- Tailwind: Utility CSS, perfect for dark/brutalist design
- Firebase: Real-time sync, zero server management, free tier is generous

---

## Step-by-Step Setup

### Prerequisites
- Node.js 16+ installed ([download](https://nodejs.org))
- A Google account (for Firebase)
- A code editor (VS Code recommended)

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it (e.g., "accountability-app")
4. Disable Google Analytics (you don't need it)
5. Click **Create project**
6. Wait 1-2 minutes...

### 2. Set Up Realtime Database

1. In Firebase Console, click **Realtime Database** (left sidebar)
2. Click **Create Database**
3. Start location: `us-central1`
4. Security rules: Choose **Start in test mode**
5. Click **Enable**

Test mode allows anyone with the DB URL to read/write. This is fine for personal use. For production, update rules to:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "tasks": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "streaks": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 3. Enable Authentication

1. Click **Authentication** (left sidebar)
2. Click **Get Started**
3. Click **Email/Password**
4. Toggle **Enable**
5. Click **Save**

### 4. Get Firebase Config

1. Click **Project Settings** (⚙️ icon)
2. Scroll to **Your apps**
3. Click **Web** app (if it exists) or add one
4. Copy the config object

Your config will look like:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "myproject.firebaseapp.com",
  projectId: "myproject",
  storageBucket: "myproject.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123..."
}
```

You also need the **Database URL**:
1. Go to **Realtime Database**
2. Copy the URL at the top (looks like `https://myproject.firebaseio.com`)

### 5. Clone/Download App

```bash
# Navigate to where you want the app
cd ~/Desktop

# If you have git:
git clone <repo-url>
cd accountability-app

# Or download the ZIP and extract it
```

### 6. Install Dependencies

```bash
npm install
```

This installs React, Firebase SDK, React Router, Tailwind, etc.

### 7. Configure Environment

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and paste your Firebase credentials:

```
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myproject
VITE_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123...
VITE_FIREBASE_DATABASE_URL=https://myproject.firebaseio.com
```

**IMPORTANT**: Never commit `.env.local` to Git. It's already in `.gitignore`.

### 8. Run Locally

```bash
npm run dev
```

Output will look like:
```
  ➜  Local:   http://localhost:5173/
```

Open that URL in your browser.

### 9. Test It

1. Sign up with your email
2. Go to Settings
3. Create a simple schedule (e.g., "Attend 9am class", "Do math practice")
4. Go back to Dashboard
5. Mark tasks as done or skip them
6. Check the weekly review

---

## Folder Structure Explained

```
accountability-app/
├── src/
│   ├── App.jsx                    # Main app routing
│   ├── main.jsx                   # React entry point
│   ├── components/                # Reusable UI components
│   │   ├── DailyChecklist.jsx     # Task list UI
│   │   ├── StreakCounter.jsx      # Streak display
│   │   ├── FocusTimer.jsx         # Pomodoro timer
│   │   ├── ConsistencyChart.jsx   # Weekly stats
│   │   ├── TimeBlock.jsx          # Current task display
│   │   └── Header.jsx             # Navigation
│   ├── pages/                     # Full page components
│   │   ├── Dashboard.jsx          # Main daily view
│   │   ├── Settings.jsx           # Schedule config
│   │   ├── WeeklyReview.jsx       # Analytics
│   │   └── Login.jsx              # Auth page
│   ├── context/
│   │   └── TaskContext.jsx        # Global state management
│   ├── hooks/
│   │   └── useFirebaseAuth.js     # Auth hook
│   ├── utils/
│   │   ├── firebase.js            # Firebase helpers
│   │   └── dateHelper.js          # Date utilities
│   └── styles/
│       └── globals.css            # Global styling
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
├── vite.config.js                # Build config
├── tailwind.config.js            # Tailwind config
├── postcss.config.js             # CSS processing
├── .env.example                  # Environment template
├── .env.local                    # Your actual secrets (don't commit!)
├── .gitignore                    # Git ignore rules
└── README.md                     # Documentation
```

---

## How The App Works

### Authentication Flow
1. User signs up with email/password
2. Firebase creates auth account + user document
3. User redirected to Dashboard
4. Auth state persists across sessions

### Task Flow (Daily)
1. **Morning**: User opens app, sees today's schedule
2. **Throughout day**: User marks tasks as DONE or SKIP
3. **Evening**: If all tasks DONE, click "LOCK IN DAY"
4. **Streak calculation**: Automatically updates

### Streak Logic
- **Day 1**: Complete 100% → streak = 1
- **Day 2**: Complete 100% → streak = 2
- **Day 3**: Miss even 1 task → streak resets to 0
- Longest streak is always tracked separately

### Data Flow (Firebase → React)
```
Firebase Database
    ↓ (real-time listener)
TaskContext (state)
    ↓ (useContext hook)
Components (UI update)
```

When you check off a task, it writes to Firebase in ~100ms.

---

## Key Files to Understand

### `src/context/TaskContext.jsx`
This is the "brain" of the app. It:
- Loads tasks from Firebase
- Manages today's state
- Calculates streaks
- Syncs changes back to Firebase

### `src/pages/Dashboard.jsx`
This is the main page you see. It:
- Shows current streak
- Shows current time + what you should be doing
- Shows today's completion rate
- Lists all tasks

### `src/components/DailyChecklist.jsx`
The task list. For each task it shows:
- Time of task
- Task title
- DONE button (marks complete)
- SKIP button (marks failed)

### `src/utils/firebase.js`
Helper functions for reading/writing Firebase data. Examples:
- `getTasksForDate()` - Get all tasks for a date
- `setTaskForDate()` - Update a task
- `getStreak()` - Get streak data

---

## Customization Examples

### Change Default Schedule
File: `src/utils/firebase.js`, line ~70

```javascript
const defaultSchedule = {
  '06:00': 'Wake up & shower',      // Change these!
  '07:00': 'Breakfast',
  '08:00': 'Attend class',
  // Add/remove as needed
};
```

### Change Timer Duration
File: `src/components/FocusTimer.jsx`, line 8

```javascript
const [minutes, setMinutes] = useState(25);  // 25 = 25 minutes
```

### Change Colors
File: `src/styles/globals.css`, top section

```css
--color-red-600: #dc2626;       /* Failures */
--color-green-600: #16a34a;     /* Completions */
--color-blue-600: #2563eb;      /* Buttons */
```

### Change Font
File: `src/styles/globals.css`

```css
font-family: 'IBM Plex Mono', 'Space Mono', monospace;
/* Change to your preferred monospace font */
```

---

## Deployment

### Option 1: Vercel (Recommended - Takes 2 minutes)

1. Push code to GitHub (if you want)
2. Go to https://vercel.com
3. Click "Import Project"
4. Connect your GitHub account (or paste repo URL)
5. Add your environment variables
6. Click Deploy

Your app will be live at `yourname.vercel.app`

### Option 2: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build app
npm run build

# Deploy
firebase deploy
```

### Option 3: Netlify

Same as Vercel - connect GitHub, add env vars, deploy.

---

## Important Security Notes

1. **Never commit `.env.local`** - It has your Firebase secrets
2. **Firebase rules**: Update security rules for production (see above)
3. **HTTPS only**: Always use HTTPS (Vercel/Firebase do this automatically)
4. **Password security**: Firebase handles password hashing automatically

---

## Testing the App

### Test Scenario 1: Complete a Day
1. Create 3 tasks in Settings
2. Mark all as DONE
3. Click "LOCK IN DAY"
4. Streak should increase by 1

### Test Scenario 2: Break Streak
1. Day 1: Complete all tasks (streak = 1)
2. Day 2: Miss 1 task
3. Check streak - should show "BROKEN"

### Test Scenario 3: Weekly Review
1. Complete few tasks each day
2. Go to /review
3. See daily breakdown and average

---

## Troubleshooting

### Issue: Tasks not saving
**Solution:**
1. Check browser console for errors (F12 → Console)
2. Verify Firebase credentials in `.env.local`
3. Check Firebase Realtime Database is enabled
4. Check security rules aren't blocking writes

### Issue: App stuck on loading
**Solution:**
1. Check internet connection
2. Check Firebase project is active
3. Check browser network tab (F12 → Network)
4. Try clearing cache: Ctrl+Shift+Delete

### Issue: Can't sign up
**Solution:**
1. Check email is valid
2. Check password is 6+ characters
3. Check Authentication is enabled in Firebase
4. Check Email/Password provider is toggled ON

### Issue: App too slow
**Solution:**
1. Normal on slow networks
2. Consider disabling real-time sync for first load
3. Enable PWA caching
4. Check browser DevTools performance

---

## Next Steps

1. **Get it running**: Follow setup steps above
2. **Customize schedule**: Add your real classes/study times
3. **Use it daily**: Open first thing in morning, check before bed
4. **Review weekly**: Go to /review to see patterns
5. **Adjust as needed**: Settings page lets you modify schedule anytime

---

## Pro Tips

1. **Build momentum**: First 7 days are hardest. Push through.
2. **Be specific**: Instead of "Study", use "Do Calc problem set 1-10"
3. **Track what matters**: Include classes, study blocks, sleep schedule
4. **Review pattern**: Weekly review shows the truth about your discipline
5. **Share it**: Tell a friend about your streak (social accountability)

---

## Support & Issues

- **Firebase docs**: https://firebase.google.com/docs
- **React docs**: https://react.dev
- **Tailwind docs**: https://tailwindcss.com/docs
- **Vite docs**: https://vitejs.dev

---

**Built for students who are tired of failing themselves.**
