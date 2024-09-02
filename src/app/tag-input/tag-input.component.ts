import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent implements OnInit {

  constructor(public api: ApiService) {}
  options: string[] = ['Opción 1', 'Opción 2', 'Opción 3'];
  selectedOption: string = '';
  ngOnInit() {
    this.api.Fetchsito();
  }
  
}