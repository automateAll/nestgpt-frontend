import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PropertyService } from '../../services/property.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { PropertyStateService } from '../../services/property-state.service';
import { Property } from '../../models/property.model';

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
    private router: Router,
    private propertyState: PropertyStateService) { }

  ngOnInit(): void {
    this.initMap();

    // Read location from query params
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state || history.state;

    //indicates the Component from which the request is originating
    const origin = state?.from;
    if (origin === 'HomeComponent') {
      const location = state?.['location'];
      if (location) {
        this.searchText = location;
        this.loadAllProperties();
      } else {
        alert("No location provided");
      }
    }
    else if (origin === 'PropertyDetailComponent') {
      this.loadExistingListOfProperties();
    }
    else {
      console.warn("Unknown navigation origin. Attempting to load from cache...");
      const cached = this.propertyState.getProperties();
      if (cached?.length) {
        this.properties = cached;
      } else {
        this.router.navigate(['/']); // or redirect to HomeComponent
      }
    }
  }

  initMap(): void {
    this.map = L.map('map').setView([39.8283, -98.5795], 4); // Centered on US
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

      // this.setMapView(this.map)

      this.propertyState.setProperties(data)
      // console.log(data);
      if (this.map) {
        const bounds = L.latLngBounds([]);
        let hasValidMarkers = false;

        const customIcon = L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png'
        });
        this.properties.forEach((property: Property) => {
          const latLng = L.latLng(property.latitude, property.longitude);
          if (property.latitude && property.longitude) {
            L.marker(latLng, { icon: customIcon })
              .addTo(this.map!)
              .bindPopup(`<b>${property.address}</b><br>Price: $${property.price}`);
              bounds.extend(latLng);
              hasValidMarkers=true;
          }
        });
        // Fit the map to all markers
        if(hasValidMarkers){
          this.map.fitBounds(bounds, { padding: [20, 20] }); // Optional padding
        }
      }
    });
  }

  loadExistingListOfProperties(): void {
    this.properties = this.propertyState.getProperties();
    if (this.map) {
      // this.setMapView(this.map)
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
  }

  setMapView(map: L.Map | undefined): void{
    if (!map) return; // Early exit if map is undefined
    if(this.properties.length > 0){
      const firstProperty = this.properties[0];
      if (firstProperty.latitude && firstProperty.longitude) {
        map.setView([firstProperty.latitude, firstProperty.longitude], 13);
      }
    }
  }
}