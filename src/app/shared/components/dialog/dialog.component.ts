import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalService } from 'src/app/auth/services/modal.service';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit() {}

  closeDialog(result: boolean) {
    this.close.emit(result);
  }
}
