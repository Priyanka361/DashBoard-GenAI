import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  email = '';
  password = '';
  success = '';
  error = '';


  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.success = '';
    this.error = '';

   this.auth.login(this.email, this.password).subscribe({
      next: (token) => {
        this.success = `Login successful! Token: ${token}`;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Login failed';
      }
    });
  }
}
