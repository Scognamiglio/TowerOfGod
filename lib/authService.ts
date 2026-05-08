import axios, { type AxiosInstance } from 'axios';

export interface AuthResponse {
  message: string;
  access_token: string;
  user: {
    id: string;
    pseudo: string;
    role: string;
    guildName: string;
    guildRank: string;
  };
}

export class AuthService {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL ?? '') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  login(login: string, password: string) {
    return this.client.post<AuthResponse>('/auth/login', { login, password });
  }

  register(pseudo: string, login: string, password: string) {
    return this.client.post<AuthResponse>('/auth/register', { pseudo, login, password });
  }
}

export default new AuthService();
