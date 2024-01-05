import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedComponent } from "./shared.component";
import { InputComponent } from "./components/input/input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchableComboboxComponent } from "./components/searchable-combobox/searchable-combobox.component";
import { FilterPipe } from "./pipes/filter.pipe";
import { LogoComponent } from "./components/logo/logo.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    SharedComponent,
    InputComponent,
    SearchableComboboxComponent,
    FilterPipe,
    LogoComponent,
  ],
  exports: [InputComponent, SearchableComboboxComponent, LogoComponent],
})
export class SharedModule {}
