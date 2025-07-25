import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PMR_dasbord';
    username: string | null = '';
      constructor(
        private auth: AuthService,
        private router: Router,
      ) {}
      
 ngOnInit(): void {
  this.username = this.auth.getUsername();
 }
    logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
