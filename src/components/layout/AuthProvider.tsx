import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  dbUser: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Connection test for Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              companyName: '',
              membershipTier: 'NONE',
              membershipStatus: 'ACTIVE',
              role: 'client',
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, newUser);
            setDbUser(newUser);
          } else {
            setDbUser(userSnap.data());
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Full Authentication Error:", error);
      
      const errorCode = error.code;
      if (errorCode === 'auth/unauthorized-domain') {
        alert(
          "SECURITY BLOCK: Your app is not authorized to use Firebase Auth on this domain.\n\n" +
          "Please add this exact URL to your Firebase Authorized Domains list: " + window.location.hostname + "\n\n" +
          "Domains to add:\n- d111111official.vercel.app\n- dbdb40.vercel.app\n- upfrica.africa"
        );
      } else if (
        errorCode === 'auth/popup-closed-by-user' || 
        errorCode === 'auth/popup-blocked' ||
        errorCode === 'auth/cancelled-popup-request'
      ) {
        console.log("Popup instantly blocked or closed. Attempting fallback to signInWithRedirect...");
        alert("Popup blocked or closed. Redirecting you to Google Sign-In directly...");
        
        // Add a tiny delay to ensure alert is cleared and browser state settles
        setTimeout(() => {
          signInWithRedirect(auth, provider).catch(redirectError => {
            console.error("Redirect Fallback Error:", redirectError);
            alert("Sign in issue during redirect fallback: " + redirectError.message);
          });
        }, 300);
      } else {
        alert("Sign in issue: " + error.message);
      }
    }
  }, []);

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
