import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ScrollSlideComponent } from "../shared/components/scroll-slide/scroll-slide.component";

const aboutItems: Array<any> = [
  {
    image: "assets/images/About/hacker.png",
    content: "Self taught developer",
    imageSide: "left",
    alt: "Image of a hacker",
    background: "assets/images/About/hacker_background.png",
  },
  {
    image: "assets/images/About/curious.png",
    content: "Passionately curious",
    imageSide: "right",
    alt: "Image of a detective in a green coat looking through a magnifying glass",
  },
  {
    image: "assets/images/About/engineer.png",
    content: "BIM specialist by profession",
    imageSide: "left",
    alt: "Image of an engineer drawing a colored structure",
  },
  {
    image: "assets/images/About/window.png",
    content: "Crafting desktop apps for colleagues",
    imageSide: "right",
    alt: "Image of a software's window",
  },
  {
    image: "assets/images/About/binder.png",
    content: "Explore my portfolio of projects",
    imageSide: "left",
    alt: "Image of a colourful binder",
  },

  {
    image: "assets/images/About/resume.png",
    content: "Or dive into my CV",
    imageSide: "right",
    alt: "Image of a resume",
  },
  {
    image: "assets/images/About/road.png",
    content: "Story continues...",
    imageSide: "left",
    alt: "The story unfolds...",
  },
];

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
  constructor() { }
  aboutItems = aboutItems;
  mainClass: string = "class-main";
  ngOnInit() {
    setTimeout(() => {
      this.mainClass = "class-main final";
    }, 0);
  }

  @ViewChildren(ScrollSlideComponent) slides:
    | QueryList<ScrollSlideComponent>
    | undefined;

  isIntersecting(status: boolean, slide: ScrollSlideComponent) {
    if (status) {
      slide.startAnimation("in");
    } else {
      slide.startAnimation("");
    }
  }
}
