import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, isVisible, onClose, type = 'success' }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed z-[100] px-4 py-3 rounded-full shadow-lg"
                    style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '20px',
                        maxWidth: '90%',
                        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
                    }}
                >
                    <span className="text-white font-medium text-center block">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
