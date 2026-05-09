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

const GuildService = {
  getGuilds: (page = 1, limit = 5) => 
    axios.get(`${API_URL}guilds/`, { params: { page, limit }, headers: getAuthHeader() }),

  searchGuilds: (name: string, page = 1, limit = 5) => 
    axios.get(`${API_URL}guilds/search`, { params: { name, page, limit }, headers: getAuthHeader() }),

  joinGuild: (guildId: string) => 
    // For POST requests, the data/body comes before the config object
    axios.post(`${API_URL}guilds/join/${guildId}`, {}, { headers: getAuthHeader() }),

  createGuild: (name: string) =>
    axios.post(`${API_URL}guilds/create`, { name }, { headers: getAuthHeader() })
};

export default GuildService;