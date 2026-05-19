import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
  private baseUrl = 'https://localhost:7049/api';
 
  constructor(private http: HttpClient) {}
 
  register(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, credentials);
  }
 
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
 
  searchMovies(title: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/movies/search?t=${encodeURIComponent(title)}`);
  }
 
  getWatchlist(): Observable<any> {
    return this.http.get(`${this.baseUrl}/watchlist`);
  }
 
  addToWatchlist(movie: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/watchlist`, movie);
  }
 
  removeFromWatchlist(omdbId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/watchlist/${encodeURIComponent(omdbId)}`);
  }
 
  getWatched(): Observable<any> {
    return this.http.get(`${this.baseUrl}/watched`);
  }
 
  markAsWatched(movie: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/watched`, movie);
  }
 
  updateTimesWatched(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/watched/${id}`, {});
  }
 
  removeFromWatched(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/watched/${id}`);
  }
 
  resetTimesWatched(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/watched/reset/${id}`, {});
  }
}