// lib/firebaseServer.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { firebaseConfig } from "./firebaseConfig";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const serverDb = getFirestore(app);
