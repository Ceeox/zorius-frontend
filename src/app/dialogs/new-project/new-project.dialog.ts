import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewProject } from 'src/models/project';

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project.dialog.html',
  styleUrls: ['./new-project.dialog.scss']
})
export class NewProjectDialog implements OnInit {

  newProjectForm = this.fb.group({
    name: [''],
    description: [''],
    note: [''],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { newProject: NewProject }
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.data.newProject = {
      name: this.newProjectForm.get('name').value,
      description: this.newProjectForm.get('description').value,
      note: this.newProjectForm.get('note').value,
    };
    this.dialogRef.close(this.data.newProject);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
