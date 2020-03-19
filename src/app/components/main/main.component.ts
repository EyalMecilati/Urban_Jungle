import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  };

}
