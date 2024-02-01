import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { InputType } from "../../types/inputTypes";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
})
export class InputComponent implements OnInit {
  @Input() inputId: string = "";
  @Input() control = new FormControl();
  @Input() label: string = "";
  @Input() type: InputType = InputType.TEXT;
  errorMessages: string[] = [];

  constructor() {}
  ngOnInit() {
    this.control.valueChanges.subscribe(() => {
      if (this.control.errors && this.control.errors["message"]) {
        if (
          this.errorMessages.some((x) => x == this.control.errors!["message"])
        )
          return;
        this.errorMessages.push(this.control.errors["message"]);
      }
    });
  }
}
