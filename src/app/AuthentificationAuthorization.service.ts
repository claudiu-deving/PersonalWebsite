import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthentificationAuthorizationService {
  private apiUrl = 'http://localhost:5000/api/Auth/token';
  constructor(private http: HttpClient) {}
  private eventSubject = new Subject<any>();

  // Observable that can be subscribed to
  public eventObservable = this.eventSubject.asObservable();

  // Method to trigger the event
  emitEvent(data: any) {
    this.eventSubject.next(data);
  }
  logout() {
    localStorage.removeItem('accessToken');
    this.eventSubject.next(null);
  }
  verify(username: string, password: string): Observable<any> {
    // This Observable will be returned and subscribed to by the caller.
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap((result) => {
        if (result && result.token) {
          // Set the token in localStorage
          localStorage.setItem('accessToken', result.token);
          // Now we can emit the event since the token is set
          this.emitEvent(result);
        }
      })
    );
  }
}
