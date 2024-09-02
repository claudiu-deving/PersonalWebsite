import { Component, OnInit } from '@angular/core';
import { GoogleApiService } from '../../services/google-api.service';
import { LastpageService } from '../../services/lastpage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {

  constructor(private readonly googleApi: GoogleApiService,
    private lastPageService: LastpageService,
    private router: Router,) {

  }
  ngOnInit(): void {
    this.googleApi.loadUserProfile();
    const lastPage = this.lastPageService.getLastVisitedPage();

    if (window.location.pathname.startsWith('/landing')) {
      this.router.navigate([lastPage]);
    }
  }
}
