import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/movie-api.service';
 
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage {
 
  query = '';
  movie: any = null;
  errorMessage = '';
  isLoading = false;
  isAddedToWatchlist = false;
 
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastController: ToastController
  ) {}
 
  searchMovies() {
    if (!this.query) return;
 
    this.isLoading = true;
    this.errorMessage = '';
    this.movie = null;
    this.isAddedToWatchlist = false;
 
    this.apiService.searchMovies(this.query).subscribe({
      next: (data) => {
        if (data && data.Response === 'True') {
          this.movie = data;
        } else {
          this.errorMessage = 'Movie not found. Try a different title.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not reach server. Is the backend running?';
        this.isLoading = false;
      }
    });
  }
 
  viewDetails() {
    if (!this.movie) return;
    this.router.navigate(['/movie-details'], { state: { movie: this.movie } });
  }
 
  addToWatchlist() {
    if (!this.movie || this.isAddedToWatchlist) return;
 
    const movieDto = this.buildMovieDto(this.movie);
    this.apiService.addToWatchlist(movieDto).subscribe({
      next: () => {
        this.isAddedToWatchlist = true;
        this.showToast(`"${this.movie.Title}" added to Watchlist!`);
      },
      error: () => this.showToast('Could not add to watchlist. Already added or not logged in.', 'danger')
    });
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
 
  private buildMovieDto(movie: any) {
    return {
      omdbId: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster !== 'N/A' ? movie.Poster : '',
      actors: movie.Actors,
      genre: movie.Genre,
      imdbRating: movie.imdbRating
    };
  }
}