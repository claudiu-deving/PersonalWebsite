import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { PubsubService } from "../shared/services/pubsub.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public navLinks: any[] = [
    // { name: "About", link: "/about" },
    // { name: "Portfolio", link: "/portfolio" },
    //{ name: "CV", link: "/cv" },
    { name: "Blog", link: "/blog" },
    { name: "Contact", link: "/contact" },
  ];
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private pubsubService: PubsubService,
    private router: Router
  ) {
    this.pubsubService.data$.subscribe((data: any) => {
      if (data == "render-nav") {
        this.startTransition();
      }
    });
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isWelcomePage = event.urlAfterRedirects == "/welcome";
        this.sidePanelOpen = true;
        this.toggleSidePanel();
      });
  }
  isWelcomePage = false;
  isPhone = false;
  ngOnInit() {
    this.startTransition();
  }

  private startTransition() {
    let mainNav = this.el.nativeElement.querySelectorAll("#main-nav .link");
    let loginButton = this.el.nativeElement.querySelector("div .nav-login");

    setTimeout(() => {
      mainNav.forEach((link: any, index: number) => {
        setTimeout(() => {
          this.renderer.addClass(link, "moved");
        }, index * 500);
      });
      this.renderer.removeClass(loginButton, "hidden");
    }, 500);
  }

  public sidePanelOpen = false;
  public toggleSidePanel() {
    this.sidePanelOpen = !this.sidePanelOpen;
    let mainNav = this.el.nativeElement.querySelector("#main-nav");

    if (this.sidePanelOpen) {
      this.renderer.addClass(mainNav, "slide-out");
      this.renderer.removeClass(mainNav, "slide-in");
      this.disableScrolling();
    } else {
      this.renderer.addClass(mainNav, "slide-in");
      this.renderer.removeClass(mainNav, "slide-out");
      this.enableScrolling();
    }
  }
  goToWelcome() {
    this.router.navigate(["/welcome"]);
  }
  @Output() toggleMenu = new EventEmitter<boolean>();
  disableScrolling() {
    this.renderer.setStyle(document.body, "overflow", "hidden");
    this.toggleMenu.emit(true);
  }

  enableScrolling() {
    this.renderer.removeStyle(document.body, "overflow");
    this.toggleMenu.emit(false);
  }
}
