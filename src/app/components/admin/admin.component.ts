import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Category } from 'src/app/interfaces/Category';
import { Product } from 'src/app/interfaces/products';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../interfaces/DialogData ';
import { AdminUpdateModalComponent } from '../admin/admin-update-modal/admin-update-modal.component'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public productsByCategory = [];
  public products: Product[];
  public categorys: Category[];
  public loading: boolean = false;
  public newProductForm: FormGroup;
  public opened: boolean = true
  public fileSelected: any;
  public imageUploadedCheck: boolean = false;
  public fileName: string = '';
  public categoryPickedId: string;
  public updateThisProductImg: Product = null;

  constructor(private httpCallService: HttpCallService, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProducts();

    this.newProductForm = this.formBuilder.group({
      category: ['', [Validators.required]],
      prdouct_name: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });

  };

  public toggleCart() {
    this.opened = !this.opened
  }

  public getProducts() {
    this.productsByCategory = [];
    this.loading = true;
    this.httpCallService.getAllProducts().subscribe(
      res => {
        this.products = res;
        this.httpCallService.getAllCategory().subscribe(
          result => {
            this.categorys = result;
            for (let cat of result) {
              let filterProduct = res.filter(prod => prod.category_id._id == cat._id)
              if (filterProduct[0]) {
                this.productsByCategory.push(filterProduct)
              }
            }
            this.loading = false;
          },
          err => {
            console.log(this.productsByCategory)
            this.loading = false;
          }
        )
      },
      err => {
        this.loading = false;
      }
    )
  }

  public deleteProduct(id) {
    const token = localStorage.getItem('token')
    this.httpCallService.removeProduct(id, token).subscribe(res => {
      console.log(res)
    },
      err => {
        if (err.statusText == "Created") {
          this.getProducts();
        }
      })
  }


  public pickImage(e) {
    this.fileSelected = e.target.files[0];
    this.fileName = this.fileSelected.name
    this.imageUploadedCheck = true;
  }

  public uploadImage() {
    const imageData = new FormData();
    imageData.append('file', this.fileSelected);
    const token = localStorage.getItem('token');
    this.httpCallService.adminAddImage(imageData).subscribe(
      res => {
        console.log(res)
      }, err => {
        if (err.status == 201) {
          this.httpCallService.adminAddProduct({ ...this.newProductForm.value, name: this.fileSelected.name }).subscribe(
            res => {
              this.getProducts();
            }, err => {
              if (err.status == 201) {
                this.getProducts();
              }
            }
          )
        }
      }
    )
  }

  public openUpdateForm(productPicked) {
    this.updateThisProductImg = productPicked;
  }

  public updateImage(id) {
    const imageData = new FormData();
    imageData.append('file', this.fileSelected);
    const token = localStorage.getItem('token');
    this.httpCallService.updateImg(id, imageData).subscribe(
      res => {
        this.getProducts();
      }, err => {
        console.log(err)
        if (err.status == 201) {
          console.log('object')
        }
      }
    )
    this.updateThisProductImg = null;
  }

  openDialog(product, whatToUpdate): void {
    let updateProperty = '';
    switch (whatToUpdate) {
      case 'price':
        updateProperty = 'price'
        break;
      case 'category_id':
        updateProperty = 'category_id'
        break;
      case 'prdouct_name':
        updateProperty = 'prdouct_name'
        break;
    }
    const dialogRef = this.dialog.open(AdminUpdateModalComponent, {
      width: '250px',
      data: { price: product.price, prdouct_name: product.prdouct_name, property: updateProperty }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'dontUpdate') {
        return
      } else {
        let updateObj = { [updateProperty]: result }
        return this.httpCallService.updateProductWithOutImage(updateObj, product._id).subscribe(
          res => {
            this.getProducts();
          }, err => {
            console.log(err)
          }
        )
      }
    })
  }

  public changeCategory(id) {
    let updateObj = { category_id: this.categoryPickedId }
    return this.httpCallService.updateProductWithOutImage(updateObj, id).subscribe(
      res => {
        this.getProducts();
        this.categoryPickedId = '';
      }, err => {
        console.log(err)
      }
    )
  }


}
