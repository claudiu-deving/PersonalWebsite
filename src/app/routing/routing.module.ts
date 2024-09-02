import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BlogListComponent } from "../blog/components/blog-list/blog-list.component";
import { HomeComponent } from "../home/home.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";
import { LastPageGuard } from "../auth/services/last-page-guard.service";
import { LandingComponent } from "../auth/components/landing/landing.component";

const routes: Routes = [
  //canActivate: [LastPageGuard], 
  { path: 'landing', component: LandingComponent },
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "welcome", component: HomeComponent },
  { path: "blog", component: BlogListComponent },
  {
    path: "blog/personal_website",
    component: BlogListComponent,
    data: { category: "Personal Website" },
  },
  {
    path: "about",
    component: AboutComponent,
    data: { animation: "isAbove" },
  },
  { path: "contact", component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule { }
