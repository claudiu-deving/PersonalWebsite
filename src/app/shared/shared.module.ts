import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedComponent } from "./shared.component";
import { InputComponent } from "./components/input/input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchableComboboxComponent } from "./components/searchable-combobox/searchable-combobox.component";
import { FilterPipe } from "./pipes/filter.pipe";
import { LogoComponent } from "./components/logo/logo.component";
import { ScrollSlideComponent } from "./components/scroll-slide/scroll-slide.component";
import { NotificationService } from "./services/notification.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSnackBarModule],
  declarations: [
    SharedComponent,
    InputComponent,
    SearchableComboboxComponent,
    FilterPipe,
    LogoComponent,
    ScrollSlideComponent,
  ],
  exports: [
    InputComponent,
    SearchableComboboxComponent,
    LogoComponent,
    ScrollSlideComponent,
  ],
})
export class SharedModule {}
