import { Component, OnInit, Input } from "@angular/core";
import { BlogPostService } from "src/app/blog/services/blog-service.service";
import { DialogService } from "../../../shared/components/dialog/dialog.service";
import { ViewType } from "../../../shared/types/ViewType.enum";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  @Input() content = "Enter here the content of the blog post";
  @Input() title = "Blogpost title";
  @Input() author = "Author";
  @Input() view: ViewType = ViewType.GUEST;
  @Input() created: string = new Date().toDateString();
  @Input() modified: string = new Date().toDateString();
  @Input() isEditable: boolean = false;
  @Input() id: number = 0;
  @Input() isApproved: boolean = false;
  @Input() isEditMode = false;
  @Input() category: string = "Personal Website";
  @Input() tags: any[] = [];

  publishStatus: PublishOrUnpublish = "Unpublish";
  editOrSave: string = "Edit";
  bsEditorInstance: any;
  templateForm: any;
  private apiUrl = environment.apiUrl;
  private imageDirectory = environment.imageDirectory;
  public toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.getContent();
      this.editOrSave = "Save";
    } else {
      console.log(this.content);
      this.BlogPostService.update(
        this.id,
        this.title,
        this.content,
        this.category,
        this.tags
      );
      this.editOrSave = "Edit";
    }
  }
  onReady() {

  }

  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    console.log("paste" + items);
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) this.uploadImage(blob);
        break;
      }
    }
  }

  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('image', file);

    this.http.post<{ filename: string }>(this.apiUrl + '/upload-image', formData).subscribe(
      response => {
        const imageUrl = this.imageDirectory + response.filename;
        const markdownImage = `![](${imageUrl})`;
        this.insertTextAtCursor(markdownImage);
      },
      error => {
        console.error('Error uploading image:', error);
        // Handle error (e.g., show a notification to the user)
      }
    );
  }

  insertTextAtCursor(text: string): void {
    const textarea = document.querySelector('.blog-edit-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = this.content.substring(0, startPos);
    const textAfter = this.content.substring(endPos, this.content.length);

    this.content = textBefore + text + textAfter;
    textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
    textarea.focus();
  }
  constructor(
    private BlogPostService: BlogPostService,
    private dialogService: DialogService,
    private http: HttpClient
  ) { }
  getContent() {
    if (this.id === 0 || this.id == undefined) return;
    this.BlogPostService.getBlog(this.id).subscribe((x) => {
      this.content = x.content;
    });
  }
  ngOnInit() {
    if (this.isEditMode) {
      this.editOrSave = "Save";
    } else {
      this.editOrSave = "Edit";
    }
    this.getContent();
    if (this.isApproved) {
      this.publishStatus = "Unpublish"
    } else {
      this.publishStatus = "Publish"
    }

  }

  delete() {
    this.dialogService.open().subscribe((result) => {
      if (result) {
        this.BlogPostService.delete(this.id);
      }
    });
  }

  approve() {
    if (this.publishStatus == "Publish") {
      this.BlogPostService.publish(this.id);
      this.publishStatus = "Unpublish";
    } else {
      this.BlogPostService.unpublish(this.id);
      this.publishStatus = "Publish";
    }
  }

  receiveData($event: any) {
    this.tags = this.tags.filter((tag) => tag.name !== $event.name);
  }
}
type PublishOrUnpublish = "Publish" | "Unpublish";