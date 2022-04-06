import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  options: FormGroup;
  currentPath = '';

  constructor(private router: Router, fb: FormBuilder) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0,
    });
    this.currentPath = this.router.url;
  }
}
