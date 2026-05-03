"use client";

import { auth, googleProvider } from "@/lib/firebase";
import api from "@/lib/api";
import {
  createUserWithEmailAndPassword,
  getIdResult,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendUser, setBackendUser] = useState(null);

  useEffect(() => {
    const storedUser = api.getUser();
    if (storedUser) {
      setBackendUser(storedUser);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdToken();
          
          // Try login first (handles both new and existing users)
          const response = await api.loginWithFirebase(idTokenResult);
          
          if (response.success) {
            setBackendUser(response.data?.user);
          }
        } catch (error) {
          console.error("Backend auth error:", error);
          // Don't clear user on auth error if we have localStorage data
          const storedUser = api.getUser();
          if (!storedUser) {
            setBackendUser(null);
          }
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
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Don't call backend here - onAuthStateChanged will handle it automatically
    return result;
  };

  const signUp = async (name, phone, email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    // Don't call backend here - onAuthStateChanged will handle it automatically
    // when Firebase user state changes
    return user;
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // Don't call backend here - onAuthStateChanged will handle it automatically
    return result;
  };

  const logOut = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }
    await signOut(auth);
    setBackendUser(null);
  };

  const updateUserProfile = async ({ name }) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    await updateProfile(auth.currentUser, {
      displayName: name ?? auth.currentUser.displayName,
    });
    setUser({ ...auth.currentUser });
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        backendUser,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logOut,
        updateUserProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
