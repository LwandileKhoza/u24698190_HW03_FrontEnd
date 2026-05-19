import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/movie-api.service';
 
@Component({
  selector: 'app-watched',
  templateUrl: './watched.page.html',
  styleUrls: ['./watched.page.scss'],
  standalone: false
})
export class WatchedPage implements OnInit {
 
  watched: any[] = [];
  isLoading = false;
 
  constructor(
    private apiService: ApiService,
    private toastController: ToastController
  ) {}
 
  ngOnInit() {
    this.loadWatched();
  }
 
  ionViewWillEnter() {
    this.loadWatched();
  }
 
  loadWatched() {
    this.isLoading = true;
    this.apiService.getWatched().subscribe({
      next: (data) => {
        this.watched = data;
        this.isLoading = false;
      },
      error: () => {
        this.watched = [];
        this.isLoading = false;
      }
    });
  }
 
  removeFromWatched(id: number) {
    this.apiService.removeFromWatched(id).subscribe({
      next: () => {
        this.loadWatched();
        this.showToast('Removed from Watched List.');
      },
      error: () => this.showToast('Could not remove movie.', 'danger')
    });
  }
 
  resetTimesWatched(id: number) {
    this.apiService.resetTimesWatched(id).subscribe({
      next: () => {
        this.loadWatched();
        this.showToast('Counter reset. Movie moved back to Watchlist.');
      },
      error: () => this.showToast('Could not reset counter.', 'danger')
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
}