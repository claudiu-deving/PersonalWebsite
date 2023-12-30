import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  @Input() inputId: string = '';
  @Input() control = new FormControl();
  @Input() label: string = '';
  constructor() {}
  errorMessages: Record<string, string> = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minlength: 'Please enter at least 3 characters',
  };
  ngOnInit() {}
}
