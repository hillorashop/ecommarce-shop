"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function FirstTimeDataToast() {
  const [showCacheToast, setShowCacheToast] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const QUERY_CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE";
    const AUTH_TOKEN = "auth_token";
    const TOAST_SHOWN_KEY = "toast_shown"; // new flag

    // ✅ Only show toast if cache/auth exists AND toast has never been shown before
    if (!localStorage.getItem(TOAST_SHOWN_KEY)) {
      if (localStorage.getItem(QUERY_CACHE_KEY)) {
        setShowCacheToast(true);
        localStorage.setItem(TOAST_SHOWN_KEY, "true"); // mark as shown
        const timer = setTimeout(() => setShowCacheToast(false), 20 * 1000);
        return () => clearTimeout(timer);
      }

      if (localStorage.getItem(AUTH_TOKEN)) {
        setShowAuthToast(true);
        localStorage.setItem(TOAST_SHOWN_KEY, "true"); // mark as shown
        const timer = setTimeout(() => setShowAuthToast(false), 20 * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const Toast = ({ onClose }: { onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed bottom-5 right-5 w-80 max-w-full backdrop-blur-md border border-white/40 text-black shadow-lg rounded-xl p-4 flex flex-col gap-3 z-50"
    >
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 lg:w-6 mt-1 flex-shrink-0 text-primary" />
        <div className="flex-1">
          <h4 className="font-semibold text-black text-sm lg:text-base">
            সফলভাবে সংরক্ষিত
          </h4>
          <p className="text-xs lg:text-sm text-muted-foreground">
            আপনার ডেটা সফলভাবে সংরক্ষিত হয়েছে। পরবর্তী বার এটি স্বয়ংক্রিয়ভাবে লোড হবে।
          </p>
        </div>
        <button onClick={onClose} className="text-black/60 hover:text-black">
          <X className="w-4 lg:w-5" />
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-2 text-sm lg:text-base bg-primary text-white font-semibold px-4 py-1 rounded-lg hover:bg-yellow-400 transition w-full"
      >
        OK
      </button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {showCacheToast && <Toast onClose={() => setShowCacheToast(false)} />}
      {showAuthToast && <Toast onClose={() => setShowAuthToast(false)} />}
    </AnimatePresence>
  );
}
