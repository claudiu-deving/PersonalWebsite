import { Component, OnInit } from '@angular/core';
import { BlogPostService } from 'src/app/blog-service.service';
import { AuthentificationAuthorizationService } from '../AuthentificationAuthorization.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  blogs: any;
  private eventSubscription: Subscription;
  constructor(
    private BlogPostService: BlogPostService,
    private AuthentificationAuthorizationService: AuthentificationAuthorizationService
  ) {
    this.eventSubscription =
      this.AuthentificationAuthorizationService.eventObservable.subscribe(
        (data: Observable<any>) => {
          this.authentificationChanged(data);
        }
      );
  }

  private authentificationChanged(data: Observable<any>) {
    if (data != null) {
      this.BlogPostService.getBlogs().subscribe((response) => {
        this.blogs = response;
        console.log('Blogs retrieved');
      });
    } else {
      this.blogs = null;
      console.log('Blogs cleared');
    }
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
    this.BlogPostService.getBlogs().subscribe((response) => {
      this.blogs = response;
    });
  }
}
