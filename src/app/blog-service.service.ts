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
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (token != null) {
      return this.http.get<any>(this.apiUrl + 'blogposts', {
        headers: headers,
      });
    }
    return new Observable<any>();
  }

  getBlog(title: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (token != null) {
      return this.http.get<any>(this.apiUrl + 'blogposts/unparsed/' + 50, {
        headers: headers,
      });
    }
    return new Observable<any>();
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

  update(title: string, content: string) {
    const token = localStorage.getItem('accessToken');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    if (token != null) {
      this.http.put<any>(
        this.apiUrl + 'blogposts/' + 50,
        { title, content },
        {
          headers: headers,
        }
      );
    }
  }
}
