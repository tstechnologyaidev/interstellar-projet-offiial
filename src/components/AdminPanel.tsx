
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Globe, Info, Users, Shield, Link as LinkIcon, Server, X } from 'lucide-react';
import { NewsItem, Rank, TeamMember, ServerSettings } from '../types';

interface AdminPanelProps {
    news: NewsItem[];
    setNews: (news: NewsItem[]) => void;
    ranks: Rank[];
    setRanks: (ranks: Rank[]) => void;
    team: TeamMember[];
    setTeam: (team: TeamMember[]) => void;
    settings: ServerSettings;
    setSettings: (settings: ServerSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
    news, setNews, ranks, setRanks, team, setTeam, settings, setSettings
}) => {
    const [activeTab, setActiveTab] = useState<'settings' | 'news' | 'ranks' | 'team'>('settings');

    // News management
    const addNews = () => {
        const newItem: NewsItem = {
            id: Date.now().toString(),
            title: 'New Announcement',
            content: 'Announcement content goes here...',
            date: new Date().toLocaleDateString()
        };
        setNews([newItem, ...news]);
    };

    const deleteNews = (id: string) => {
        setNews(news.filter(n => n.id !== id));
    };

    const updateNews = (id: string, updates: Partial<NewsItem>) => {
        setNews(news.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    // Rank management
    const addRank = () => {
        const newRank: Rank = {
            id: Date.now().toString(),
            name: 'New Rank',
            description: 'Rank description...',
            icon: '',
            perks: []
        };
        setRanks([...ranks, newRank]);
    };

    const updateRank = (id: string, updates: Partial<Rank>) => {
        setRanks(ranks.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const addPerk = (rankId: string) => {
        const rank = ranks.find(r => r.id === rankId);
        if (rank) {
            updateRank(rankId, { perks: [...rank.perks, 'New Perk'] });
        }
    };

    const updatePerk = (rankId: string, index: number, value: string) => {
        const rank = ranks.find(r => r.id === rankId);
        if (rank) {
            const newPerks = [...rank.perks];
            newPerks[index] = value;
            updateRank(rankId, { perks: newPerks });
        }
    };

    const deletePerk = (rankId: string, index: number) => {
        const rank = ranks.find(r => r.id === rankId);
        if (rank) {
            const newPerks = rank.perks.filter((_: string, i: number) => i !== index);
            updateRank(rankId, { perks: newPerks });
        }
    };

    const handleRankIconUpload = (id: string, file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateRank(id, { icon: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const deleteRank = (id: string) => {
        setRanks(ranks.filter(r => r.id !== id));
    };

    // Team management
    const addMember = () => {
        const newMember: TeamMember = {
            id: Date.now().toString(),
            username: 'MinecraftName',
            role: 'Staff',
            avatar: ''
        };
        setTeam([...team, newMember]);
    };

    const updateMember = (id: string, updates: Partial<TeamMember>) => {
        setTeam(team.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const handleAvatarUpload = (id: string, file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateMember(id, { avatar: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const deleteMember = (id: string) => {
        setTeam(team.filter(t => t.id !== id));
    };

    const tabStyle = (tab: string) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
    ${activeTab === tab
            ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
  `;

    return (
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800 pb-4">
                <button onClick={() => setActiveTab('settings')} className={tabStyle('settings')}>
                    <Globe size={18} /> Settings
                </button>
                <button onClick={() => setActiveTab('news')} className={tabStyle('news')}>
                    <Info size={18} /> News
                </button>
                <button onClick={() => setActiveTab('ranks')} className={tabStyle('ranks')}>
                    <Shield size={18} /> Ranks
                </button>
                <button onClick={() => setActiveTab('team')} className={tabStyle('team')}>
                    <Users size={18} /> Team
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'settings' && (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <Server size={14} /> Server IP
                                </label>
                                <input
                                    type="text"
                                    value={settings.serverIp}
                                    onChange={(e) => setSettings({ ...settings, serverIp: e.target.value })}
                                    className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                    <LinkIcon size={14} /> Discord Invite Link
                                </label>
                                <input
                                    type="text"
                                    value={settings.discordLink}
                                    onChange={(e) => setSettings({ ...settings, discordLink: e.target.value })}
                                    className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'news' && (
                    <motion.div
                        key="news"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <button onClick={addNews} className="flex items-center gap-2 bg-orange-600/20 text-orange-400 px-4 py-2 rounded-lg hover:bg-orange-600/30 transition-colors">
                            <Plus size={18} /> Add News
                        </button>
                        {news.map(item => (
                            <div key={item.id} className="bg-black/30 border border-zinc-800 p-4 rounded-xl space-y-4">
                                <div className="flex justify-between gap-4">
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNews(item.id, { title: e.target.value })}
                                        className="flex-1 bg-transparent text-xl font-bold text-white focus:outline-none"
                                    />
                                    <button onClick={() => deleteNews(item.id)} className="text-red-500 hover:text-red-400">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <textarea
                                    value={item.content}
                                    onChange={(e) => updateNews(item.id, { content: e.target.value })}
                                    className="w-full bg-transparent text-zinc-400 focus:outline-none min-h-[100px] resize-none"
                                />
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'ranks' && (
                    <motion.div
                        key="ranks"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <button onClick={addRank} className="flex items-center gap-2 bg-orange-600/20 text-orange-400 px-4 py-2 rounded-lg hover:bg-orange-600/30 transition-colors">
                            <Plus size={18} /> Add Rank
                        </button>
                        <div className="grid grid-cols-1 gap-4">
                            {ranks.map(rank => (
                                <div key={rank.id} className="bg-black/30 border border-zinc-800 p-6 rounded-xl space-y-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-24 h-24 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700 p-2">
                                                {rank.icon ? (
                                                    <img src={rank.icon} alt={rank.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <Shield size={32} className="text-zinc-600" />
                                                )}
                                            </div>
                                            <label className="cursor-pointer text-xs text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider">
                                                Upload Icon
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleRankIconUpload(rank.id, e.target.files?.[0] || null)}
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between">
                                                <input
                                                    type="text"
                                                    value={rank.name}
                                                    onChange={(e) => updateRank(rank.id, { name: e.target.value })}
                                                    className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full"
                                                    placeholder="Rank Name"
                                                />
                                                <button onClick={() => deleteRank(rank.id)} className="text-red-500 hover:text-red-400 ml-4">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <textarea
                                                value={rank.description}
                                                onChange={(e) => updateRank(rank.id, { description: e.target.value })}
                                                className="w-full bg-black/20 border border-zinc-800 rounded-lg p-3 text-zinc-400 text-sm focus:outline-none resize-none"
                                                placeholder="General description of the rank..."
                                                rows={3}
                                            />

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Perks & Commands</h4>
                                                    <button
                                                        onClick={() => addPerk(rank.id)}
                                                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 rounded transition-colors"
                                                    >
                                                        + Add Perk
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {rank.perks.map((perk: string, idx: number) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={perk}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePerk(rank.id, idx, e.target.value)}
                                                                className="flex-1 bg-black/40 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-300 focus:border-orange-500 outline-none"
                                                                placeholder="e.g. /fly command"
                                                            />
                                                            <button onClick={() => deletePerk(rank.id, idx)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'team' && (
                    <motion.div
                        key="team"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <button onClick={addMember} className="flex items-center gap-2 bg-orange-600/20 text-orange-400 px-4 py-2 rounded-lg hover:bg-orange-600/30 transition-colors">
                            <Plus size={18} /> Add Member
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {team.map(member => (
                                <div key={member.id} className="bg-black/30 border border-zinc-800 p-4 rounded-xl flex gap-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="text-zinc-600" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer text-[10px] text-orange-400 hover:text-orange-300 font-bold uppercase">
                                            Avatar
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleAvatarUpload(member.id, e.target.files?.[0] || null)}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2 flex-1">
                                                <input
                                                    type="text"
                                                    value={member.username}
                                                    onChange={(e) => updateMember(member.id, { username: e.target.value })}
                                                    placeholder="Username"
                                                    className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={member.role}
                                                    onChange={(e) => updateMember(member.id, { role: e.target.value })}
                                                    placeholder="Role (e.g. Developer)"
                                                    className="w-full bg-transparent text-orange-500 text-sm focus:outline-none font-medium"
                                                />
                                            </div>
                                            <button onClick={() => deleteMember(member.id)} className="text-red-500 hover:text-red-400 ml-2">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


