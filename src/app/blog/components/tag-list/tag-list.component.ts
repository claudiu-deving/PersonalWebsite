import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TagsService } from "../../services/tags.service";
import { BlogPostService } from "../../services/blog-service.service";
@Component({
  selector: "app-tag-list",
  templateUrl: "./tag-list.component.html",
  styleUrls: ["./tag-list.component.scss"],
})
export class TagListComponent implements OnInit {
  @Input() tags: any[] = [];
  @Input() parentBlogId: number = 0;
  @Input() view: string = "";
  searchTerm: string = "";
  constructor(private TagsService: TagsService, private BlogService: BlogPostService) { }

  ngOnInit() {
    this.TagsService.getTags().subscribe((data: any) => {
      this.tags = data ?? [];
      this.receiveData(this.tags);
    });
  }
  @Output() eventEmitter = new EventEmitter<any>();

  addTag() {
    this.TagsService.addTag(this.searchTerm, "", "#000000").subscribe((data: any) => {
      this.BlogService.update(this.parentBlogId, "", "", "", [...this.tags, data]);
    });
  }

  searchTermChanged($event: any) {
    this.searchTerm = $event.value;
  }

  receiveData($event: any) {
    this.eventEmitter.emit($event);
    switch ($event.action) {
      case "changeColor":
        this.tags.find(tag => tag.name == $event.name).color = $event.color;
        this.TagsService.updateTag(this.tags.find(tag => tag.name == $event.name)).subscribe();
        break;
      case "delete":
        this.tags = this.tags.filter(tag => tag.name != $event.name);
        this.BlogService.update(this.parentBlogId, "", "", "", this.tags);
        break;
    }
  }
}
