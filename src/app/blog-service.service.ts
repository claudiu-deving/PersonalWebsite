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

  getBlog(title: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'blogposts/unparsed/' + 50);
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
    const url = this.apiUrl + 'BlogPosts/' + 50;

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

  delete(title: string) {
    const token = localStorage.getItem('accessToken');
    const url = this.apiUrl + 'BlogPosts/' + 50;

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
}
