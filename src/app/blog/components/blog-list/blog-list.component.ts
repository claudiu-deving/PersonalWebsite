import { Component, OnInit } from "@angular/core";
import { BlogPostService } from "src/app/blog/services/blog-service.service";
import { AuthentificationAuthorizationService } from "../../../auth/services/AuthentificationAuthorization.service";
import { ViewType } from "../../../shared/types/ViewType.enum";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blog-list",
  templateUrl: "./blog-list.component.html",
  styleUrls: ["./blog-list.component.scss"],
})
export class BlogListComponent implements OnInit {
  blogs: Array<any> = [];
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
          this.GetBlogs();
        }
      );

      this.BlogPostService.eventObservable.subscribe((event) => {
        var blog = this.blogs.find((x) => x.id == event.id);
        if (event.action == "delete") {
          this.blogs.splice(this.blogs.indexOf(blog), 1);
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
        const category = data["category"];
        if (category == undefined || category == null) {
          this.GetBlogs();
        } else {
          this.GetBlogs(category);
        }
      });
    }, 0);
  }

  private GetBlogs(category: string = "") {
    const token = localStorage.getItem("accessToken");
    if (token != null) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.BlogPostService.getBlogs().subscribe((response) => {
      this.blogs = response;
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
    }
    this.sortFromNewestToOldest();
    return response;
  }

  private setContentAsGuest(response: any) {
    response.forEach((blog: { view: ViewType; }) => {
      blog.view = ViewType.GUEST;
    });

    this.blogs = response.filter(
      (x: { isApproved: boolean; }) => x.isApproved
    );
    this.sortFromNewestToOldest();
  }

  private sortFromNewestToOldest() {
    this.blogs.sort((a: { created: Date }, b: { created: Date }) => {
      console.log(a.created);
      console.log(b.created);
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
        };
        this.blogs.unshift(blog);
      }
    );
  }
}
