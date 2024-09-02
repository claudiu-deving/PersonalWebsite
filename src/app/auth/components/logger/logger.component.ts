import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { AuthentificationAuthorizationService } from "../../services/AuthentificationAuthorization.service";
import { ModalService } from "../../services/modal.service";
import { GoogleApiService } from "../../services/google-api.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-logger",
  templateUrl: "./logger.component.html",
  styleUrls: ["./logger.component.scss"],
})
export class LoggerComponent implements OnInit {
  display: "open" | "close" = "close";
  logStatus: "Log In" | "Log Out" = "Log In";
  @Input() login = this.logStatus;
  username: string = "";
  constructor(
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService,
    private modalService: ModalService,
    private readonly googleApi: GoogleApiService
  ) {
    this.AuthentificationAuthorizationService.eventObservable.subscribe(
      (event) => {
        if (event) {
          this.login = "Log Out";
          this.setUsername();
        }
      }
    );
    this.setUsername();
    googleApi.userProfile$.subscribe(user => {
      if (user) {
        this.username = user?.info.name
      }
    });
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
    if (this.login == "Log Out") {
      this.AuthentificationAuthorizationService.logout();
      this.login = "Log In";
      this.username = "";
      return;
    }
    this.modalService.openLogin();
  }
  ngOnInit() {

    this.AuthentificationAuthorizationService.getLoggedInUserData().subscribe(data => {
      if (!data) {
        this.login = "Log In";
        this.username = "";
        localStorage.setItem("accessToken", "");
      } else {
        this.login = "Log Out";
        this.setUsername();
      }
    })
  }
}
