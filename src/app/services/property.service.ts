import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Property } from '../models/property.model';

@Injectable({
    providedIn: 'root'
})
export class PropertyService {
    private PROPERTY_SERVICE_BASE_URL = "http://localhost:8081/v1/properties";

    // Optional mock data
    private mockProperties = [
        {
            id: 'p123',
            address: 'Bentonville',
            price: 500.0,
            thumbnailUrl: 'mockURL1',
            latitude: 36.3729,
            longitude: -94.2088
        },
        {
            id: 'p124',
            address: 'Hicksville',
            price: 700.0,
            thumbnailUrl: 'mockURL2',
            latitude: 40.7684,
            longitude: -73.5251
        },
        {
            id: 'p125',
            address: 'New York',
            price: 800.0,
            thumbnailUrl: 'mockURL3',
            latitude: 40.7128,
            longitude: -74.0060
        }
    ];

    constructor(private http: HttpClient) { }

    getProperties(searchTerm: any): Observable<any[]> {
        const params = new HttpParams({ fromObject: searchTerm });
        return this.http.get<any[]>(`${this.PROPERTY_SERVICE_BASE_URL}`, {params}).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching properties from backend. Falling back to mock data.', error);
                return of(this.mockProperties);
            })
        );
    }

    getPropertyContext(propertyId: string): Observable<Property> {
        const params = new HttpParams()
        .set('id', propertyId);
        return this.http.get<Property>(`${this.PROPERTY_SERVICE_BASE_URL}/${propertyId}`);
    }
}