import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LastpageService {

  private readonly LAST_PAGE_KEY = 'lastVisitedPage';

  constructor(private router: Router) {
    this.trackPageChanges();
  }

  private trackPageChanges(): void {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (!event.urlAfterRedirects.startsWith('/landing')) {
        this.setLastVisitedPage(event.urlAfterRedirects);
      }
    });
  }

  setLastVisitedPage(url: string): void {
    localStorage.setItem(this.LAST_PAGE_KEY, url);
  }

  getLastVisitedPage(): string {
    return localStorage.getItem(this.LAST_PAGE_KEY) || '/';
  }
}
