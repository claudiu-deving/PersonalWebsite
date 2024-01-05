import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  @Input() name: string = '';
  @Input() color:string = '';
  @Input() view:string = '';

  
  constructor() { }


  @Output() eventEmitter = new EventEmitter<any>();

  
  ngOnInit() {
  }

  delete(){
    this.eventEmitter.emit({name: this.name, action: 'delete'});
  }

}
