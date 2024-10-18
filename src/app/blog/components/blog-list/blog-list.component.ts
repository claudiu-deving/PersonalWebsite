import { Component, Input, OnInit } from "@angular/core";
import { BlogPostService } from "src/app/blog/services/blog-service.service";
import { AuthentificationAuthorizationService } from "../../../auth/services/AuthentificationAuthorization.service";
import { ViewType } from "../../../shared/types/ViewType.enum";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import { BlogComponent } from "../blog/blog.component";

@Component({
  selector: "app-blog-list",
  templateUrl: "./blog-list.component.html",
  styleUrls: ["./blog-list.component.scss"],
})
export class BlogListComponent implements OnInit {
  @Input() category: string = '';
  blogs: Array<BlogComponent> = [];
  constructor(
    private route: ActivatedRoute,
    private BlogPostService: BlogPostService,
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) { }
  imageDirectory = environment.imageDirectory;
  userLoggedIn: boolean = false;

  ngOnInit() {
    setTimeout(() => {
      this.AuthentificationAuthorizationService.eventObservable.subscribe(
        (event) => {
          this.GetBlogs(this.category);
        }
      );

      this.BlogPostService.eventObservable.subscribe((event) => {
        var blog = this.blogs.find((x) => x.id == event.id);
        if (event.action == "delete") {
          this.blogs.splice(this.blogs.indexOf(blog as BlogComponent), 1);
          return;
        }
        if (event.action == "create") {
          this.BlogPostService.getBlog(event.id).subscribe((x) => {
            x.isEditable = true;
            x.isEditMode = false;
            x.view = ViewType.AUTHOR;
            this.blogs.splice(0, 1, x);
          });
          return;
        }
      });

      this.route.data.subscribe((data) => {
        if (this.category == undefined || this.category == null) {
          this.GetBlogs("default");
        } else {
          this.GetBlogs(this.category);
        }
      });
    }, 0);
  }

  private GetBlogs(category: string) {
    const token = localStorage.getItem("accessToken");
    if (token != null) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.BlogPostService.getBlogs().subscribe((response) => {

      if (token == null) {
        this.setContentAsGuest(response);
      } else {
        this.AuthentificationAuthorizationService.getLoggedInUserData().subscribe(
          (role) => {
            if (role.name == "Admin") {
              response = this.setContentAsAdmin(response, category);
            } else {
              response = this.setContentAsAuthor(response, role, category);
            }
            this.blogs = response;
          }
        );
      }
    });
  }

  private setContentAsAuthor(response: any, role: any, category: string) {
    response = response.filter(
      (x: { isApproved: boolean; author: any; }) => x.isApproved || x.author.username == role.username
    );
    response.forEach((blog: { view: ViewType; author: any; }) => {
      if (blog.author.username == role.username) {
        blog.view = ViewType.AUTHOR;
      } else {
        blog.view = ViewType.GUEST;
      }
    });
    if (category != "" && category != undefined) {
      response = response.filter(
        (x: { category: string; }) => x.category == category
      );
    }
    this.sortFromNewestToOldest();
    return response;
  }

  private setContentAsAdmin(response: any, category: string) {
    response.forEach((blog: { view: ViewType; author: any; }) => {
      if (blog.author.isAdmin == true) {
        blog.view = ViewType.ADMIN_AUTHOR;
      } else {
        blog.view = ViewType.ADMIN;
      }
    });

    if (category != "" && category != undefined) {
      response = response.filter(
        (x: { category: string; }) => x.category == category
      );
    } else {
      response = response.filter((x: { category: string; }) => x.category != "project");
    }
    this.sortFromNewestToOldest();
    return response;
  }

  private setContentAsGuest(response: any) {
    response.forEach((blog: { view: ViewType; }) => {
      blog.view = ViewType.GUEST;
    });

    if (this.category != "" && this.category != undefined) {
      this.blogs = response.filter(
        (x: { isApproved: boolean, category: string }) => x.isApproved && x.category === this.category
      );
    } else {
      this.blogs = response.filter((x: { isApproved: boolean, category: string }) => x.isApproved && x.category != "project");
    }
    this.sortFromNewestToOldest();
  }

  private sortFromNewestToOldest() {
    this.blogs.sort((a: BlogComponent, b: BlogComponent) => {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
  }

  createBlog() {
    this.AuthentificationAuthorizationService.getLoggedInUserData().subscribe(
      (role) => {
        let blog = {
          title: "New blog",
          content: "New blog",
          author: role,
          isEditMode: true,
          isEditable: true,
          editOrSave: "Save",
          view: ViewType.EDIT,
          id: 0,
          tags: [],
          category: "",
          isApproved: false,
          heroImagePath: "",
          slug: "",
        };
        this.blogs.unshift(blog as unknown as BlogComponent);
      }
    );
  }
}
