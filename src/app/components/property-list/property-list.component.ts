import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PropertyService } from '../../services/property.service';
import { icon } from 'leaflet';

@Component({
  standalone: true,
  selector: 'app-property-list',
  imports: [CommonModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss'
})


export class PropertyListComponent {
  properties: any[] = [];
  private map: L.Map | undefined;

  constructor(
     private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.initMap();
    this.loadAllProperties(); // Optional: fetch all on load
  }


  initMap(): void {
    this.map = L.map('map').setView([37.7749, -122.4194], 5); // Centered on US
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  loadAllProperties(): void {
    this.propertyService.getProperties().subscribe((data) => {
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
            L.marker([property.latitude, property.longitude],{ icon: customIcon })
              .addTo(this.map!)
              .bindPopup(`<b>${property.address}</b><br>Price: $${property.price}`);
          }
        });
      }
    });
  }
}