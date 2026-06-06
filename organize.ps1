Write-Host "Creating folders..." -ForegroundColor Green
New-Item -ItemType Directory -Path src -Force | Out-Null
New-Item -ItemType Directory -Path src/pages -Force | Out-Null
New-Item -ItemType Directory -Path src/components -Force | Out-Null
New-Item -ItemType Directory -Path src/utils -Force | Out-Null
New-Item -ItemType Directory -Path src/hooks -Force | Out-Null
New-Item -ItemType Directory -Path src/context -Force | Out-Null
New-Item -ItemType Directory -Path src/styles -Force | Out-Null

Write-Host "Moving files..." -ForegroundColor Green

Move-Item -Path App.jsx -Destination src/ -Force -ErrorAction SilentlyContinue
Move-Item -Path main.jsx -Destination src/ -Force -ErrorAction SilentlyContinue
Move-Item -Path Dashboard.jsx -Destination src/pages/ -Force -ErrorAction SilentlyContinue
Move-Item -Path Login.jsx -Destination src/pages/ -Force -ErrorAction SilentlyContinue
Move-Item -Path Settings.jsx -Destination src/pages/ -Force -ErrorAction SilentlyContinue
Move-Item -Path WeeklyReview.jsx -Destination src/pages/ -Force -ErrorAction SilentlyContinue
Move-Item -Path DailyChecklist.jsx -Destination src/components/ -Force -ErrorAction SilentlyContinue
Move-Item -Path StreakCounter.jsx -Destination src/components/ -Force -ErrorAction SilentlyContinue
Move-Item -Path FocusTimer.jsx -Destination src/components/ -Force -ErrorAction SilentlyContinue
Move-Item -Path ConsistencyChart.jsx -Destination src/components/ -Force -ErrorAction SilentlyContinue
Move-Item -Path TimeBlock.jsx -Destination src/components/ -Force -ErrorAction SilentlyContinue
Move-Item -Path Header.jsx -Destination src/components/ -Force -ErrorAction SilentlyContinue
Move-Item -Path firebase.js -Destination src/utils/ -Force -ErrorAction SilentlyContinue
Move-Item -Path dateHelper.js -Destination src/utils/ -Force -ErrorAction SilentlyContinue
Move-Item -Path useFirebaseAuth.js -Destination src/hooks/ -Force -ErrorAction SilentlyContinue
Move-Item -Path TaskContext.jsx -Destination src/context/ -Force -ErrorAction SilentlyContinue
Move-Item -Path globals.css -Destination src/styles/ -Force -ErrorAction SilentlyContinue

Write-Host "Done!" -ForegroundColor Green
