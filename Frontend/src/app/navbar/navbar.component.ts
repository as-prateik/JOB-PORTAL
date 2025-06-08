import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',

  templateUrl: './navbar.component.html',

  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() userName: string = 'User'; // Default value if not provided

  constructor(private router: Router) {}

  // employeeName: string = localStorage.getItem('username') || 'Employee';

  logout() {
    this.router.navigate(['/login']);
  }

  onTouch() {
    this.router.navigate(['/edit-profile']);
  }
}
