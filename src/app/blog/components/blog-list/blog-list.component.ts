import { Component, OnInit } from '@angular/core';
import { BlogPostService } from 'src/app/blog/services/blog-service.service';
import { AuthentificationAuthorizationService } from '../../../auth/services/AuthentificationAuthorization.service';
import { ViewType } from '../../../shared/types/ViewType.enum';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  blogs: Array<any> = [];
  constructor(
    private BlogPostService: BlogPostService,
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) {
    AuthentificationAuthorizationService.eventObservable.subscribe((event) => {
      this.GetBlogs();
    });
    BlogPostService.eventObservable.subscribe((event) => {
      var blog = this.blogs.find((x) => x.id == event.id);
      if (event.action == 'delete') {
        this.blogs.splice(this.blogs.indexOf(blog), 1);
        return;
      }
      if (event.action == 'create') {
        BlogPostService.getBlog(event.id).subscribe((x) => {
          x.isEditable = true;
          x.isEditMode = false;
          x.view = ViewType.AUTHOR;
          this.blogs.splice(0, 1, x);
        });
        return;
      }
    });
  }

  userLoggedIn: boolean = false;

  ngOnInit() {
    this.GetBlogs();
  }

  private GetBlogs() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');
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
            if (role.name == 'Admin') {
              response.forEach((blog: { view: ViewType; author: any }) => {
                blog.view = ViewType.ADMIN;
              });
              this.blogs = response;
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
              this.blogs = response;
              this.sortFromNewestToOldest();
            }
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
          title: 'New blog',
          content: 'New blog',
          author: role,
          isEditMode: true,
          isEditable: true,
          editOrSave: 'Save',
          view: ViewType.EDIT,
        };
        this.blogs.unshift(blog);
      }
    );
  }
}
