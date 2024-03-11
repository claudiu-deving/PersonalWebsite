import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContactComponent } from "./contact.component";
import { ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "../shared/components/input/input.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  declarations: [ContactComponent],
})
export class ContactModule { }
