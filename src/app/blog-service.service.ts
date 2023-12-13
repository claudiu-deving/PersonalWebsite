import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private apiUrl = 'http://localhost:5000/api/';
  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'blogposts');
  }

  getBlog(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'BlogPosts/' + id);
  }

  parse(content: string): Observable<string> {
    const token = localStorage.getItem('accessToken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    if (token != null) {
      return this.http.post<any>(this.apiUrl + 'parse', content, {
        headers: headers,
      });
    }
    return new Observable<string>();
  }

  update(id: number, title: string, content: string) {
    const token = localStorage.getItem('accessToken');
    const url = this.apiUrl + 'BlogPosts/' + id;

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    const body = { title, content };
    if (token != null) {
      const response = this.http.put<any>(
        url,
        { title, content },
        {
          headers: headers,
        }
      );
      response.subscribe((x) => console.log(x));
    }
  }

  delete(id: number) {
    const token = localStorage.getItem('accessToken');
    const url = this.apiUrl + 'BlogPosts/' + id;

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    if (token != null) {
      const response = this.http.delete<any>(url, {
        headers: headers,
      });
      response.subscribe((x) => console.log(x));
    }
  }

  create(title: string, content: string, userId: string) {
    const token = localStorage.getItem('accessToken');
    const url = this.apiUrl + 'BlogPosts';
    if (userId == null || userId == '') {
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    if (token != null) {
      const response = this.http.post<any>(
        url,
        { title, content, userId },
        {
          headers: headers,
        }
      );
      response.subscribe((x) => console.log(x));
    }
  }
}
