import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/services/movie-api.service';
 
Chart.register(...registerables);
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements AfterViewInit {
 
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  @ViewChild('barCanvas') barCanvas!: ElementRef;
 
  watched: any[] = [];
  tableData: any[] = [];
 
  private pieChart: Chart | null = null;
  private barChart: Chart | null = null;
 
  isLoading = false;
 
  constructor(private apiService: ApiService) {}
 
  ngAfterViewInit() {}
 
  ionViewDidEnter() {
    this.loadData();
  }
 
  loadData() {
    this.isLoading = true;
    this.apiService.getWatched().subscribe({
      next: (data) => {
        this.watched = data;
        this.tableData = [...data]
          .sort((a, b) => b.timesWatched - a.timesWatched)
          .slice(0, 10);
        this.isLoading = false;
        setTimeout(() => this.renderCharts(), 200);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
 
  processGenres(): { labels: string[]; counts: number[] } {
    const genreMap: { [key: string]: number } = {};
 
    this.watched.forEach(movie => {
      if (movie.genre) {
        const genres = movie.genre.split(',').map((g: string) => g.trim());
        genres.forEach((genre: string) => {
          genreMap[genre] = (genreMap[genre] || 0) + 1;
        });
      }
    });
 
    const sorted = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
 
    return {
      labels: sorted.map(([label]) => label),
      counts: sorted.map(([, count]) => count)
    };
  }
 
  processByYear(): { labels: string[]; counts: number[] } {
    const yearMap: { [key: string]: number } = {};
 
    this.watched.forEach(movie => {
      const year = movie.year || 'Unknown';
      yearMap[year] = (yearMap[year] || 0) + 1;
    });
 
    const sorted = Object.entries(yearMap)
      .sort((a, b) => a[0].localeCompare(b[0]));
 
    return {
      labels: sorted.map(([label]) => label),
      counts: sorted.map(([, count]) => count)
    };
  }
 
  renderCharts() {
    this.renderPieChart();
    this.renderBarChart();
  }
 
  renderPieChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
 
    const genreData = this.processGenres();
    if (!this.pieCanvas || genreData.labels.length === 0) return;
 
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: genreData.labels,
        datasets: [{
          data: genreData.counts,
          backgroundColor: [
            '#e50914', '#f5c518', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#fff', font: { size: 11 } }
          }
        }
      }
    });
  }
 
  renderBarChart() {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
 
    const yearData = this.processByYear();
    if (!this.barCanvas || yearData.labels.length === 0) return;
 
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: yearData.labels,
        datasets: [{
          label: 'Movies Watched',
          data: yearData.counts,
          backgroundColor: '#e50914'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#fff' } }
        },
        scales: {
          x: { ticks: { color: '#aaa' }, grid: { color: '#333' } },
          y: {
            ticks: { color: '#aaa', stepSize: 1 },
            grid: { color: '#333' },
            beginAtZero: true
          }
        }
      }
    });
  }
}