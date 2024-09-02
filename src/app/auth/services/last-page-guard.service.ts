import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LastpageService } from './lastpage.service';
import { GoogleApiService } from './google-api.service';

@Injectable({
  providedIn: 'root'
})
export class LastPageGuard implements CanActivate {
  constructor(
    private lastPageService: LastpageService,
    private router: Router,
    private readonly googleApiService: GoogleApiService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const lastPage = this.lastPageService.getLastVisitedPage();

    if (state.url.startsWith('/landing')) {
      return this.router.navigate([lastPage]);
    }

    return true;
  }
}