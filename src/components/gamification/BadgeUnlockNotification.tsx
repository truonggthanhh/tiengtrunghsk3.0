/**
 * Badge Unlock Notification Component
 * Shows notification when user unlocks a new badge
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, X } from 'lucide-react';
import type { Badge } from '@/types/gamification';

interface BadgeUnlockNotificationProps {
  badge: {
    name: string;
    description?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
    icon_url?: string;
  };
  onClose: () => void;
}

const RARITY_COLORS = {
  common: {
    bg: 'from-gray-400 to-gray-500',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
  rare: {
    bg: 'from-blue-400 to-blue-600',
    border: 'border-blue-300',
    text: 'text-blue-700',
  },
  epic: {
    bg: 'from-purple-400 to-purple-600',
    border: 'border-purple-300',
    text: 'text-purple-700',
  },
  legendary: {
    bg: 'from-amber-400 to-orange-500',
    border: 'border-amber-300',
    text: 'text-amber-700',
  },
};

const RARITY_LABELS = {
  common: 'Thường',
  rare: 'Hiếm',
  epic: 'Sử Thi',
  legendary: 'Huyền Thoại',
};

export function BadgeUnlockNotification({ badge, onClose }: BadgeUnlockNotificationProps) {
  const [show, setShow] = useState(true);
  const rarity = badge.rarity || 'common';
  const colors = RARITY_COLORS[rarity];

  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 ${colors.border} overflow-hidden">
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${colors.bg} px-4 py-2 flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold text-sm">Huy Hiệu Mới!</span>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Badge Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center shadow-lg`}
                >
                  {badge.icon_url ? (
                    <img src={badge.icon_url} alt={badge.name} className="w-10 h-10" />
                  ) : (
                    <Award className="w-8 h-8 text-white" />
                  )}
                </motion.div>

                {/* Badge Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {badge.name}
                    </h4>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.text} bg-${rarity}-100 dark:bg-${rarity}-900`}>
                      {RARITY_LABELS[rarity]}
                    </span>
                  </div>
                  {badge.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {badge.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress bar animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`mt-3 h-1 bg-gradient-to-r ${colors.bg} rounded-full origin-left`}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compact toast version for multiple badges
export function BadgeUnlockToast({ badge }: { badge: { name: string; rarity?: string } }) {
  const rarity = (badge.rarity || 'common') as keyof typeof RARITY_COLORS;
  const colors = RARITY_COLORS[rarity];

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border-2 ${colors.border} rounded-lg p-3 shadow-lg">
      <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center`}>
        <Award className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
          {badge.name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Huy hiệu mới đã mở khóa!
        </p>
      </div>
    </div>
  );
}
