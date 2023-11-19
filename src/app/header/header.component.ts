import { Component, OnInit } from '@angular/core';
import { AuthentificationAuthorizationService } from '../AuthentificationAuthorization.service';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  login: string;
  constructor(
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) {
    this.login = 'Log In';
  }

  ngOnInit() {}

  verify() {
    if (this.login == 'Log Out') {
      this.AuthentificationAuthorizationService.logout();
      this.login = 'Log In';
      return;
    }
    this.AuthentificationAuthorizationService.verify('user3', 'pass').subscribe(
      (response) => {
        if (response != null) {
          this.login = 'Log Out';
        } else {
          this.login = 'Log In';
        }
      }
    );
  }
}
