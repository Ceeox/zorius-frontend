import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface NewProjectDialogData {
  name: string;
  note?: string;
}

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project.dialog.html',
  styleUrls: ['./new-project.dialog.scss'],
})
export class NewProjectDialog implements OnInit {
  newProjectForm = this.fb.group({
    name: [''],
    note: [''],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewProjectDialogData
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.data = {
      name: this.newProjectForm.get('name').value,
      note: this.newProjectForm.get('note').value,
    };
    this.dialogRef.close(this.data);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
