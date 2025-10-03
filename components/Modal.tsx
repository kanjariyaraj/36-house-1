import React, { FC, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from './icons/XMarkIcon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
}

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm p-4"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                    onClick={onClose}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                    >
                        <div className="flex items-start justify-between p-4 border-b border-slate-200 dark:border-slate-700 rounded-t">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
                                {title}
                            </h3>
                            <button
                                type="button"
                                className="p-1 text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm dark:hover:bg-slate-600 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;