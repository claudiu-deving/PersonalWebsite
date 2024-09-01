import { NotificationService } from "./../shared/services/notification.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MailService } from "./mail.service";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  customMinLength,
  email,
  required,
} from "../shared/validators/validators";
import { AuthentificationAuthorizationService } from "../auth/services/AuthentificationAuthorization.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  constructor(
    private mailService: MailService,
    private notificationService: NotificationService,
    private authentificationAndAuthorizationService: AuthentificationAuthorizationService
  ) { }
  public mailSent = false;

  ngOnInit() {
    setTimeout(() => {
      this.authentificationAndAuthorizationService.eventObservable.subscribe(
        () => {
          this.setDataAsLoggedInUser();
        }
      );
      this.setDataAsLoggedInUser();
    });
  }
  formGroup = new FormGroup({
    senderName: new FormControl("", [required(), customMinLength(3)]),
    senderEmail: new FormControl("", [required(), email()]),
    subject: new FormControl("", [required(), customMinLength(3)]),
    message: new FormControl("", [required(), customMinLength(50)]),
  });
  private setDataAsLoggedInUser() {
    this.authentificationAndAuthorizationService.getLoggedInUserData().subscribe(data => {
      if (data) {
        this.formGroup.controls.senderEmail.setValue(data.email);
        this.formGroup.controls.senderName.setValue(data.username);
      }
    });
  }

  sendMail() {
    console.log(this.formGroup.value);
    this.mailService
      .sendMail(this.formGroup.value)
      .pipe()
      .subscribe((result) => {
        console.log(result);
        switch (result.status) {
          case 200:
            this.notificationService.showSuccess("Email sent successfully");
            break;
          case 400:
            this.notificationService.showError("Unable to send the email");
            break;
          default:
            this.notificationService.showError("Unable to send the email");
            break;
        }
      });
  }
}
