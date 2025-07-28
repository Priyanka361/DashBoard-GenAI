import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PMR_dasbord';
  username: string | null = '';
  constructor(
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.username = this.auth.getUsername();
  //   if (this.auth.isAuthenticated()) {
  //   this.username = this.auth.getUsername();
  // } else {
  //   this.username = null; // OR: 'Guest' or ''
  //   // Don't store demo user in localStorage unless required
  // }
  this.username = this.auth.getUsername();

    // Watch route changes to update username after login/logout
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.username = this.auth.getUsername();
      }
    });
  }
   goHome(): void {
    this.router.navigate(['/dashboard']);
  }
  
  get isLoggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  updateUsername(): void {
    this.username = this.auth.getUsername();
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngDoCheck(): void {
  this.username = this.auth.getUsername();
}
}
