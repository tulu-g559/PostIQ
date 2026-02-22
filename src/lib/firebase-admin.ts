import * as admin from 'firebase-admin';
import serviceAccount from '@/firebase/postiq-adminsdk.json';

let adminApp: admin.app.App;

export function initializeAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  return adminApp;
}

/**
 * Get the Firestore Admin instance.
 */
export function getAdminFirestore() {
  const app = initializeAdmin();
  return admin.firestore(app);
}

/**
 * Get the Auth Admin instance.
 */
export function getAdminAuth() {
  const app = initializeAdmin();
  return admin.auth(app);
}

export { admin };
