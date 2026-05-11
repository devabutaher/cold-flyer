/**
 * Auth Provider - Client-side wrapper for auth state
 * Uses Firebase auth with localStorage persistence
 */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import api from "@/lib/api-client";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = api.getUser();
    if (storedUser) {
      setBackendUser(storedUser);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdToken();
          try {
            const response = await api.loginWithFirebase(idTokenResult);
            if (response.success) {
              setBackendUser(response.data?.user);
            }
          } catch (error) {
            console.error("Backend auth error:", error);
            const storedUser = api.getUser();
            if (!storedUser) {
              setBackendUser(null);
            }
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
      } else {
        setBackendUser(null);
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const result = await import("firebase/auth").then((m) =>
      m.signInWithEmailAndPassword(auth, email, password)
    );
    return result;
  };

  const signUp = async (name, phone, email, password) => {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    return user;
  };

  const signInWithGoogle = async () => {
    const { signInWithPopup } = await import("firebase/auth");
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  };

  const logOut = async () => {
    try {
      await api.logout();
    } catch (error) {
      // Ignore backend logout errors - user will be logged out anyway
    }
    await firebaseSignOut(auth);
    setBackendUser(null);
    router.push("/");
  };

  const updateUserProfile = async ({ name }) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    const { updateProfile } = await import("firebase/auth");
    await updateProfile(auth.currentUser, {
      displayName: name ?? auth.currentUser.displayName,
    });
    setUser({ ...auth.currentUser });
  };

  const resetPassword = async (email) => {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    return await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    backendUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logOut,
    updateUserProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}