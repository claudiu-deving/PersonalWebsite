import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteTrackingService {
  public previousUrl: string='';
  public currentUrl: string=''; 

  getPreviousUrl() {
    return this.previousUrl;
  }

  setCurrentUrl(url:string){
    this.currentUrl=url;
  }
  
}
