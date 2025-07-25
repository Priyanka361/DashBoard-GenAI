import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jsonUrl = 'assets/auth.json';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string; name: string }> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          // Save only token and name (no password)
          localStorage.setItem('token', user.token);
          localStorage.setItem('username', user.name);
          return { token: user.token, name: user.name };
        } else {
          throw new Error('Invalid email or password');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

 isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // ✅ localStorage instead of sessionStorage
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
