import { NotificationService } from "./../shared/services/notification.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, retry, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MailService {
  private apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {}
  public sendMail(mail: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/Email`, mail, {
        observe: "response",
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any): string {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
      return "Unable to send the email";
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      return "Unable to send the email";
    }
  }
}
