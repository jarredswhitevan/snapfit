import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { serverDb } from "./firebaseServer";

const PLAN_LIMITS = {
  free: 5,
  premium: Number.MAX_SAFE_INTEGER,
  elite: Number.MAX_SAFE_INTEGER,
};

const UNLIMITED = new Set(["premium", "elite", "premium_trial"]);

async function lookupFirebaseUser(idToken) {
  if (!idToken) throw new Error("Missing token");
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("Missing Firebase API key");

  const resp = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!resp.ok) {
    throw new Error("Invalid or expired auth token");
  }

  const data = await resp.json();
  const user = data?.users?.[0];
  if (!user?.localId) {
    throw new Error("User not found");
  }
  return user;
}

export async function requireUserFromRequest(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    const err = new Error("Missing Authorization header");
    err.status = 401;
    throw err;
  }

  const firebaseUser = await lookupFirebaseUser(token);
  const uid = firebaseUser.localId;
  const profileRef = doc(serverDb, "users", uid, "profile", "main");
  const snap = await getDoc(profileRef);
  const planTier = snap.exists() ? snap.data()?.planTier || "free" : "free";

  if (!snap.exists()) {
    await setDoc(
      profileRef,
      {
        planTier: "free",
        createdAt: Date.now(),
      },
      { merge: true }
    );
  }

  return { uid, planTier, profileRef };
}

export async function enforceAiQuota(uid, planTier) {
  if (UNLIMITED.has(planTier)) {
    return { allowed: true, limit: PLAN_LIMITS[planTier] };
  }
  const usageRef = doc(serverDb, "users", uid, "profile", "usage");
  const snap = await getDoc(usageRef);
  const todayKey = new Date().toISOString().slice(0, 10);
  const limit = PLAN_LIMITS[planTier] ?? PLAN_LIMITS.free;
  let count = 0;
  if (snap.exists() && snap.data()?.dayKey === todayKey) {
    count = snap.data().dailyCount || 0;
  }
  if (count >= limit) {
    return { allowed: false, limit };
  }
  await setDoc(
    usageRef,
    { dayKey: todayKey, dailyCount: count + 1, updatedAt: Date.now() },
    { merge: true }
  );
  return { allowed: true, limit };
}
