import { Component, OnInit } from "@angular/core";
import { BlogPostService } from "src/app/blog/services/blog-service.service";
import { AuthentificationAuthorizationService } from "../../../auth/services/AuthentificationAuthorization.service";
import { ViewType } from "../../../shared/types/ViewType.enum";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-blog-list",
  templateUrl: "./blog-list.component.html",
  styleUrls: ["./blog-list.component.css"],
})
export class BlogListComponent implements OnInit {
  blogs: Array<any> = [];
  constructor(
    private route: ActivatedRoute,
    private BlogPostService: BlogPostService,
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) {}

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
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("accessToken");
    if (token != null) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.BlogPostService.getBlogs().subscribe((response) => {
      if (token == null) {
        response.forEach((blog: { view: ViewType }) => {
          blog.view = ViewType.GUEST;
        });

        this.blogs = response.filter(
          (x: { isApproved: boolean }) => x.isApproved
        );
        this.sortFromNewestToOldest();
      } else {
        this.AuthentificationAuthorizationService.getLoggedInUserData().subscribe(
          (role) => {
            if (role.name == "Admin") {
              response.forEach((blog: { view: ViewType; author: any }) => {
                if (blog.author.isAdmin == true) {
                  blog.view = ViewType.AUTHOR;
                } else {
                  blog.view = ViewType.ADMIN;
                }
              });

              if (category != "" && category != undefined) {
                response = response.filter(
                  (x: { category: string }) => x.category == category
                );
              }
              this.sortFromNewestToOldest();
            } else {
              response = response.filter(
                (x: { isApproved: boolean; author: any }) =>
                  x.isApproved || x.author.username == role.username
              );
              response.forEach((blog: { view: ViewType; author: any }) => {
                if (blog.author.username == role.username) {
                  blog.view = ViewType.AUTHOR;
                } else {
                  blog.view = ViewType.GUEST;
                }
              });
              if (category != "" && category != undefined) {
                response = response.filter(
                  (x: { category: string }) => x.category == category
                );
              }
              this.sortFromNewestToOldest();
            }
            this.blogs = response;
          }
        );
      }
    });
  }

  private sortFromNewestToOldest() {
    this.blogs.sort((a: { modified: Date }, b: { modified: Date }) => {
      return new Date(b.modified).getTime() - new Date(a.modified).getTime();
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
