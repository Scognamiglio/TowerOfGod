'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GuildService from '@/lib/guildService';
import { useLanguage } from '@/context/LanguageContext';

export default function GuildPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'home' | 'members'>('home');
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('farmcore_user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        if (!parsed.guildName) {
          router.push('/');
        }
      } catch {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  if (!user || !user.guildName) return <div className="min-h-screen bg-black" />;

  const canSeeRequests = user.guildRank === 'admin' || user.guildRank === 'leader';

  const fetchMembers = async () => {
    setLoadingMembers(true);
    setView('members');
    try {
      const res = await GuildService.getGuildMembers();
      setMembers(res.data.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleRoleChange = async (memberId: string, memberPseudo: string, newRole: string) => {
    try {
      if (newRole === 'leader') {
        const confirmMsg = t('guild_page.confirm_transfer_lead').replace('{{pseudo}}', memberPseudo);
        if (window.confirm(confirmMsg)) {
          await GuildService.transferLeadership(memberId);
          // Mettre à jour le localStorage pour refléter la perte du rôle
          const userData = JSON.parse(localStorage.getItem('farmcore_user') || '{}');
          userData.guildRank = 'member';
          localStorage.setItem('farmcore_user', JSON.stringify(userData));
          window.location.reload();
        } else {
          // Si l'utilisateur annule, on rafraîchit simplement pour réinitialiser le select
          fetchMembers();
        }
      } else {
        await GuildService.updateMemberRole(memberId, newRole);
        fetchMembers(); // Rafraîchir pour voir le nouveau rôle
      }
    } catch (err) {
      console.error(err);
      alert(t('guild_page.role_change_error'));
      fetchMembers(); // Réinitialiser le select en cas d'erreur
    }
  };

  const handleLeaveGuild = async () => {
    if (window.confirm(t('guild_page.confirm_leave'))) {
      try {
        await GuildService.leaveGuild();
        const userData = JSON.parse(localStorage.getItem('farmcore_user') || '{}');
        delete userData.guildName;
        delete userData.guildRank;
        localStorage.setItem('farmcore_user', JSON.stringify(userData));
        router.push('/');
      } catch (err) {
        console.error(err);
        alert(t('guild_page.leave_error'));
      }
    }
  };

  const openRequests = async () => {
    setRequestsModalOpen(true);
    setLoadingRequests(true);
    try {
      const res = await GuildService.getGuildRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const processRequest = async (targetId: string, act: 'accepted' | 'refused') => {
    try {
      await GuildService.handleGuildRequest(targetId, act);
      setRequests(requests.filter(r => r._id !== targetId));
    } catch (err) {
      console.error(err);
      alert(t('guild_page.request_process_error'));
    }
  };

  const handleKickMember = async (memberId: string, memberPseudo: string) => {
    const confirmMsg = t('guild_page.confirm_kick').replace('{{pseudo}}', memberPseudo);
    if (window.confirm(confirmMsg)) {
      try {
        await GuildService.kickMember(memberId);
        fetchMembers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getRankBadge = (rank: string) => {
    switch(rank) {
      case 'leader': return <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">{t('guild_page.rank_leader')}</span>;
      case 'admin': return <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{t('guild_page.rank_admin')}</span>;
      default: return <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md bg-slate-800 text-slate-400 border border-slate-700">{t('guild_page.rank_member')}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <header className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-4xl font-black italic tracking-tighter">
              FARM<span className="text-indigo-500">CORE</span>
            </h1>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => {
                if (view !== 'home') setView('home');
                else router.push('/');
              }} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-400 transition-all group"
            >
              <span className="flex items-center justify-center w-6 h-6 border border-slate-800 rounded group-hover:border-indigo-500/50">←</span>
              {t('guild_page.back')}
            </button>
          </div>
        </header>

        <main>
          <div className="mb-12 flex items-center justify-between border-b border-slate-800 pb-8">
            <div>
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">{user.guildName}</h2>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{user.guildRank}</p>
            </div>
            
            {user.guildRank !== 'leader' && view === 'home' && (
              <button 
                onClick={handleLeaveGuild}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500/80 border border-red-900/50 rounded-xl bg-red-950/20 hover:bg-red-900/40 hover:text-red-400 hover:border-red-500/50 transition-all"
              >
                {t('guild_page.leave_guild')}
              </button>
            )}
          </div>

          {view === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl animate-in fade-in zoom-in-95 duration-300">
              <button 
                onClick={fetchMembers}
                className="group relative bg-slate-900 border border-slate-800 p-8 rounded-3xl transition-all hover:border-emerald-500/50 hover:bg-slate-900/50 text-left"
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400">
                  {t('guild_page.view_players')}
                </h3>
                <p className="text-sm text-slate-500">{t('guild_page.view_players_desc')}</p>
              </button>

              {canSeeRequests && (
                <button 
                  onClick={openRequests}
                  className="group relative bg-slate-900 border border-slate-800 p-8 rounded-3xl transition-all hover:border-amber-500/50 hover:bg-slate-900/50 text-left"
                >
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400">
                    {t('guild_page.view_requests')}
                  </h3>
                  <p className="text-sm text-slate-500">{t('guild_page.view_requests_desc')}</p>
                </button>
              )}
            </div>
          )}

          {view === 'members' && (
            <div className="space-y-4 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-xl font-bold text-white mb-6">{t('guild_page.members_title')}</h3>
              
              {loadingMembers ? (
                <div className="p-8 text-center text-slate-500 animate-pulse border border-slate-800 rounded-3xl bg-slate-900/30">
                  {t('guild_page.loading_members')}
                </div>
              ) : members.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-3xl bg-slate-900/30">
                  {t('guild_page.no_members')}
                </div>
              ) : (
                <div className="grid gap-3">
                  {members.map(member => (
                    <div key={member._id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 overflow-hidden gap-4">
                      
                      {/* Effet lumineux au hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-500/5 to-transparent transition-opacity duration-300 pointer-events-none" />

                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-inner shrink-0">
                          <span className="text-lg font-black text-white/80">{member.pseudo.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg tracking-tight leading-none mb-1.5">{member.pseudo}</p>
                          <div className="flex items-center gap-2">
                            {getRankBadge(member.guildRank)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 relative z-10">
                        {user.guildRank === 'leader' && member.guildRank !== 'leader' && (
                          <select 
                            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs uppercase tracking-wider rounded-lg pl-3 pr-8 py-2 outline-none focus:border-indigo-500 hover:border-slate-600 transition-colors appearance-none cursor-pointer"
                            defaultValue={member.guildRank}
                            onChange={(e) => {
                              handleRoleChange(member._id, member.pseudo, e.target.value);
                            }}
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
                          >
                            <option value="member">{t('guild_page.rank_member')}</option>
                            <option value="admin">{t('guild_page.rank_admin')}</option>
                            <option value="leader">{t('guild_page.rank_leader')}</option>
                          </select>
                        )}
                        
                        {user.guildRank === 'leader' && member._id !== user.id && (
                          <button 
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border hover:border-red-500/30 transition-all group/btn shrink-0"
                            title={t('guild_page.kick_member')}
                            onClick={() => {
                              handleKickMember(member._id, member.pseudo);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {requestsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="text-xl font-bold text-white">{t('guild_page.pending_requests')}</h3>
                  <button 
                    onClick={() => setRequestsModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  {loadingRequests ? (
                    <div className="text-center py-8 text-slate-500 animate-pulse">{t('guild_page.loading')}</div>
                  ) : requests.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">{t('guild_page.no_requests')}</div>
                  ) : (
                    <div className="space-y-3">
                      {requests.map(req => (
                        <div key={req._id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                          <p className="font-bold text-white">{req.pseudo}</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => processRequest(req._id, 'refused')}
                              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              {t('guild_page.refuse')}
                            </button>
                            <button 
                              onClick={() => processRequest(req._id, 'accepted')}
                              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                            >
                              {t('guild_page.accept')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
