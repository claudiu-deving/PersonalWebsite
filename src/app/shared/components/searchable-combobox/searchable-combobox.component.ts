import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterPipe } from "../../pipes/filter.pipe";
@Component({
  selector: "app-searchable-combobox",
  templateUrl: "./searchable-combobox.component.html",
  styleUrls: ["./searchable-combobox.component.scss"],
})
export class SearchableComboboxComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() searchTerm: string = "";
  display: string = "none";
  @Output() searchTermChanged = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  selectOption(option: any) {
    this.searchTerm = option;
  }

  toggleDisplay() {
    if (this.display == "none") {
      this.display = "block";
    } else {
      this.display = "none";
    }
  }
}
