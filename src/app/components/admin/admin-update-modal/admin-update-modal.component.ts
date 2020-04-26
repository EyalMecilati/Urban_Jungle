import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../interfaces/DialogData ';
import { AdminDialog } from 'src/app/interfaces/AdminDialog';

@Component({
  selector: 'app-admin-update-modal',
  templateUrl: './admin-update-modal.component.html',
  styleUrls: ['./admin-update-modal.component.scss']
})
export class AdminUpdateModalComponent implements OnInit {

  public name: string;
  public price: number;
  public propertyCheck: any;

  constructor(public dialogRef: MatDialogRef<AdminUpdateModalComponent>, @Inject(MAT_DIALOG_DATA) public data2: AdminDialog) { }


  ngOnInit(): void {
    this.propertyCheck = this.data2.property;
    this.name = this.data2.prdouct_name;
    this.price = this.data2.price;
  }

}
