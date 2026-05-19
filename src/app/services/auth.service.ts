import { Injectable } from '@angular/core';
import { ApiService } from './movie-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'filmlog_token';
  private readonly EMAIL_KEY = 'filmlog_email';

  constructor(private apiService: ApiService) {}

  register(email: string, password: string) {
    return this.apiService.register({ email, password });
  }

  login(email: string, password: string) {
    return this.apiService.login({ email, password });
  }

  saveToken(token: string, email: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EMAIL_KEY, email);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }
}
