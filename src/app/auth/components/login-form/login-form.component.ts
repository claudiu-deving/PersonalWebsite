import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InputComponent } from "src/app/shared/components/input/input.component";
import { AuthentificationAuthorizationService } from "../../services/AuthentificationAuthorization.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ModalService } from "../../services/modal.service";
import { Subscription } from "rxjs";
import { GoogleApiService } from "../../services/google-api.service";
@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnInit {
  constructor(
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService,
    private modalService: ModalService,
    private readonly googleApiService: GoogleApiService
  ) {
    this.subscription = this.modalService.watch().subscribe((display) => {
      this.display = display;
    });
  }
  display: "open-login" | "close-login" | "open-register" | "close-register" =
    "close-login";
  private subscription: Subscription;
  submitText = "Log In";
  message = "";
  formGroup = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  ngOnInit() {
    this.googleApiService.setupOAuth();

  }

  onSubmit() {
    this.AuthentificationAuthorizationService.verify(
      this.formGroup.value.username!,
      this.formGroup.value.password!
    ).subscribe({
      next: (response) => {
        if (response == null) {
          this.message = "Invalid username or password";
        } else {
          this.display = "close-login";
        }
      },
      error: (errorMessage) => {
        this.message = errorMessage;
      },
    });

  }

  close() {
    this.modalService.closeLogin();
  }

  onRegister() {
    this.modalService.closeLogin();
    this.modalService.openRegister();
  }
  async loginWithGoogle() {
    await this.googleApiService.logIn();
    this.modalService.closeLogin();
  }
}
