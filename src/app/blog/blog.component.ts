import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogPostService } from 'src/app/blog-service.service';
import { Parser } from '../utils/parsing/parser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  @Input() content = '';
  @Input() title = '';
  @Input() date_value: string = new Date().toDateString();
  @Input() isEditable: boolean = false;
  @Input() id: number = 0;
  @Input() isApprovable: boolean = false;
  @Input() isApproved: boolean = false;
  isEditMode = false;
  parsedContent: SafeHtml = '';

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.getContent();
    } else {
      this.BlogPostService.update(this.id, this.title, this.unparsedContent);
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

  constructor(
    private sanitizer: DomSanitizer,
    private BlogPostService: BlogPostService,
    private parser: Parser
  ) {}
  getSafeHtmlContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  unparsedContent: string = '';
  getContent() {
    this.BlogPostService.getBlog(this.id).subscribe((x) => {
      let content: string = x.content;
      this.content = this.parser.parse(content);
      this.parsedContent = this.getSafeHtmlContent(this.content);
      this.unparsedContent = content;
    });
  }

  refresh(unescaped: string) {
    this.parsedContent = this.getSafeHtmlContent(this.parser.parse(unescaped));
  }

  ngOnInit() {
    this.getContent();
  }

  delete() {
    this.BlogPostService.delete(this.id);
  }

  approve() {
    this.BlogPostService.approve(this.id);
  }
}
