import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogPostService } from 'src/app/blog/services/blog-service.service';
import { Parser } from '../../services/parsing/parser';
import { DialogService } from '../../../shared/components/dialog/dialog.service';
import { ViewType } from '../../../shared/types/ViewType.enum';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  @Input() content = 'Enter here the content of the blog post';
  @Input() title = 'Blogpost title';
  @Input() author = 'Author';
  @Input() view: ViewType = ViewType.GUEST;
  @Input() created: string = new Date().toDateString();
  @Input() modified: string = new Date().toDateString();
  @Input() isEditable: boolean = false;
  @Input() id: number = 0;
  @Input() isApprovable: boolean = false;
  @Input() isApproved: boolean = false;
  @Input() isEditMode = false;
  @Input() category: string = 'Personal Website';
  @Input() tags: any[] = [];
  parsedContent: SafeHtml = '';
  editOrSave: string = 'Edit';
  public toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.getContent();
      this.editOrSave = 'Save';
    } else {
      this.BlogPostService.update(this.id, this.title, this.unparsedContent, this.category);
      this.editOrSave = 'Edit';
    }
  }

  constructor(
    private sanitizer: DomSanitizer,
    private BlogPostService: BlogPostService,
    private parser: Parser,
    private dialogService: DialogService
  ) {}
  getSafeHtmlContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  unparsedContent: string = 'Enter here the content of the blog post';
  getContent() {
    if (this.id === 0 || this.id == undefined) return;
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
    if (this.isEditMode) {
      this.editOrSave = 'Save';
    } else {
      this.editOrSave = 'Edit';
    }
    this.getContent();
  }

  delete() {
    this.dialogService.open().subscribe((result) => {
      if (result) {
        this.BlogPostService.delete(this.id);
      }
    });
  }

  approve() {
    this.BlogPostService.approve(this.id);
  }
}
