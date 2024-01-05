import { Component } from "@angular/core";
declare const setCarvesRadiuses: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [],
})
export class AppComponent {
  title = "Klaus's Personal Website";
  constructor() {}

  setCarvesRadiuses() {
    setCarvesRadiuses();
  }
}
