import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MailService {
  private apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient
  ) { }
  public sendMail(mail: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/Email/send`, mail, {
        observe: "response",
        responseType: 'text'
      },).pipe(
        map(response => {
          return response;
        }));
  }
}
