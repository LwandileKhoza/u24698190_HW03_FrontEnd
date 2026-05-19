import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/movie-api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements OnInit {

  userEmail: string | null = '';
  watchlistCount: number = 0;
  watchedCount: number = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    this.userEmail = this.authService.getCurrentUserEmail();

    this.apiService.getWatchlist().subscribe({
      next: (data) => this.watchlistCount = data.length,
      error: () => this.watchlistCount = 0
    });

    this.apiService.getWatched().subscribe({
      next: (data) => this.watchedCount = data.length,
      error: () => this.watchedCount = 0
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}