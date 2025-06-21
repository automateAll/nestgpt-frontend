import { Injectable } from '@angular/core';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyStateService {
  private properties: Property[] = [];

  constructor() { }

  setProperties(data: Property[]){
    this.properties = data;
  }

  getProperties(): Property[]{
    return this.properties;
  }

  clearProperties() {
    this.properties = [];
  }
}
