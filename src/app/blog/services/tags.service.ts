import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private apiUrl = environment.apiUrl;
  constructor(private HttpClient: HttpClient) { }

  getTags() {
    return this.HttpClient.get(`${this.apiUrl}/tags`);
  }

  addTag(name: string, description: string, color: string) {
    return this.HttpClient.post(`${this.apiUrl}/tags`, { name, description, color });
  }

  updateTag(tag: any) {
    return this.HttpClient.put(`${this.apiUrl}/tags`, tag);
  }

  removeTagFromBlogpost(tags: any[], blogpostId: string) {
    return this.HttpClient.put(`${this.apiUrl}/blogposts/${blogpostId}`, { tags });
  }
}
