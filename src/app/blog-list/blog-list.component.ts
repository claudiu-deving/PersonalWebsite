import { Component, OnInit } from '@angular/core';
import { BlogPostService } from 'src/app/blog-service.service';
import { AuthentificationAuthorizationService } from '../auth/services/AuthentificationAuthorization.service';
import { Observable, Subscription } from 'rxjs';
import { LoginFormComponent } from '../auth/components/login-form/login-form.component';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  blogs: any;
  constructor(
    private BlogPostService: BlogPostService,
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) {
    AuthentificationAuthorizationService.eventObservable.subscribe((event) => {
      this.GetBlogs();
    });
  }

  copyToClipboard(element: HTMLElement): void {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);
    document.execCommand('copy');
    console.debug('Copy pressed!');
    selection!.removeAllRanges();
  }
  ngOnInit() {
    this.GetBlogs();
  }

  private GetBlogs() {
    this.BlogPostService.getBlogs().subscribe((response) => {
      const username = localStorage.getItem('username');
      if (username == null) {
        this.blogs = response.filter(
          (x: { isApproved: boolean }) => x.isApproved
        );
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
        }
      );
    });
  }

  createBlog() {
    const username = localStorage.getItem('username');

    let userId = '';
    this.AuthentificationAuthorizationService.getUserId(username!).subscribe(
      (x) => {
        userId = x;
        this.BlogPostService.create('New blog', 'New blog', userId);
      }
    );
  }
}
