import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore as getAdminFirestoreInstance, Firestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuthInstance, Auth } from 'firebase-admin/auth';

function getAdminApp(): App | null {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'cseprojetexpo';

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (err) {
      console.warn('[Firebase Admin] Error initializing with cert:', err);
      return null;
    }
  }

  // Do not attempt GCP ADC lookup in environments like Vercel where metadata server does not exist
  return null;
}

export function getAdminFirestore(): Firestore | null {
  try {
    const app = getAdminApp();
    if (!app) return null;
    return getAdminFirestoreInstance(app);
  } catch (err) {
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  try {
    const app = getAdminApp();
    if (!app) return null;
    return getAdminAuthInstance(app);
  } catch {
    return null;
  }
}
