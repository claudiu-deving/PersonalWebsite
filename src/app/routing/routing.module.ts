import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BlogListComponent } from "../blog/components/blog-list/blog-list.component";
import { HomeComponent } from "../home/home.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";
import { PortofolioComponent } from "../portofolio/portofolio.component";

const routes: Routes = [
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "welcome", component: HomeComponent },
  { path: "blog", component: BlogListComponent },
  {
    path: "blog/personal_website",
    component: BlogListComponent,
    data: { category: "Personal Website" },
  },
  { path: "contact", component: ContactComponent },
  { path: "portfolio", component: PortofolioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule { }
