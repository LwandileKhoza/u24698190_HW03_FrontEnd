import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/movie-api.service';
 
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: false
})
export class MovieDetailsPage {
 
  movie: any;
 
  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastController: ToastController
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.movie = nav.extras.state['movie'];
    }
  }
 
  addToWatchlist() {
    if (!this.movie) return;
    const movieDto = this.buildMovieDto();
    this.apiService.addToWatchlist(movieDto).subscribe({
      next: () => this.showToast(`"${this.movie.Title || this.movie.title}" added to Watchlist!`),
      error: () => this.showToast('Could not add to watchlist.', 'danger')
    });
  }
 
  markAsWatched() {
    if (!this.movie) return;
    const movieDto = this.buildMovieDto();
    this.apiService.markAsWatched(movieDto).subscribe({
      next: () => {
        this.showToast(`"${this.movie.Title || this.movie.title}" marked as Watched!`);
        this.router.navigateByUrl('/tabs/watched');
      },
      error: () => this.showToast('Could not mark as watched.', 'danger')
    });
  }
 
  private buildMovieDto() {
    return {
      omdbId: this.movie.imdbID || this.movie.omdbId,
      title: this.movie.Title || this.movie.title,
      year: this.movie.Year || this.movie.year,
      poster: this.movie.Poster || this.movie.poster,
      actors: this.movie.Actors || this.movie.actors,
      genre: this.movie.Genre || this.movie.genre,
      imdbRating: this.movie.imdbRating
    };
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
 
  goBack() {
    this.router.navigateByUrl('/tabs/search');
  }
}