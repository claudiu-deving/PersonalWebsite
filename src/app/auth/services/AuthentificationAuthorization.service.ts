import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationAuthorizationService {
  private apiUrl = environment.apiUrl + '/Auth';
  constructor(private http: HttpClient) {}

  public UserId: string = '';

  private eventSubject = new Subject<any>();

  // Observable that can be subscribed to
  public eventObservable = this.eventSubject.asObservable();

  // Method to trigger the event
  emitEvent(data: any) {
    this.eventSubject.next(data);
  }
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    this.emitEvent('null');
  }

  verify(username: string, password: string): Observable<any> {
    // This Observable will be returned and subscribed to by the caller.
    return this.http
      .post<any>(this.apiUrl + '/token', { username, password })
      .pipe(
        tap((result) => {
          if (result && result.token) {
            // Set the token in localStorage
            localStorage.setItem('accessToken', result.token);
            localStorage.setItem('username', username);
            this.UserId = result.userId;
            // Now we can emit the event since the token is set
            this.emitEvent(result);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // throwError as a function that returns a function
            return throwError(() => new Error('Invalid username or password'));
          }
          return throwError(() => new Error('An error occurred'));
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    // This Observable will be returned and subscribed to by the caller.
    return this.http
      .post<any>(this.apiUrl + '/register', {
        username,
        email,
        password,
      })
      .pipe(
        tap((result) => {
          if (result) {
            return result;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            // throwError as a function that returns a function
            return throwError(() => new Error(error.error));
          }
          return throwError(() => new Error('An error occurred'));
        })
      );
  }

  public getUserId(username: string): Observable<any> {
    // This Observable will be returned and subscribed to by the caller.
    return this.http.get<any>(this.apiUrl + `/${username}`).pipe(
      tap((result) => {
        if (result && result.token) {
          this.UserId = result.userId;
          return result.userId;
        } else {
          return '';
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('An error occurred'));
      })
    );
  }

  public isAdmin(username: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/admin/${username}`).pipe(
      tap((result) => {
        if (result) {
          return result;
        } else {
          return false;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('An error occurred'));
      })
    );
  }
}
