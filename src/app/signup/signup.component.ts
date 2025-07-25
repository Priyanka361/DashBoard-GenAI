// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onRegister(): void {
    this.message = `Registered successfully as: ${this.name} (${this.email})`;
    
      setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}
