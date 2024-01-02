import { Component, Input, OnInit } from '@angular/core';

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

  ngOnInit() {
  }

  delete(){
    console.log('delete');
  }

}
