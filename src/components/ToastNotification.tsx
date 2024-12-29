import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ToastNotificationProps {
  message: string;
  isVisible: boolean;
}

export const ToastNotification = ({ message, isVisible }: ToastNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-6 md:mt-8 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-slate-300 rounded-lg">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            <span className="text-white">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 