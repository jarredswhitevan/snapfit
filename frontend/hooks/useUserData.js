// frontend/hooks/useUserData.js
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useUserData(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    // Realtime updates
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      } else {
        // Create user doc if missing
        setDoc(userRef, {
          name: "New User",
          goals: [],
          progress: 0,
          updatedAt: Date.now(),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { data, loading };
}
