import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthentificationAuthorizationService } from '../../services/AuthentificationAuthorization.service';
import { ModalService } from '../../services/modal.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css'],
})
export class LoggerComponent implements OnInit {
  display: 'open' | 'close' = 'close';
  @Input() login = 'Log In';
  username: string = '';
  constructor(
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService,
    private modalService: ModalService
  ) {
    this.AuthentificationAuthorizationService.eventObservable.subscribe(
      (event) => {
        if (event) {
          this.login = 'Log Out';
          this.setUsername();
        }
      }
    );

    this.setUsername();
  }
  showModal: boolean = false;

  private setUsername() {
    this.AuthentificationAuthorizationService.getLoggedInUserData().subscribe(
      (user) => {
        this.username = user.username;
      }
    );
  }

  verify() {
    if (this.login == 'Log Out') {
      this.AuthentificationAuthorizationService.logout();
      this.login = 'Log In';
      this.username = '';
      return;
    }
    this.modalService.openLogin();
  }
  ngOnInit() {
    let token = localStorage.getItem('accessToken');

    if (token) {
      this.login = 'Log Out';
      this.setUsername();
    }
  }
}
