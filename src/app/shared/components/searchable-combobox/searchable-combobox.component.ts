import { Component, OnInit } from "@angular/core";
import { FilterPipe } from "../../pipes/filter.pipe";
@Component({
  selector: "app-searchable-combobox",
  templateUrl: "./searchable-combobox.component.html",
  styleUrls: ["./searchable-combobox.component.scss"],
})
export class SearchableComboboxComponent implements OnInit {
  options: string[] = ["option1", "option2", "option3"];
  searchTerm: string = "";
  display: string = "none";
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
