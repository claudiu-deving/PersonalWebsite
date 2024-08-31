import { Component, OnInit } from "@angular/core";
import { ModalService } from "../../services/modal.service";
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthentificationAuthorizationService } from "../../services/AuthentificationAuthorization.service";

@Component({
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.scss"],
})
export class RegisterFormComponent implements OnInit {
  private subscription: Subscription;
  display: "open-login" | "close-login" | "open-register" | "close-register" =
    "close-register";
  constructor(
    private modalService: ModalService,
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) {
    this.subscription = this.modalService.watch().subscribe((display) => {
      this.display = display;
    });
    this.formGroup.valueChanges.subscribe((value) => {
      if (
        this.formGroup.value.password != this.formGroup.value.retypePassword
      ) {
        this.message = "Passwords do not match";
      } else {
        this.message = "";
      }
    });
  }
  message = "";
  formGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
    retypePassword: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnInit() { }

  onSubmit() {
    if (this.formGroup.value.password != this.formGroup.value.retypePassword) {
      this.message = "Passwords do not match";
      return;
    }
    if (this.formGroup.invalid) {
      this.message = "Invalid input";
      return;
    }
    this.AuthentificationAuthorizationService.register(
      this.formGroup.value.username!,
      this.formGroup.value.email!,
      this.formGroup.value.password!
    ).subscribe({
      next: (response: null) => {
        if (response == null) {
          this.message = "Invalid username or password";
        } else {
          this.close()
          this.logIn();
        }
      },
      error: (errorMessage: string) => {
        this.message = errorMessage;
      },
    });
  }

  private logIn() {
    this.AuthentificationAuthorizationService.verify(
      this.formGroup.value.username!,
      this.formGroup.value.password!
    ).subscribe({
      next: (response) => {
        if (response == null) {
          this.message = "Invalid username or password";
        } else {
          this.close();
        }
      },
      error: (errorMessage) => {
        this.message = errorMessage;
      },
    });
  }

  close() {
    this.modalService.closeRegister();
  }
}
