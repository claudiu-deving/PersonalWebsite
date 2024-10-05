import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-md-demo',
    templateUrl: './md-demo.component.html',
    styleUrls: ['./md-demo.component.scss']
})
export class MdDemoComponent implements OnInit {
    @Input() content: string = '';
    constructor() { }

    ngOnInit(): void {
    }

}