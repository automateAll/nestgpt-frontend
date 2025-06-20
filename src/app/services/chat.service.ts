import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private CHAT_SERVICE_BASE_URL = "http://localhost:8000/v1/chat";

    constructor(private http: HttpClient) { }

    getChatResponse(propertyId: string, query: string): Observable<any> {
        console.log("getChatResponse called...",propertyId,query)
        const params = new HttpParams()
        .set('property_id', propertyId)
        .set('query', query);
        return this.http.get<any>(this.CHAT_SERVICE_BASE_URL, { params });
    }
}