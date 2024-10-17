import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Renderer2,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
} from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { TeklaService } from "./shared/services/tekla.service";
declare const setCarvesRadiuses: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements AfterViewInit, OnInit {
  title = "Klaus's Personal Website";
  content: string = '';
  constructor(private renderer: Renderer2, private teklaService: TeklaService) { }

  ngOnInit(): void {
    this.teklaService.helloSubject.subscribe((data: string) => {
      this.content = data;
    });
  }

  contentToBlur: Element | null = null;
  header: Element | null = null;
  @ViewChild(HeaderComponent) childComponent: HeaderComponent | undefined;
  ngAfterViewInit() {
    this.contentToBlur = document.querySelector(".main-container");
    this.header = document.querySelector("#main-nav");
  }

  toggleBlurEffect(toggle: boolean) {
    if (!this.contentToBlur) return console.log("contentToBlur is undefined");
    if (toggle) {
      this.renderer.addClass(this.contentToBlur, "blur-effect");
    } else {
      this.renderer.removeClass(this.contentToBlur, "blur-effect");
    }
  }
  setCarvesRadiuses() {
    setCarvesRadiuses();
  }

  onClick(event: MouseEvent) {
    let dropdown = document.querySelector(".dropdown-button");
    if (!this.header) return console.log("header is undefined");
    let target = event.target as Node;
    if (
      !this.header.contains(target) &&
      !dropdown?.contains(target) &&
      this.childComponent?.sidePanelOpen
    ) {
      this.toggleBlurEffect(false);
      this.childComponent?.toggleSidePanel();
    }
  }
}
