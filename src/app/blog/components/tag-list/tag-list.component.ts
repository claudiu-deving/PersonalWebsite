import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  @Input() tags: any[] = [];
  @Input() parentBlogId: number = 0;
  @Input() view: string = '';
  constructor() { }

  ngOnInit() {
  }
  addTag(){
    console.log('addTag');
  }
}
