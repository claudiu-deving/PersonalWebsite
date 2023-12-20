import { Component, OnInit } from '@angular/core';
import { BlogPostService } from 'src/app/blog-service.service';
import { AuthentificationAuthorizationService } from '../auth/services/AuthentificationAuthorization.service';

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
    if (username != null) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.BlogPostService.getBlogs().subscribe((response) => {
      if (username == null) {
        this.blogs = response.filter(
          (x: { isApproved: boolean }) => x.isApproved
        );
        this.sortFromNewestToOldest();
        return;
      }
      this.AuthentificationAuthorizationService.isAdmin(username).subscribe(
        (isAdmin) => {
          response.forEach(
            (blog: {
              author: any;
              isEditable: boolean;
              isApproved: boolean;
              isApprovable: boolean;
            }) => {
              if (blog.author.username == username) {
                blog.isEditable = true;
              }
              if (isAdmin) {
                blog.isEditable = true;
                blog.isApprovable = true;
              }
            }
          );

          this.blogs = response;
          this.sortFromNewestToOldest();
        }
      );
    });
  }

  private sortFromNewestToOldest() {
    this.blogs.sort((a: { modified: Date }, b: { modified: Date }) => {
      return new Date(b.modified).getTime() - new Date(a.modified).getTime();
    });
  }

  createBlog() {
    let blog = {
      title: 'New blog',
      content: 'New blog',
      isEditMode: true,
      isEditable: true,
    };

    this.blogs.unshift(blog);
  }
}
