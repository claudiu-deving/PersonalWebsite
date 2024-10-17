import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TeklaService {
  helloSubject = new Subject<string>();
  constructor(private http: HttpClient) {
    this.http.post('http://localhost:8080/', { 'hello': 'world' }).subscribe((data: any) => {
      //send as observable to the component
      this.helloSubject.next(data);
    });
  }
}
