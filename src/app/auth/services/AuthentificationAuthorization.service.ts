import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationAuthorizationService {
  private apiUrl = environment.apiUrl + '/Auth';
  constructor(private http: HttpClient) { }

  public UserId: string = '';

  private eventSubject = new Subject<any>();

  public eventObservable = this.eventSubject.asObservable();

  emitEvent(data: any) {
    this.eventSubject.next(data);
  }
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    this.emitEvent('null');
  }

  verify(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(this.apiUrl + '/token', { username, password })
      .pipe(
        tap((result) => {
          if (result && result.token) {
            localStorage.setItem('accessToken', result.token);
            this.UserId = result.userId;
            this.emitEvent(result);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 401: {
              return throwError(
                () => new Error('Invalid username or password')
              );
            }
            case 403: {
              return throwError(
                () =>
                  new Error('You exceeded the allowed limit of login attemps!')
              );
            }
            default: {
              return throwError(() => new Error('An error occurred'));
            }
          }
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
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
            return throwError(() => new Error(error.error));
          }
          return throwError(() => new Error('An error occurred'));
        })
      );
  }

  public getUserId(username: string): Observable<any> {
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

  public getLoggedInUserData(): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (token == null) return new Observable<any>();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');

    return this.http.get<any>(this.apiUrl + '/role', { headers: headers }).pipe(
      tap((result) => {
        if (result) {
          return result;
        } else {
          return '';
        }
      }), catchError((error: HttpErrorResponse) => {
        console.log(error);
        localStorage.removeItem("accessToken");
        return new Observable<any>();
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
