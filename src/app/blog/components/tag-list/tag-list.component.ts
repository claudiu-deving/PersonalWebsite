import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-tag-list",
  templateUrl: "./tag-list.component.html",
  styleUrls: ["./tag-list.component.scss"],
})
export class TagListComponent implements OnInit {
  @Input() tags: any[] = [];
  @Input() parentBlogId: number = 0;
  @Input() view: string = "";
  options: string[] = ["option1", "option2", "option3"];
  constructor() {}

  ngOnInit() {}
  @Output() eventEmitter = new EventEmitter<any>();

  addTag() {
    console.log("addTag");
  }

  receiveData($event: any) {
    this.eventEmitter.emit($event);
  }
}
