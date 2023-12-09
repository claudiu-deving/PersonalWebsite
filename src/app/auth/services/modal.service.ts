import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private display: BehaviorSubject<
    'open-login' | 'close-login' | 'open-register' | 'close-register'
  > = new BehaviorSubject<
    'open-login' | 'close-login' | 'open-register' | 'close-register'
  >('close-login');

  watch(): Observable<
    'open-login' | 'close-login' | 'open-register' | 'close-register'
  > {
    return this.display.asObservable();
  }

  openLogin() {
    this.display.next('open-login');
  }

  openRegister() {
    this.display.next('open-register');
  }

  closeLogin() {
    this.display.next('close-login');
  }

  closeRegister() {
    this.display.next('close-register');
  }
}
