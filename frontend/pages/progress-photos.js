import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";

export default function ProgressPhotosPage() {
  const [user, authLoading] = useAuthState(auth);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);
  const [compare, setCompare] = useState(null);

  useEffect(() => {
    if (!user) {
      setPhotos([]);
      return;
    }
    const photosRef = collection(db, "users", user.uid, "progressPhotos");
    const q = query(photosRef, orderBy("createdAt", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setError("");
    setUploading(true);
    try {
      const fileRef = ref(storage, `users/${user.uid}/progress/${Date.now()}-${file.name}`);
      const task = uploadBytesResumable(fileRef, file);
      await new Promise((resolve, reject) => {
        task.on("state_changed", undefined, reject, resolve);
      });
      const url = await getDownloadURL(task.snapshot.ref);
      await addDoc(collection(db, "users", user.uid, "progressPhotos"), {
        url,
        fileName: file.name,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const toggleSelection = (photo) => {
    if (!active) {
      setActive(photo);
    } else if (!compare && photo.id !== active.id) {
      setCompare(photo);
    } else if (photo.id === active.id) {
      setActive(compare);
      setCompare(null);
    } else if (compare && photo.id === compare.id) {
      setCompare(null);
    } else {
      setActive(photo);
      setCompare(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text)]">
        <p className="text-lg">Log in to manage progress photos.</p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <header className="px-5 py-6 border-b token-border flex items-center justify-between">
        <div>
          <p className="text-xs token-muted uppercase tracking-wide">Visual Proof</p>
          <h1 className="text-2xl font-semibold">Progress Photos</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-[var(--snap-green)]">
          ← Dashboard
        </Link>
      </header>

      <main className="px-5 py-6 space-y-6">
        <section className="token-card border token-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm token-muted">Upload + compare</p>
              <h2 className="text-lg font-semibold">Add new photo</h2>
            </div>
            <label className="btn-primary cursor-pointer">
              <span>{uploading ? "Uploading..." : "Upload"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {(active || compare) && (
            <div className="grid md:grid-cols-2 gap-3">
              {[active, compare].map((photo, idx) => (
                <div key={idx} className="border token-border rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center bg-black/20">
                  {photo ? (
                    <img src={photo.url} alt="progress" className="w-full object-cover" />
                  ) : (
                    <p className="text-sm token-muted">Select a {idx === 0 ? "current" : "comparison"} photo</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Gallery</h2>
            <span className="text-xs token-muted">Tap to compare</span>
          </div>
          {photos.length === 0 ? (
            <p className="text-sm token-muted">No uploads yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => toggleSelection(photo)}
                  className={`relative rounded-xl overflow-hidden border ${
                    active?.id === photo.id || compare?.id === photo.id
                      ? "border-[var(--snap-green)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <img src={photo.url} alt="progress" className="w-full h-48 object-cover" />
                  <span className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded-full">
                    {photo.createdAt?.toDate?.().toLocaleDateString?.() || "Pending"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
