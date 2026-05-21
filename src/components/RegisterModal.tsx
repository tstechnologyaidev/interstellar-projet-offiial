
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (user: User) => void;
}

const ADMIN_USERS = ['PvPFury', 'King_Divinewolf', 'Noomi'];

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister }) => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [answer, setAnswer] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [error, setError] = useState('');

    const generateCaptcha = () => {
        const code = Math.random().toString(36).substring(2, 7).toUpperCase();
        setCaptchaCode(code);
    };

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setUsername('');
            setAnswer('');
            setCaptchaInput('');
            setError('');
            generateCaptcha();
        }
    }, [isOpen]);

    const handleNext = () => {
        setError('');
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        if (ADMIN_USERS.includes(username)) {
            setStep(2);
        } else {
            setStep(3); // Standard users go to captcha
        }
    };

    const handleSecurityCheck = () => {
        if (answer.toLowerCase().trim() === 'masterbuilder') {
            setStep(3);
        } else {
            setError('Incorrect answer.');
        }
    };

    const handleComplete = () => {
        if (captchaInput.toUpperCase() !== captchaCode) {
            setError('Invalid captcha.');
            generateCaptcha();
            return;
        }

        onRegister({
            username,
            isAdmin: ADMIN_USERS.includes(username)
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md bg-zinc-900/90 border border-orange-500/20 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                                    <UserIcon className="text-orange-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Initialize Account</h2>
                                <p className="text-zinc-400 text-sm">Enter your Minecraft username to continue.</p>
                            </div>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Minecraft Username"
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                            />

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <button
                                onClick={handleNext}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-all active:scale-95"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                                    <ShieldCheck className="text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Identity Verification</h2>
                                <p className="text-zinc-400 text-sm">What was the first clan before Interstellar?</p>
                            </div>

                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Security Answer"
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                            />

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <button
                                onClick={handleSecurityCheck}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all active:scale-95"
                            >
                                Verify
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Final Step</h2>
                                <p className="text-zinc-400 text-sm">Please solve the captcha below.</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-zinc-800 rounded-lg px-6 py-3 font-mono text-xl tracking-widest text-orange-500 select-none italic border border-zinc-700">
                                    {captchaCode}
                                </div>
                                <button onClick={generateCaptcha} className="text-zinc-500 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                                </button>
                            </div>

                            <input
                                type="text"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                placeholder="Enter Code"
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                            />

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <button
                                onClick={handleComplete}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-all active:scale-95"
                            >
                                Complete Registration
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
