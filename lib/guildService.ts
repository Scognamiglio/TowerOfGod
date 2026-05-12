import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to get the authorization header from localStorage
const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('farmcore_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
};

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const headers = getAuthHeader();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // Si la requête a réussi et ce n'est pas un GET
    if (response.config.method?.toLowerCase() !== 'get') {
      const messageKey = response.data?.message;
      if (messageKey && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app-flash-message', { detail: { key: messageKey, type: 'success' } }));
      }
    }
    return response;
  },
  (error) => {
    // Dans tous les cas d'erreur (y compris GET) on peut envoyer un message d'erreur
    const messageKey = error.response?.data?.message || 'flash.error';
    if (messageKey && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-flash-message', { detail: { key: messageKey, type: 'error' } }));
    }
    return Promise.reject(error);
  }
);

const GuildService = {
  getGuilds: (page = 1, limit = 5) => 
    apiClient.get(`guilds/`, { params: { page, limit } }),

  searchGuilds: (name: string, page = 1, limit = 5) => 
    apiClient.get(`guilds/search`, { params: { name, page, limit } }),

  joinGuild: (guildId: string) => 
    apiClient.post(`guilds/join/${guildId}`),

  createGuild: (name: string) =>
    apiClient.post(`guilds/create`, { name }),

  getGuildMembers: () =>
    apiClient.get(`guilds/members`),

  updateMemberRole: (targetId: string, role: string) =>
    apiClient.patch(`guilds/role`, { targetId, role }),

  transferLeadership: (newLeaderId: string) =>
    apiClient.patch(`guilds/transfer-lead`, { newLeaderId }),

  leaveGuild: () =>
    apiClient.delete(`guilds/leave`),

  getGuildRequests: () =>
    apiClient.get(`guilds/requests`),

  handleGuildRequest: (targetId: string, act: 'accepted' | 'refused') =>
    apiClient.post(`guilds/accept`, { targetId, act }),

  kickMember: (idUser: string) =>
    apiClient.delete(`guilds/kick/${idUser}`)
};

export default GuildService;