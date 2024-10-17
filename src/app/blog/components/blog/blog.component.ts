import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BlogPostService } from "src/app/blog/services/blog-service.service";
import { DialogService } from "../../../shared/components/dialog/dialog.service";
import { ViewType } from "../../../shared/types/ViewType.enum";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, map, Observable, of } from "rxjs";
import { ImageService } from "../../services/image.service";

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
  @Input() heroImagePath = '';
  @Input() isPreview = false;
  @Input() slug = '';
  showHeroImage = true;
  publishStatus: PublishOrUnpublish = "Unpublish";
  editOrSave: string = "Edit";
  bsEditorInstance: any;
  templateForm: any;

  constructor(
    private BlogPostService: BlogPostService,
    private dialogService: DialogService,
    private httpClient: HttpClient,
    private imageService: ImageService
  ) { }



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

  onPasteHeroImage($event: ClipboardEvent): void {
    const items = $event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        $event.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          var response = this.imageService.uploadHeroImage(blob, this.id);
          this.heroImagePath = response.filePath;
          this.showHeroImage = response.showHeroImage;

        }
        break;
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) this.imageService.uploadImage(blob, this.content);
        break;
      }
    }
  }


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
  async fileExists(folderPath: string): Promise<boolean> {

    return await this.httpClient.get(folderPath, { responseType: 'text' }).toPromise().then(response => {
      return true;
    }).catch(error => {
      return false;
    });
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