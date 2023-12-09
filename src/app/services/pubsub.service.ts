import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PubsubService {
  private dataSource = new Subject<any>();

  // Observable stream
  data$ = this.dataSource.asObservable();

  // Service message commands
  publishData(data: any) {
    this.dataSource.next(data);
  }
}
