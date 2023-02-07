import { app } from 'firebase-config';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();