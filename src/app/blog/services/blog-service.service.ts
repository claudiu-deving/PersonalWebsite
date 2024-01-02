import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthentificationAuthorizationService } from '../../auth/services/AuthentificationAuthorization.service';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) {}

  private eventSubject = new Subject<any>();

  // Observable that can be subscribed to
  public eventObservable = this.eventSubject.asObservable();

  // Method to trigger the event
  emitEvent(data: any) {
    this.eventSubject.next(data);
  }
  getBlogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/blogposts');
  }

  getBlog(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/BlogPosts/' + id);
  }

  update(id: number, title: string, content: string, category: string) {
    const token = localStorage.getItem('accessToken');
    if (id == 0 || id == undefined) {
      this.create(title, content,category);
      return;
    }
    const url = this.apiUrl + '/BlogPosts/' + id;

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    if (token != null) {
      const response = this.http.put<any>(
        url,
        { title, content,category },
        {
          headers: headers,
        }
      );
      response.subscribe();
    }
  }

  delete(id: number) {
    const token = localStorage.getItem('accessToken');
    const url = this.apiUrl + '/BlogPosts/' + id;

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    if (token != null) {
      const response = this.http.delete<any>(url, {
        headers: headers,
      });
      response.subscribe();
    }
    this.emitEvent({ id: id, action: 'delete' });
  }

  create(title: string, content: string,category:string) {
    const token = localStorage.getItem('accessToken');
    const url = this.apiUrl + '/BlogPosts';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    if (token != null) {
      const response = this.http.post<any>(
        url,
        { title, content,category },
        {
          headers: headers,
        }
      );
      response.subscribe((response) => {
        this.emitEvent({ id: response.id, action: 'create' });
      });
    }
  }

  approve(id: number) {
    const token = localStorage.getItem('accessToken');
    const url = this.apiUrl + '/BlogPosts' + '/approve/' + id;

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    if (token != null) {
      const response = this.http.put<any>(url, true, {
        headers: headers,
      });
      response.subscribe();
    }
  }
}
