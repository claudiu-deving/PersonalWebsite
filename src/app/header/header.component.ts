import { Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { PubsubService } from "../shared/services/pubsub.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  public navLinks: any[] = [
    { name: "About", link: "/about" },
    { name: "Portfolio", link: "/portfolio" },
    { name: "CV", link: "/cv" },
    { name: "Blog", link: "/blog" },
    { name: "Contact", link: "/contact" },
  ];
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private pubsubService: PubsubService,
    private router: Router
  ) {
    this.pubsubService.data$.subscribe((data) => {
      if (data == "render-nav") {
        this.startTransition();
      }
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Check if the current route is the welcome page
        this.showNavLinks = event.urlAfterRedirects !== "/welcome";
      });
  }
  showNavLinks = true;

  ngOnInit() {}

  private startTransition() {
    let mainNav = this.el.nativeElement.querySelectorAll(
      "#main-nav .inactive-link"
    );
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

  openSidePanel() {
    let sidePanel = this.el.nativeElement.querySelector("#main-nav");
    this.renderer.addClass(sidePanel, "side-menu");
  }
}
