import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  searchTerm: string = '';
  properties: any[] = [];

  constructor(private router: Router) { }

  search() {
    const query = this.searchTerm.trim();
    this.router.navigate(['/properties'], 
      { state: { from: 'HomeComponent', location: query } });
  }
}
