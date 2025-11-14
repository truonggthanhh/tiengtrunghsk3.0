/**
 * XP Gain Animation Component
 * Shows floating +XP animation when user earns XP
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface XPGainAnimationProps {
  xp: number;
  onComplete?: () => void;
}

export function XPGainAnimation({ xp, onComplete }: XPGainAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -80, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="text-2xl font-bold">+{xp} XP</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface XPGainToastProps {
  xp: number;
  source?: string;
}

export function XPGainToast({ xp, source }: XPGainToastProps) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-amber-900 dark:text-amber-100">
          +{xp} XP Earned!
        </p>
        {source && (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {source}
          </p>
        )}
      </div>
    </div>
  );
}
