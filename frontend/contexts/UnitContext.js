"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const defaultUnits = {
  weight: "lbs",
  length: "imperial",
};

const UnitContext = createContext({
  units: defaultUnits,
  setWeightUnit: () => {},
  setLengthUnit: () => {},
  loadingUnits: true,
});

export function UnitProvider({ children }) {
  const [user] = useAuthState(auth);
  const [units, setUnits] = useState(defaultUnits);
  const [loadingUnits, setLoadingUnits] = useState(true);

  useEffect(() => {
    if (!user) {
      setUnits(defaultUnits);
      setLoadingUnits(false);
      return;
    }

    const profileRef = doc(db, "users", user.uid, "profile", "main");
    const unsub = onSnapshot(
      profileRef,
      async (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setUnits({
            weight: data?.preferredWeightUnit || defaultUnits.weight,
            length: data?.preferredLengthUnit || defaultUnits.length,
          });
        } else {
          await setDoc(
            profileRef,
            {
              planTier: "free",
              preferredWeightUnit: defaultUnits.weight,
              preferredLengthUnit: defaultUnits.length,
              updatedAt: Date.now(),
            },
            { merge: true }
          );
          setUnits(defaultUnits);
        }
        setLoadingUnits(false);
      },
      () => setLoadingUnits(false)
    );

    return () => unsub();
  }, [user]);

  const profileRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid, "profile", "main");
  }, [user]);

  const updateUnits = async (next) => {
    setUnits((prev) => ({ ...prev, ...next }));
    if (!profileRef) return;
    await setDoc(
      profileRef,
      {
        ...(next.weight ? { preferredWeightUnit: next.weight } : {}),
        ...(next.length ? { preferredLengthUnit: next.length } : {}),
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  };

  const setWeightUnit = (value) => updateUnits({ weight: value });
  const setLengthUnit = (value) => updateUnits({ length: value });

  const value = { units, setWeightUnit, setLengthUnit, loadingUnits };

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
}

export function useUnits() {
  return useContext(UnitContext);
}
