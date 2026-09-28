# Google Firebase Setup Guide (100% Free Plan)

This guide walks you through setting up **Google Firebase** (Cloud Firestore + Firebase Google Authentication) on the free **Spark Plan** for **CSE Project Expo 2026**.

---

## 1. Create a Free Firebase Project

1. Open [console.firebase.google.com](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Project Name: `CSE Project Expo 2026` (or any name you choose).
4. *(Optional)* Google Analytics: Enable or disable based on your preference.
5. Click **Create project** and wait ~10 seconds.

---

## 2. Enable Google Authentication

1. In the Firebase console left menu, click **Build** → **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Google**.
4. Toggle **Enable** to **ON**.
5. Set the **Project support email** (choose your Gmail address).
6. Click **Save**.

---

## 3. Enable Cloud Firestore Database

1. In the left menu, click **Build** → **Firestore Database**.
2. Click **Create database**.
3. Choose a Database Location (e.g. `asia-south1` Mumbai).
4. Under Security Rules, select:
   - **Start in test mode** (allows read/write during development) or **Start in production mode**.
5. Click **Enable**.

---

## 4. Register Web App & Get Web Configuration

1. In the Firebase Console, click the **Settings Gear (⚙️)** in the top left next to "Project Overview" → **Project settings**.
2. Under the **General** tab, scroll down to **Your apps**.
3. Click the Web icon `</>`.
4. App nickname: `CSE Expo Web`.
5. Click **Register app**.
6. Firebase will display your `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "cse-expo-2026.firebaseapp.com",
     projectId: "cse-expo-2026",
     storageBucket: "cse-expo-2026.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:abcdef..."
   };
   ```
7. Copy these values to your `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cse-expo-2026.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=cse-expo-2026
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cse-expo-2026.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
   ```

---

## 5. Generate Firebase Admin Service Account Key

To allow the server to manage Firestore records securely:
1. In Firebase Console, go to **Project settings (⚙️)** → **Service accounts** tab.
2. Click **Generate new private key** → Click **Generate key**.
3. A JSON file will download to your computer. Open it and copy:
   - `client_email` $\rightarrow$ `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` $\rightarrow$ `FIREBASE_ADMIN_PRIVATE_KEY`
   - `project_id` $\rightarrow$ `FIREBASE_ADMIN_PROJECT_ID`

---

## 6. Update `.env.local`

```env
# Firebase Web Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...

# Firebase Admin SDK (Server-Side)
FIREBASE_ADMIN_PROJECT_ID=your-app
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-app.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Admin Credentials
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=expo2026admin
```

---

## 7. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Students can now click **"Sign in with Google / Gmail"** using the Firebase native popup!
