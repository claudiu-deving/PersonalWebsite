import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BlogComponent } from "./blog/components/blog/blog.component";
import { BlogListComponent } from "./blog/components/blog-list/blog-list.component";
import { HeaderComponent } from "./header/header.component";
import { FormsModule } from "@angular/forms";
import { AuthModule } from "./auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { RoutingModule } from "./routing/routing.module";
import { TagComponent } from "./blog/components/tag/tag.component";
import { TagListComponent } from "./blog/components/tag-list/tag-list.component";
import { HomeComponent } from "./home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AboutComponent } from "./about/about.component";
import { LayoutModule } from "@angular/cdk/layout";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ObserveElementDirective } from "./shared/directives/intersectionObserver.directive";

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    BlogListComponent,
    HeaderComponent,
    TagComponent,
    TagListComponent,
    HomeComponent,
    AboutComponent,
    ObserveElementDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AuthModule,
    BrowserAnimationsModule,
    SharedModule,
    RoutingModule,
    LayoutModule,
    ScrollingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
