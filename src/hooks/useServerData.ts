import { useState, useEffect } from 'react';
import { NewsItem, Rank, TeamMember, ServerSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

export function useServerData() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<ServerSettings>(null as any);

  // Load initial data from Supabase
  const loadInitialData = async () => {
    const [{ data: newsData }, { data: ranksData }, { data: teamData }, { data: settingsData }] = await Promise.all([
      supabase.from('news').select('*'),
      supabase.from('ranks').select('*'),
      supabase.from('team').select('*'),
      supabase.from('settings').select('*').single()
    ]);
    setNews(newsData as NewsItem[]);
    setRanks(ranksData as Rank[]);
    setTeam(teamData as TeamMember[]);
    setSettings(settingsData as ServerSettings);
  };

  useEffect(() => {
    loadInitialData();
    // Real‑time subscriptions
    const newsChannel = supabase.channel('public:news')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
        supabase.from('news').select('*').then(res => setNews(res.data as NewsItem[]));
      })
      .subscribe();
    const ranksChannel = supabase.channel('public:ranks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ranks' }, () => {
        supabase.from('ranks').select('*').then(res => setRanks(res.data as Rank[]));
      })
      .subscribe();
    const teamChannel = supabase.channel('public:team')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, () => {
        supabase.from('team').select('*').then(res => setTeam(res.data as TeamMember[]));
      })
      .subscribe();
    const settingsChannel = supabase.channel('public:settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        supabase.from('settings').select('*').single().then(res => setSettings(res.data as ServerSettings));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(newsChannel);
      supabase.removeChannel(ranksChannel);
      supabase.removeChannel(teamChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  // Save functions – write through Supabase and update local state
  const saveData = async (table: string, data: any, setter: Function) => {
    if (Array.isArray(data)) {
      // Replace all rows: delete then insert
      await supabase.from(table).delete().neq('id', '');
      const { error } = await supabase.from(table).insert(data as any);
      if (error) console.error('Supabase upsert error', error);
    } else {
      const { error } = await supabase.from(table).upsert(data as any);
      if (error) console.error('Supabase upsert error', error);
    }
    setter(data);
  };

  return {
    news,
    setNews: (data: NewsItem[]) => saveData('news', data, setNews),
    ranks,
    setRanks: (data: Rank[]) => saveData('ranks', data, setRanks),
    team,
    setTeam: (data: TeamMember[]) => saveData('team', data, setTeam),
    settings,
    setSettings: (data: ServerSettings) => saveData('settings', data, setSettings),
  };
}



