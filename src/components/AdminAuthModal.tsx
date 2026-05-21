import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface AdminAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [error, setError] = useState('');

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
    };

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setCaptchaInput('');
            setError('');
            generateCaptcha();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== 'Director2026!!') {
            setError('Unauthorized access: Invalid administrator password.');
            return;
        }

        if (captchaInput.toUpperCase().trim() !== captchaCode) {
            setError('Verification failed: CAPTCHA code is incorrect.');
            generateCaptcha();
            return;
        }

        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md bg-zinc-900 border border-orange-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-orange-600 to-transparent" />

                <div className="text-center space-y-4 mb-6">
                    <div className="mx-auto w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                        <ShieldAlert className="text-orange-500" size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Admin Authentication</h2>
                    <p className="text-zinc-400 text-xs tracking-wide">Enter the system passcode and captcha to unlock the panel.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Administrator Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-700"
                            placeholder="••••••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Captcha Verification</label>
                        <div className="flex items-center gap-4">
                            <div className="bg-black/60 rounded-xl px-6 py-3 font-mono text-xl tracking-[0.25em] text-orange-500 select-none italic border border-zinc-800 font-bold">
                                {captchaCode}
                            </div>
                            <button
                                type="button"
                                onClick={generateCaptcha}
                                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors uppercase tracking-wider placeholder:text-zinc-700"
                            placeholder="Enter Code"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-semibold text-center bg-red-950/20 border border-red-500/10 py-3 rounded-xl">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase text-[10px] tracking-[0.15em] py-3.5 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[10px] tracking-[0.15em] py-3.5 rounded-xl transition-all shadow-lg shadow-orange-950/20"
                        >
                            Unlock Access
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
