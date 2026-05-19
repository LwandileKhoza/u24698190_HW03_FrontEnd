import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  credentials = {
    email: '',
    password: ''
  };

  isSignupMode = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token, response.email);
          this.router.navigateByUrl('/tabs/search');
        },
        error: () => {
          this.errorMessage = 'Incorrect email or password.';
          this.isLoading = false;
        }
      });
  }

  signup() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.credentials.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token, response.email);
          this.router.navigateByUrl('/tabs/search');
        },
        error: () => {
          this.errorMessage = 'Email already registered or invalid input.';
          this.isLoading = false;
        }
      });
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.errorMessage = '';
  }
}
