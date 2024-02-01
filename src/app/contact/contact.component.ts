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

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  constructor(
    private mailService: MailService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}
  public mailSent = false;

  ngOnInit() {}
  formGroup = new FormGroup({
    name: new FormControl("", [required(), customMinLength(3)]),
    from: new FormControl("", [required(), email()]),
    subject: new FormControl("", [required(), customMinLength(3)]),
    body: new FormControl("", [required(), customMinLength(50)]),
  });
  sendMail() {
    this.mailService
      .sendMail(this.formGroup.value)
      .pipe()
      .subscribe((result) => {
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
