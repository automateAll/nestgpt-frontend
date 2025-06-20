import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PropertyService } from '../../services/property.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-property-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss'
})


export class PropertyListComponent {
  properties: any[] = [];
  private map: L.Map | undefined;

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
  private router: Router) { }

  ngOnInit(): void {
    this.initMap();
    // Read location from query params
    this.route.queryParams.subscribe(params => {
      const location = params['location'];
      if (location) {
        this.searchText = location;
        this.loadAllProperties();
      } else {
        alert("No location provided");
      }
    });
  }

  initMap(): void {
    this.map = L.map('map').setView([37.7749, -122.4194], 5); // Centered on US
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  searchText: string = '';
  loadAllProperties(): void {
    const searchTerm = { location: this.searchText };
    console.log("SearchText = ", searchTerm)
    if (!this.searchText || !this.searchText.trim()) {
      alert("Location is required");
      return;
    }
    this.propertyService.getProperties(searchTerm).subscribe((data) => {
      this.properties = data;
      console.log(data);
      if (this.map) {
        const customIcon = L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png'
        });
        this.properties.forEach((property: any) => {
          if (property.latitude && property.longitude) {
            L.marker([property.latitude, property.longitude], { icon: customIcon })
              .addTo(this.map!)
              .bindPopup(`<b>${property.address}</b><br>Price: $${property.price}`);
          }
        });
      }
    });
  }
}