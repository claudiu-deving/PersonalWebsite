import { NgModule, SecurityContext } from "@angular/core";
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
import { ObserveElementDirective } from "./shared/directives/intersectionObserver.directive";
import { ContactModule } from "./contact/contact.module";
import { NotificationComponent } from "./shared/components/notification/notification.component";
import { MdDemoModule } from "./blog/components/md-demo/md-demo.module";
import { MarkdownModule } from "ngx-markdown";
import { AngularMarkdownEditorModule } from "angular-markdown-editor"
import { PortofolioComponent } from "./portofolio/portofolio.component";
import { NgxColorsModule } from 'ngx-colors';

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
    PortofolioComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AuthModule,
    BrowserAnimationsModule,
    SharedModule,
    RoutingModule,
    ContactModule,
    NotificationComponent,
    MdDemoModule,
    NgxColorsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    MarkdownModule.forChild(),
    AngularMarkdownEditorModule.forRoot({
      // add any Global Options/Config you might want
      // to avoid passing the same options over and over in each components of your App
      iconlibrary: 'fa'
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
