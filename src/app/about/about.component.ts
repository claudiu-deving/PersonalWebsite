import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}
  mainClass: string = "class-main-initial";
  ngOnInit() {
    setTimeout(() => {
      this.mainClass = "class-main-final";
    }, 0);
  }
}
