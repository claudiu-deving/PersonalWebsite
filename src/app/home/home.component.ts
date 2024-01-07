import { Router } from "@angular/router";
import { PubsubService } from "./../shared/services/pubsub.service";
import { Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
declare const setCarvesRadiuses: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private timeForASingleTransition = 150;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private pubsubService: PubsubService,
    private router: Router
  ) {}

  ngOnInit() {
    setCarvesRadiuses();
  }

  startTransition() {
    this.timeForASingleTransition = this.timeForASingleTransition * 0.75;
    let totalTimeToWait = this.transitionNavKeywords();

    this.pubsubService.publishData("render-nav");

    totalTimeToWait += this.transitionParagraphs(totalTimeToWait);

    totalTimeToWait += this.transitionMainText(totalTimeToWait);

    totalTimeToWait += this.flattenCarves(totalTimeToWait);

    setTimeout(() => {
      this.router.navigate(["/about"]);
    }, totalTimeToWait);
  }

  flattenCarves(totalTimeToWait: number): number {
    const timeToWait = this.timeForASingleTransition * 6.66;

    setTimeout(() => {
      this.renderer.addClass(
        this.el.nativeElement.querySelector("#rightcarve"),
        "flatten"
      );
      this.renderer.addClass(
        this.el.nativeElement.querySelector("#leftcarve"),
        "flatten"
      );

      this.el.nativeElement
        .querySelector(".get-started-btn")
        .classList.add("hidden");

      setTimeout(() => {
        this.renderer.addClass(
          this.el.nativeElement.querySelector(".upper-left"),
          "flatten"
        );
        this.renderer.addClass(
          this.el.nativeElement.querySelector(".upper-right"),
          "flatten"
        );
      }, timeToWait);

      setTimeout(() => {
        let element = this.el.nativeElement.querySelector(
          ".wrapper .welcome-part"
        );
        element.style.transition = "height 1.6s linear";
        element.style.height = "0%";
      }, timeToWait * 2);
    }, totalTimeToWait);

    return totalTimeToWait + timeToWait;
  }

  private transitionMainText(timeToWait: number): number {
    setTimeout(() => {
      this.el.nativeElement
        .querySelector("#welcome-message")
        .classList.add("text-hidden");
    }, timeToWait);
    timeToWait += this.timeForASingleTransition;
    return timeToWait;
  }

  private transitionParagraphs(timeToWait: number): number {
    var paragraphs = this.el.nativeElement.querySelectorAll(".description p");
    setTimeout(() => {
      paragraphs.forEach((paragraph: any, index: number) => {
        setTimeout(() => {
          this.renderer.addClass(paragraph, "text-hidden");
        }, index * this.timeForASingleTransition);
      });
    }, timeToWait);
    timeToWait = paragraphs.length * this.timeForASingleTransition;
    return timeToWait;
  }

  private transitionNavKeywords(): number {
    let welcomeNav = this.el.nativeElement.querySelectorAll(
      ".left-part .nav-keyword"
    );
    let description = this.el.nativeElement.querySelectorAll(
      ".right-part .nav-keyword"
    );
    let combinedArray = [...description, ...welcomeNav];
    const timeTowait = combinedArray.length * this.timeForASingleTransition;

    setTimeout(() => {
      combinedArray.forEach((keyword: any, index: number) => {
        setTimeout(() => {
          this.renderer.addClass(keyword, "moved");
        }, index * this.timeForASingleTransition);
      });
    });

    return timeTowait;
  }
}
