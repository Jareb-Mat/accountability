# ACCOUNTABILITY - QUICK REFERENCE

## Commands You Need

```bash
# First time only:
npm install

# Start development:
npm run dev

# Build for production:
npm run build

# Deploy to Vercel:
vercel
```

---

## Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Realtime Database
- [ ] Enable Email/Password auth
- [ ] Copy Firebase credentials
- [ ] Create `.env.local` file
- [ ] Paste credentials into `.env.local`
- [ ] Run `npm run dev`

---

## Daily Workflow

1. **Morning**: Open app, see today's schedule
2. **As you go**: Click DONE when task is finished
3. **If you fail**: Click SKIP (don't hide it)
4. **Evening**: Try to get 100% completion
5. **Check**: See your streak and weekly stats

---

## App Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Main daily view + tasks |
| Settings | `/settings` | Configure your schedule |
| Weekly Review | `/review` | Analytics & patterns |
| Login | `/login` | Sign in/create account |

---

## Key Concepts

**Streak**
- How many days in a row you completed 100% of tasks
- Breaks if you miss even 1 task
- Shows your longest streak ever

**Completion Rate**
- % of today's tasks completed
- Red if < 50%, Yellow if 50-80%, Green if 80%+
- Can't lock in day until 100%

**Consistency %**
- Your average completion rate over last 7 days
- Good = 80%+, At risk = 50-80%, Failing = <50%

---

## File Editing Guide

**Change default schedule:**
- File: `src/utils/firebase.js` (line ~70)
- Look for `defaultSchedule = { ... }`
- Add/edit tasks and times

**Change timer duration:**
- File: `src/components/FocusTimer.jsx` (line 8)
- Change `useState(25)` to your preferred minutes

**Change colors:**
- File: `src/styles/globals.css` (top section)
- Look for `--color-*` variables
- Red = failures, Green = completions, Blue = buttons

**Change schedule time format:**
- Uses 24-hour time (06:00 = 6am, 18:00 = 6pm)

---

## Deployment One-Liner

**Vercel:**
```bash
npm run build && npx vercel
```

**Firebase Hosting:**
```bash
npm run build && npx firebase deploy
```

---

## Environment Variables

Copy these from Firebase Console:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
```

**Never share these!**

---

## Common Errors

| Error | Fix |
|-------|-----|
| "Can't find module" | Run `npm install` |
| "Firebase config error" | Check `.env.local` |
| "Tasks not saving" | Check Firebase Realtime DB is enabled |
| "Stuck loading" | Clear cache (Ctrl+Shift+Delete) |
| "Can't sign up" | Check email format & password length |

---

## Customization Ideas

- Add study duration targets (min 30min of calc daily)
- Add exercise blocks
- Add class attendance tracking
- Add meal reminders
- Add sleep schedule enforcement
- Add weekly review prompts

---

## Success Metrics

**Week 1**
- Should complete 40-60% of tasks
- Getting familiar with app

**Week 2-3**
- Should complete 60-80%
- Building consistency

**Week 4+**
- Should complete 80-100%
- Habits forming

**Month 2**
- 15-30 day streaks
- Classes attended regularly
- Study blocks consistent

---

## UX Tips

- Tasks should be **specific**: Not "Study" but "Do problem set 2.1-2.10"
- Tasks should be **time-locked**: "7:00 Breakfast" not "Eat sometime"
- Schedule should be **realistic**: Don't set 20 tasks/day (you'll break on day 1)
- Review **weekly**: Patterns show what's really happening
- Don't change schedule mid-week: Commit to it for a week

---

## Mobile Testing

- App is fully responsive
- Test on your phone with: `http://your-ip:5173`
- Works on iOS/Android browser

---

## Backup Your Data

Firebase auto-backs up, but you can export:
1. Firebase Console → Realtime Database
2. Click ⋮ → "Export as JSON"
3. Save to computer

---

**Remember: This app only works if you use it. Every day. No exceptions.**
