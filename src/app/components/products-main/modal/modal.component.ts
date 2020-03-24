import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../interfaces/DialogData ';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: DialogData) { }

  public name: string;
  public quantity: number;
  public cartId: string

  ngOnInit(): void {
    this.name = this.data1.prdouct_name;
    this.quantity = this.data1.amount;
    this.cartId = this.data1.cart
  }


  onNoClick(): void {
    this.dialogRef.close('dontAdd');
  }

}
