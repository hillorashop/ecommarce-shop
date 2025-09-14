"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function FirstTimeDataToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const QUERY_CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE"; // persister key
    const AUTH_TOKEN = "auth_token"

    const isFirstTime = !localStorage.getItem(QUERY_CACHE_KEY || AUTH_TOKEN);

    if (isFirstTime) {
      setShow(true);
      localStorage.setItem("firstToastShown", "true");

      const timer = setTimeout(() => setShow(false), 20 * 1000); // auto hide after 5s
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
   <motion.div
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
  className="fixed bottom-5 right-5 w-80 max-w-full  backdrop-blur-md border border-white/40 text-black shadow-lg rounded-xl p-2 lg:p-4 flex flex-col gap-3 z-50"
>
  <div className="flex items-start gap-3">
    <CheckCircle className="size-4 lg:size-6 mt-1 flex-shrink-0 text-green-500" />
    <div className="flex-1">
      <h4 className="font-semibold text-black text-sm lg:text-base">সফলভাবে সংরক্ষিত</h4>
   <p className="text-xs lg:text-sm text-muted-foreground">
  আপনার ডেটা সফলভাবে সংরক্ষিত হয়েছে। 
  পরবর্তী বার এটি স্বয়ংক্রিয়ভাবে লোড হবে।
</p>

    </div>
    <button
      onClick={() => setShow(false)}
      className="text-black/60 hover:text-black"
    >
      <X className="size-4 lg:size-5" />
    </button>
  </div>

  {/* OK Button */}
  <button
    onClick={() => setShow(false)}
    className="mt-1 lg:mt-2 text-sm lg:text-base bg-green-600 text-white font-semibold px-2 lg:px-4 py-0.5 lg:py-1 rounded-lg hover:bg-green-500 transition w-full"
  >
    OK
  </button>
</motion.div>

      )}
    </AnimatePresence>
  );
}
