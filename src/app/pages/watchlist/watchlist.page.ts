import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/movie-api.service';
 
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: false
})
export class WatchlistPage implements OnInit {
 
  watchlist: any[] = [];
  isLoading = false;
 
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastController: ToastController
  ) {}
 
  ngOnInit() {
    this.loadWatchlist();
  }
 
  ionViewWillEnter() {
    this.loadWatchlist();
  }
 
  loadWatchlist() {
    this.isLoading = true;
    this.apiService.getWatchlist().subscribe({
      next: (data) => {
        this.watchlist = data;
        this.isLoading = false;
      },
      error: () => {
        this.watchlist = [];
        this.isLoading = false;
      }
    });
  }
 
  removeFromWatchlist(omdbId: string) {
    this.apiService.removeFromWatchlist(omdbId).subscribe({
      next: () => {
        this.loadWatchlist();
        this.showToast('Removed from Watchlist.');
      },
      error: () => this.showToast('Could not remove movie.', 'danger')
    });
  }
 
  markAsWatched(movie: any) {
    const movieDto = {
      omdbId: movie.omdbId,
      title: movie.title,
      year: movie.year,
      poster: movie.poster,
      actors: movie.actors,
      genre: movie.genre,
      imdbRating: movie.imdbRating
    };
 
    this.apiService.markAsWatched(movieDto).subscribe({
      next: () => {
        this.loadWatchlist();
        this.showToast(`"${movie.title}" moved to Watched List!`);
      },
      error: () => this.showToast('Could not mark as watched.', 'danger')
    });
  }
 
  viewDetails(movie: any) {
    const movieForDetails = {
      omdbId: movie.omdbId,
      title: movie.title,
      year: movie.year,
      poster: movie.poster,
      actors: movie.actors,
      genre: movie.genre,
      imdbRating: movie.imdbRating
    };
    this.router.navigate(['/movie-details'], { state: { movie: movieForDetails } });
  }
 
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}