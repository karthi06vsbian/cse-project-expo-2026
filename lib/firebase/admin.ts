import { getApps, getApp, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore as getAdminFirestoreInstance, Firestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuthInstance, Auth } from 'firebase-admin/auth';

function getAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'cse-expo-2026';

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  try {
    return initializeApp({ projectId });
  } catch {
    return initializeApp();
  }
}

export function getAdminFirestore(): Firestore | null {
  try {
    const app = getAdminApp();
    return getAdminFirestoreInstance(app);
  } catch (err) {
    console.warn('[Firebase Admin] Firestore fallback');
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  try {
    const app = getAdminApp();
    return getAdminAuthInstance(app);
  } catch {
    return null;
  }
}
