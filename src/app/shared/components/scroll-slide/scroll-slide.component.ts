import { Component, ElementRef, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-scroll-slide",
  templateUrl: "./scroll-slide.component.html",
  styleUrls: ["./scroll-slide.component.scss"],
})
export class ScrollSlideComponent implements OnInit {
  state = "";
  @Input() imageSide: string = "left";
  @Input() image: string = "";
  @Input() content: string = "";
  @Input() alt: string = "";
  @Input() image_background: string = "";
  imageClass: string = "sliding-image";
  contentClass: string = "sliding-content";

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.imageSide == "right") {
      this.imageClass = "sliding-image start-from-right";
      this.contentClass = "sliding-content start-from-left";
    } else {
      this.imageClass = "sliding-image start-from-left";
      this.contentClass = "sliding-content start-from-right";
    }
  }

  public startAnimation(state: string) {
    if (state == "in") {
      if (this.imageSide == "right") {
        this.imageClass = "sliding-image start-from-right slide-from-right";
        this.contentClass = "sliding-content start-from-left slide-from-left";
      } else {
        this.imageClass = "sliding-image start-from-left slide-from-left";
        this.contentClass = "sliding-content start-from-right slide-from-right";
      }
    } else {
      if (this.imageSide == "right") {
        this.imageClass = "sliding-image start-from-right";
        this.contentClass = "sliding-content start-from-left";
      } else {
        this.imageClass = "sliding-image start-from-left";
        this.contentClass = "sliding-content start-from-right";
      }
    }
  }
}
