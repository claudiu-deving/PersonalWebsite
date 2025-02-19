import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
@Component({
  selector: "app-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"],
})
export class TagComponent implements OnInit {
  @Input() name: string = "";
  @Input() color: string = "";
  @Input() view: string = "";
  showColorPicker: boolean = false;
  constructor() { }

  @Output() eventEmitter = new EventEmitter<any>();

  ngOnInit() { }

  delete() {
    this.eventEmitter.emit({ name: this.name, action: "delete" });
  }

  changeColor() {
    this.showColorPicker = !this.showColorPicker;
    this.eventEmitter.emit({ name: this.name, color: this.color, action: "changeColor" });
  }
}
