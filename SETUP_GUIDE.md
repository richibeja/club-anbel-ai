# Super Agent Anbel AI - Setup Guide

## 🚀 Quick Start Guide

This guide will help you set up the complete system from scratch.

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm 8+ installed
- Firebase account (free tier works)
- Telegram account
- Text editor (VS Code recommended)

---

## 🔧 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it "super-agent-anbel-club"
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 1.2 Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable "Email/Password" provider

### 1.3 Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your region (closest to your users)

### 1.4 Setup Storage

1. Go to "Storage"
2. Click "Get Started"
3. Accept default security rules
4. Click "Done"

### 1.5 Get Firebase Credentials

1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps"
3. Click Web app icon (</>)
4. Register app name: "Super Agent Anbel Club"
5. Copy all credentials

### 1.6 Get Service Account (for Admin SDK)

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. You'll need this for the bot

---

## 📱 Step 2: Telegram Bot Setup

### 2.1 Create Bot with BotFather

1. Open Telegram and search for "@BotFather"
2. Send `/newbot`
3. Choose a name: "Super Agent Anbel AI"
4. Choose a username: "SuperAgentAnbelBot" (or similar)
5. Copy the bot token (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2.2 Configure Bot

1. Send `/setdescription` to BotFather
2. Paste: "Lottery club management bot with AI-powered predictions"
3. Send `/setabouttext`
4. Paste: "Official bot for Super Agent Anbel AI Club"
5. Send `/setcommands` and paste:
```
start - Start the bot
register - Register as member
numbers - Get your predictions
upload - Upload ticket photo
payment - Payment information
status - Check membership status
help - Show help
```

---

## 💻 Step 3: Project Installation

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Create Environment File

```bash
cp .env.example .env.local
```

### 3.3 Configure Environment Variables

Open `.env.local` and fill in:

```env
# Firebase (from Step 1.5)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (from Step 1.6 - service account JSON)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"

# Telegram (from Step 2.1)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Payment Info
ZELLE_EMAIL=your_email@example.com
ZELLE_PHONE=+19295909116
BANK_ACCOUNT_NUMBER=1234567890
BANK_NAME=Your Bank Name
```

---

## 🏃 Step 4: Run the System

### 4.1 Start Admin Panel

Open terminal 1:
```bash
npm run dev
```

Admin panel will be available at: http://localhost:3000

### 4.2 Start Telegram Bot

Open terminal 2:
```bash
npm run bot
```

You should see: "✅ Telegram Bot Started Successfully!"

---

## 🎯 Step 5: Test the System

### 5.1 Test Telegram Bot

1. Open Telegram
2. Search for your bot username
3. Send `/start`
4. Send `/register`
5. You should be registered as a member

### 5.2 Test Admin Panel

1. Go to http://localhost:3000/admin/dashboard
2. You should see the dashboard
3. Go to "Members" - you should see your test registration

---

## 📊 Step 6: Import Predictions

### 6.1 Prepare CSV Data

Format for Powerball (5 numbers + powerball):
```
5,12,23,45,67,15
8,19,27,34,52,8
14,21,33,46,59,12
```

Format for Mega Millions (5 numbers + megaball):
```
7,14,28,35,49,10
11,22,33,44,55,18
5,15,25,35,45,22
```

### 6.2 Import via Admin Panel

1. Go to "Predictions" page
2. Select lottery type
3. Select draw date
4. Paste CSV data
5. Click "Import Predictions"
6. Click "Auto-Assign to Active Members"

---

## ✅ Step 7: Verify Everything Works

### Test Flow:

1. **Register via Telegram:**
   - Send `/register` to bot
   - Verify in Admin Panel → Members

2. **Activate Member:**
   - Go to Admin Panel → Members
   - Click "Activate" on your test member

3. **Get Prediction:**
   - Send `/numbers` to bot
   - You should receive your personalized prediction

4. **Upload Ticket:**
   - Send `/upload` to bot
   - Send any photo (for testing)
   - Verify in Admin Panel → Tickets

5. **Check Payment Flow:**
   - Send `/payment` to bot
   - Verify payment instructions appear

---

## 🚀 Step 8: Deploy to Production

### 8.1 Deploy Admin Panel (Vercel)

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts and add environment variables in Vercel dashboard.

### 8.2 Deploy Bot (Railway/Render)

1. Push code to GitHub
2. Create account on [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add all environment variables
6. Deploy!

---

## 📞 Support

If you encounter issues:

1. Check Firebase Console for errors
2. Check bot logs: `npm run bot`
3. Check browser console for web errors
4. Verify all environment variables are set correctly

---

## 🎉 You're Ready!

Your Super Agent Anbel AI Club system is now fully functional!

**Next Steps:**
1. Customize the affiliate plan document
2. Set up payment methods (Hotmart, Zelle)
3. Invite your first members
4. Start importing real predictions from Gana Fácil

---

**Good luck! 🍀**

