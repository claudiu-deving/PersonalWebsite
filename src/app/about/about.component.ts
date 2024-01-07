import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
  constructor() {}
  mainClass: string = "class-main";
  ngOnInit() {
    setTimeout(() => {
      this.mainClass = "class-main final";
    }, 0);
  }
}
