import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private apiUrl = environment.apiUrl;
constructor(private HttpClient:HttpClient) { }

getTags(){
  return this.HttpClient.get(`${this.apiUrl}/tags`);
}

}
