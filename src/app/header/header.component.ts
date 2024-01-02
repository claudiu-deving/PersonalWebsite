import { Component, OnInit } from '@angular/core';
import { AuthModule } from '../auth/auth.module';
import { RoutingModule } from '../routing/routing.module';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
