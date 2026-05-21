import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Server,
    Shield,
    Info,
    Users,
    Menu,
    X,
    Settings as SettingsIcon,
    LogOut,
    Copy,
    Check,
    Lock
} from 'lucide-react';
import { cn } from './lib/utils';
import { useServerData } from './hooks/useServerData';
import { RegisterModal } from './components/RegisterModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminAuthModal } from './components/AdminAuthModal';
import { User } from './types';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Using the uploaded image path provided in the prompt context
const LOGO_URL = "/logo.png";

export default function App() {
    const { news, setNews, ranks, setRanks, team, setTeam, settings, setSettings } = useServerData();
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('is_current_user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('is_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('is_current_user');
        }
    }, [currentUser]);

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activePage, setActivePage] = useState<'home' | 'news' | 'ranks' | 'team' | 'admin'>('home');
    const [expandedRanks, setExpandedRanks] = useState<Record<string, boolean>>({});
    const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    // Disable right-click and shortcut keys to view source code
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }
            // Block Ctrl+Shift+I (DevTools), Ctrl+Shift+C (Inspect), Ctrl+Shift+J (Console), Ctrl+U (View Source)
            if (e.ctrlKey && (e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J') || e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                return false;
            }
            // Block Cmd+Option+I etc. on Mac
            if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.key === 'c' || e.key === 'C' || e.key === 'j' || e.key === 'J')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Automatically kick out non-admins trying to access the admin page
    useEffect(() => {
        if (activePage === 'admin') {
            if (!currentUser || !currentUser.isAdmin) {
                setActivePage('home');
                setIsAdminAuthenticated(false);
            } else if (!isAdminAuthenticated) {
                setIsAdminAuthOpen(true);
            }
        }
    }, [activePage, currentUser, isAdminAuthenticated]);

    const toggleRank = (id: string) => {
        setExpandedRanks(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const copyIp = () => {
        navigator.clipboard.writeText(settings.serverIp);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const navLinks = [
        { id: 'home', name: 'Home', icon: Info },
        { id: 'news', name: 'Announcements', icon: Info },
        { id: 'ranks', name: 'Ranks', icon: Shield },
        { id: 'team', name: 'Staff', icon: Users },
    ];

    const renderContent = () => {
        switch (activePage) {
            case 'home':
                return (
                    <section className="flex flex-col items-center text-center space-y-12 py-10 min-h-[60vh] justify-center animate-in fade-in duration-1000">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full" />
                            <img
                                src={LOGO_URL}
                                alt="Interstellar Project"
                                className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-3xl border border-white/10 shadow-2xl relative z-10"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1000&auto=format&fit=crop";
                                }}
                            />
                        </motion.div>

                        <div className="space-y-6 max-w-3xl">
                            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600 uppercase italic">
                                INTERSTELLAR<br />PROJECT
                            </h1>
                            <p className="text-zinc-400 text-lg md:text-xl font-medium tracking-wide">
                                Learn how the universe was created and how it forged our surroundingss.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 w-full">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-6 flex items-center gap-4 group hover:border-orange-500/50 transition-all cursor-pointer" onClick={copyIp}>
                                <div className="bg-orange-600 p-3 rounded-xl shadow-lg shadow-orange-900/40">
                                    <Server className="text-white" size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Direct IP</p>
                                    <p className="text-white font-mono font-bold">{settings.serverIp}</p>
                                </div>
                                <div className="ml-4 p-2 text-zinc-500 group-hover:text-white transition-colors">
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </div>
                            </div>

                            <a
                                href={settings.discordLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 px-8 rounded-2xl flex items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                                Discord
                            </a>
                        </div>
                    </section>
                );
            case 'news':
                return (
                    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center space-y-4">
                            <h2 className="text-6xl font-black tracking-tight uppercase italic">Announcements</h2>
                            <div className="h-1 w-24 bg-orange-600 mx-auto rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {news.length === 0 ? (
                                <p className="col-span-2 text-center text-zinc-500 py-20 bg-white/5 rounded-3xl border border-white/5">No transmissions received yet.</p>
                            ) : (
                                news.map((item) => (
                                    <div key={item.id} className="group bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/[0.08] hover:border-orange-500/30 transition-all">
                                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{item.date}</span>
                                        <h3 className="text-2xl font-bold text-white mt-2 mb-4 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                                        <p className="text-zinc-400 leading-relaxed whitespace-pre-line">{item.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                );
            case 'ranks':
                return (
                    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center space-y-4">
                            <h2 className="text-6xl font-black tracking-tight uppercase italic">Rank Hierarchy</h2>
                            <div className="h-1 w-24 bg-orange-600 mx-auto rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {ranks.length === 0 ? (
                                <p className="col-span-full text-center text-zinc-500 py-20 bg-white/5 rounded-3xl border border-white/5">The stars haven't aligned for ranks yet.</p>
                            ) : (
                                ranks.map((rank) => {
                                    const isExpanded = !!expandedRanks[rank.id];
                                    return (
                                        <motion.div
                                            key={rank.id}
                                            layout
                                            onClick={() => toggleRank(rank.id)}
                                            className={cn(
                                                "relative overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] p-8 group hover:border-orange-500/30 transition-all cursor-pointer flex flex-col gap-6",
                                                isExpanded ? "lg:col-span-2" : "items-center text-center justify-center h-full"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex flex-col items-center gap-4 w-full",
                                                isExpanded ? "md:flex-row md:justify-between border-b border-white/5 pb-6" : ""
                                            )}>
                                                <div className="flex flex-col md:flex-row items-center gap-6">
                                                    <div className="w-32 h-32 rounded-3xl bg-zinc-900 border-2 border-white/10 overflow-hidden flex items-center justify-center group-hover:border-orange-500/50 transition-colors flex-shrink-0">
                                                        {rank.icon ? (
                                                            <img src={rank.icon} alt={rank.name} className="object-contain p-2 max-w-[48px] max-h-[48px]" />
                                                        ) : (
                                                            <Shield size={48} className="text-zinc-700" />
                                                        )}
                                                    </div>
                                                    <div className={cn("text-center md:text-left", isExpanded ? "" : "flex flex-col items-center")}>
                                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-orange-500 transition-colors">{rank.name}</h3>
                                                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-2 block">
                                                            {isExpanded ? "Click to collapse" : "Click to view perks"}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-zinc-500 group-hover:text-white transition-colors hidden md:block">
                                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-full space-y-6 overflow-hidden text-left"
                                                    >
                                                        <p className="text-zinc-400 leading-relaxed">{rank.description}</p>
                                                        <div className="space-y-3">
                                                            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Celestial Perks</h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {rank.perks?.map((perk, idx) => (
                                                                    <div key={idx} className="flex items-center gap-3 text-sm text-zinc-300 bg-white/5 border border-white/5 rounded-xl px-4 py-3 hover:border-orange-500/20 hover:bg-white/[0.08] transition-all">
                                                                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] flex-shrink-0" />
                                                                        {perk}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                );
            case 'team':
                return (
                    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center space-y-4">
                            <h2 className="text-6xl font-black tracking-tight uppercase italic">The Overseers</h2>
                            <div className="h-1 w-24 bg-orange-600 mx-auto rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {team.length === 0 ? (
                                <p className="col-span-full text-center text-zinc-500 py-10">The council is currently hidden.</p>
                            ) : (
                                team.map((member) => (
                                    <div key={member.id} className="relative bg-white/5 border border-white/5 rounded-3xl p-8 flex flex-col items-center gap-6 group hover:bg-white/[0.08] transition-all">
                                        <div className="w-24 h-24 rounded-full border-4 border-orange-500/20 overflow-hidden group-hover:border-orange-500 transition-colors shadow-2xl">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.username} className="object-cover max-w-[96px] max-h-[96px]" />
                                            ) : (
                                                <div className="w-full h-full bg-orange-600/10 flex items-center justify-center text-orange-500 font-bold text-3xl">
                                                    {member.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center space-y-1">
                                            <h4 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">{member.username}</h4>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{member.role}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                );
            case 'privacy':
                return <Privacy />;
            case 'terms':
                return <Terms />;
            case 'admin':
                return (
                    <section className="space-y-8 animate-in fade-in duration-1000 max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 text-orange-500 border-b border-white/5 pb-4">
                            <SettingsIcon size={28} />
                            <h2 className="text-4xl font-black tracking-tight uppercase italic">Admin Control Center</h2>
                        </div>
                        {isAdminAuthenticated ? (
                            <AdminPanel
                                news={news}
                                setNews={setNews}
                                ranks={ranks}
                                setRanks={setRanks}
                                team={team}
                                setTeam={setTeam}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-20 bg-zinc-900/30 border border-zinc-800 rounded-3xl space-y-6">
                                <Lock className="text-orange-500" size={48} />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">System Locked</h3>
                                    <p className="text-zinc-500 text-sm max-w-sm">Please authenticate using the passcode challenged in the popup modal.</p>
                                </div>
                                <button
                                    onClick={() => setIsAdminAuthOpen(true)}
                                    className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl transition-all"
                                >
                                    Authenticate
                                </button>
                            </div>
                        )}
                    </section>
                );
}
    };

    if (!settings) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {/* Added comment for commit attempt 67 */}
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,30,1),rgba(5,5,5,1))]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-20 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_70%)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_70%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] opacity-[0.03] rotate-12">
                    <div className="absolute inset-0 border-[1px] border-orange-500 rounded-full blur-[100px]" />
                </div>
            </div>

            <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActivePage('home')}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                            <img
                                src={LOGO_URL}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1000&auto=format&fit=crop"}
                            />
                        </div>
                        <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 hidden sm:block uppercase italic">Interstellar</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => setActivePage(link.id as any)}
                                className={cn(
                                    "text-xs font-black uppercase tracking-[0.2em] transition-all",
                                    activePage === link.id ? "text-orange-500" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {link.name}
                            </button>
                        ))}
                        {currentUser?.isAdmin && (
                            <button
                                onClick={() => setActivePage('admin')}
                                className={cn(
                                    "text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-1.5",
                                    activePage === 'admin' ? "text-orange-500 animate-pulse" : "text-orange-400 hover:text-orange-300"
                                )}
                            >
                                <SettingsIcon size={12} /> Panel
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-medium text-white">{currentUser.username}</span>
                                    {currentUser.isAdmin && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Administrator</span>}
                                </div>
                                <button onClick={() => { setCurrentUser(null); setIsAdminAuthenticated(false); setActivePage('home'); }} className="p-2 text-zinc-400 hover:text-white transition-colors"><LogOut size={20} /></button>
                            </div>
                        ) : (
                            <button onClick={() => setIsRegisterOpen(true)} className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all">Connect</button>
                        )}
                        <button className="md:hidden p-2 text-zinc-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-30 pt-24 bg-black/95 backdrop-blur-2xl md:hidden px-6">
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <button key={link.id} onClick={() => { setActivePage(link.id as any); setIsMobileMenuOpen(false); }} className={cn("text-3xl font-black uppercase italic text-left", activePage === link.id ? "text-orange-500" : "text-white")}>
                                    {link.name}
                                </button>
                            ))}
                            {currentUser?.isAdmin && (
                                <button onClick={() => { setActivePage('admin'); setIsMobileMenuOpen(false); }} className={cn("text-3xl font-black uppercase italic text-left text-orange-500")}>
                                    Admin Panel
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32">
                <AnimatePresence mode="wait">
                    <motion.div key={activePage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md py-12 px-6 mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} className="w-8 h-8 rounded-lg" onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1000&auto=format&fit=crop"} />
                            <span className="font-black tracking-tighter text-white uppercase italic">INTERSTELLAR</span>
                        </div>
                        <p className="text-zinc-500 text-sm">© 2026 Interstellar Project. Not an official Minecraft product.</p>
                    </div>
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                        <button type="button" onClick={() => setActivePage('privacy')} className="text-zinc-400 hover:text-white transition-colors">Privacy</button>
                        <button type="button" onClick={() => setActivePage('terms')} className="text-zinc-400 hover:text-white transition-colors">Terms</button>
                        <a href={settings.discordLink} className="text-zinc-400 hover:text-white transition-colors">Support</a>
                    </div>
                </div>
            </footer>

            <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onRegister={setCurrentUser} />
            
            <AdminAuthModal 
                isOpen={isAdminAuthOpen} 
                onClose={() => { setIsAdminAuthOpen(false); setActivePage('home'); }} 
                onSuccess={() => { setIsAdminAuthOpen(false); setIsAdminAuthenticated(true); }} 
            />
        </div>
    );
}
