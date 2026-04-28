"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HeaderAuth() {
  const { data: session, status } = useSession();

  // Don't render anything while we're figuring out the session state
  if (status === "loading") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
    );
  }

  if (session?.user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="logged-in"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex items-center gap-3"
        >
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User avatar"}
              width={32}
              height={32}
              className="rounded-full ring-2 ring-slate-200 dark:ring-slate-700"
            />
          )}
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
            {session.user.name}
          </span>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.button
        key="logged-out"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        onClick={() => signIn("github")}
        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      >
        <LogIn size={16} />
        Sign in
      </motion.button>
    </AnimatePresence>
  );
}
