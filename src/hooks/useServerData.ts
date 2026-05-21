import { useState, useEffect, useRef } from 'react';
import { NewsItem, Rank, TeamMember, ServerSettings } from '../types';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/tstechnologyaidev/interstellar-projet-offiial/main/data';
const defaultNewsUrl = `${GITHUB_RAW_BASE}/is_news.json`;
const defaultRanksUrl = `${GITHUB_RAW_BASE}/is_ranks.json`;
const defaultTeamUrl = `${GITHUB_RAW_BASE}/is_team.json`;
const defaultSettingsUrl = `${GITHUB_RAW_BASE}/is_settings.json`;


export function useServerData() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [settings, setSettings] = useState<ServerSettings>({} as ServerSettings);

    const timeouts = useRef<Record<string, any>>({});

    useEffect(() => {
        const storedUser = localStorage.getItem('is_current_user');
        const isAdmin = storedUser ? JSON.parse(storedUser)?.role === 'admin' : false;

        const storedNews = localStorage.getItem('is_news');
        const storedRanks = localStorage.getItem('is_ranks');
        const storedTeam = localStorage.getItem('is_team');
        const storedSettings = localStorage.getItem('is_settings');

        if (!isAdmin) {
            // Public users: fetch data from GitHub so everyone sees the same announcements and ranks
            localStorage.removeItem('is_news');
            localStorage.removeItem('is_ranks');
            localStorage.removeItem('is_team');
            localStorage.removeItem('is_settings');

            // Helper to fetch JSON safely
            const fetchJson = async (url: string) => {
                try {
                    const resp = await fetch(url);
                    if (!resp.ok) throw new Error('Network error');
                    return (await resp.json()) as any;
                } catch (e) {
                    console.error('Failed to fetch', url, e);
                    return null;
                }
            };

            Promise.all([
                fetchJson(defaultNewsUrl),
                fetchJson(defaultRanksUrl),
                fetchJson(defaultTeamUrl),
                fetchJson(defaultSettingsUrl),
            ]).then(([newsData, ranksData, teamData, settingsData]) => {
                setNews((newsData ?? []) as NewsItem[]);
                setRanks((ranksData ?? []) as Rank[]);
                setTeam((teamData ?? []) as TeamMember[]);
                setSettings((settingsData ?? defaultSettings) as ServerSettings);
            });
        } else {
                // For administrators: load from localStorage to preserve all of their existing modifications
                const loadAdminData = async () => {
                    let initialNews = (await (await fetch(defaultNewsUrl)).json()) as NewsItem[];
                    let initialRanks = (await (await fetch(defaultRanksUrl)).json()) as Rank[];
                    let initialTeam = (await (await fetch(defaultTeamUrl)).json()) as TeamMember[];
                    let initialSettings = (await (await fetch(defaultSettingsUrl)).json()) as ServerSettings;

                    if (storedNews) {
                        initialNews = JSON.parse(storedNews);
                        setNews(initialNews);
                    } else {
                        setNews(initialNews);
                        localStorage.setItem('is_news', JSON.stringify(initialNews));
                    }

                    if (storedRanks) {
                        initialRanks = JSON.parse(storedRanks);
                        setRanks(initialRanks);
                    } else {
                        setRanks(initialRanks);
                        localStorage.setItem('is_ranks', JSON.stringify(initialRanks));
                    }

                    if (storedTeam) {
                        initialTeam = JSON.parse(storedTeam);
                        setTeam(initialTeam);
                    } else {
                        setTeam(initialTeam);
                        localStorage.setItem('is_team', JSON.stringify(initialTeam));
                    }

                    if (storedSettings) {
                        initialSettings = JSON.parse(storedSettings);
                        setSettings(initialSettings);
                    } else {
                        setSettings(initialSettings);
                        localStorage.setItem('is_settings', JSON.stringify(initialSettings));
                    }

                    // Sync active admin localStorage changes to the server once on mount
                    const syncToDisk = (key: string, data: any) => {
                        fetch('/api/save', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key, data })
                        }).catch(() => {});
                    };
                    syncToDisk('is_news', initialNews);
                    syncToDisk('is_ranks', initialRanks);
                    syncToDisk('is_team', initialTeam);
                    syncToDisk('is_settings', initialSettings);
                };
                loadAdminData();
            }
    }, []);

    // Sync state between open tabs in the same browser in real-time
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    if (e.key === 'is_news') setNews(parsed);
                    if (e.key === 'is_ranks') setRanks(parsed);
                    if (e.key === 'is_team') setTeam(parsed);
                    if (e.key === 'is_settings') setSettings(parsed);
                } catch (err) {
                    console.error('Error parsing storage event:', err);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            // Clear any pending debounced save timeouts on unmount
            Object.values(timeouts.current).forEach(clearTimeout);
        };
   }, []);

    const saveData = (key: string, data: any, setter: Function) => {
        // 1. Instantly save to local React state and localStorage for premium, lag-free UI responsiveness
        localStorage.setItem(key, JSON.stringify(data));
        setter(data);

        // 2. Clear previous write timer for this key (debouncing the keystroke)
        if (timeouts.current[key]) {
            clearTimeout(timeouts.current[key]);
        }

        // 3. Debounce filesystem save operation by 1 second to prevent server writes/HMR while the admin is actively typing
        timeouts.current[key] = setTimeout(() => {
            fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key, data }),
            }).catch(err => {
                console.log('FSDatabaseSync: Running in production/static environment.', err);
            });
        }, 1000);
    };

    return {
        news,
        setNews: (data: NewsItem[]) => saveData('is_news', data, setNews),
        ranks,
        setRanks: (data: Rank[]) => saveData('is_ranks', data, setRanks),
        team,
        setTeam: (data: TeamMember[]) => saveData('is_team', data, setTeam),
        settings,
        setSettings: (data: ServerSettings) => saveData('is_settings', data, setSettings),
    };
}

