import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent {

  chatHistory: { sender: string, text: string }[] = [];
  userInput: string = '';
  response: string = '';
  propertyId!: string;
  property!: Property;

  constructor(private route: ActivatedRoute,
    private chatService: ChatService,
    private propertyService: PropertyService,
    private router: Router) { }

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;

    if(this.propertyId){
      this.getPropertyDetails(this.propertyId);
    }
    // Now fetch the property details using this.propertyId
    // this.sendMessage(this.propertyId, "Hello")

  }

  //call AI based chat-service
  sendMessage(propertyId: string, message: string): void {
  console.log("sendMessage called....");
  this.chatService.getChatResponse(propertyId, message).subscribe({
    next: (data) => {

      this.chatHistory.push({ sender: 'user', text: message });

      let botReply = '';

      try {
        // First level already parsed: data.body is a stringified JSON
        const responseBody = data.response.body; // 👈 parse inner string
        botReply = JSON.parse(responseBody).response;
        console.log('botReply:', botReply);
      } catch (e) {
        console.error("Failed to parse bot response", e);
        botReply = "Sorry, I couldn't understand the response.";
      }
      this.chatHistory.push({ sender: 'bot', text: botReply });
      this.userInput = '';
    },
    error: (err) => {
      console.error("Chat service error:", err);
      this.chatHistory.push({ sender: 'bot', text: 'Something went wrong with the chat service.' });
    }
  });
}

  getPropertyDetails(propertyId: string) : void {
    this.propertyService.getPropertyContext(propertyId).subscribe((data: Property) => {
    this.property = data;
    console.log("Property ID:", propertyId);
    console.log("Property Data:", this.property);
    });
  }

  goBack(): void {
    console.log("Back button clicked...")
    this.router.navigate(['/properties'], 
      {state: {from: 'PropertyDetailComponent'}})
  }
}
