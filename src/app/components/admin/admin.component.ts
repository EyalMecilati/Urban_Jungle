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
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public productsByCategory = [];
  public products: Product[];
  public categorys: Category[];
  public loading: boolean = true;
  public newProductForm: FormGroup;
  public opened: boolean = true
  public fileSelected: any;
  public imageUploadedCheck: boolean = false;
  public fileName: string = '';
  public categoryPickedId: string;
  public updateThisProductImg: Product = null;

  constructor(private httpCallService: HttpCallService, private formBuilder: FormBuilder, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    // check if its really anadmin 
    this.checkAdminToken()
    this.getProducts();
// form for a new product 
    this.newProductForm = this.formBuilder.group({
      category: ['', [Validators.required]],
      prdouct_name: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });

  };
// check admin
  public checkAdminToken() {
    this.loading = true;
    this.httpCallService.adminCheck().subscribe(
      res => {
        this.loading = false;
      }, err => {
        if(err.error.text == "good to go"){
          this.loading = false;
        }else{
          this.router.navigate(['/welcome-to-the-jungle']);
        }
      }
      )
      this.loading = false;
  }

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
    this.loading = true;
    const token = localStorage.getItem('token')
    this.httpCallService.removeProduct(id, token).subscribe(res => {
      this.loading = false;
    },
      err => {
        if (err.statusText == "Created") {
          this.getProducts();
          this.loading = false;
        }
      })
  }

// pick an image and save its data in var fileSelected
  public pickImage(e) {
    this.fileSelected = e.target.files[0];
    this.fileName = this.fileSelected.name
    this.imageUploadedCheck = true;
  }
// upload the image to the server before adding the all new product information
  public uploadImage() {
    this.loading = true;
    const imageData = new FormData();
    imageData.append('file', this.fileSelected);
    const token = localStorage.getItem('token');
    this.httpCallService.adminAddImage(imageData).subscribe(
      res => {
        this.loading = false;
      }, err => {
        if (err.status == 201) {
          this.httpCallService.adminAddProduct({ ...this.newProductForm.value, name: this.fileSelected.name }).subscribe(
            res => {
              this.getProducts();
              this.loading = false;
            }, err => {
              if (err.status == 201) {
                this.getProducts();
                this.loading = false;

              }
            }
          )
        }
      }
    )
  }
// open the form for an image update + openning the side menu where the form is 
  public openUpdateForm(productPicked) {
    this.updateThisProductImg = productPicked;
    this.opened = true
  }

  public updateImage(id) {
    this.loading = true;
    const imageData = new FormData();
    imageData.append('file', this.fileSelected);
    const token = localStorage.getItem('token');
    this.httpCallService.updateImg(id, imageData).subscribe(
      res => {
        this.getProducts();
        this.loading = false;
      }, err => {
        console.log(err)
        if (err.status == 201) {
          this.loading = false;
        }
      }
    )
    this.updateThisProductImg = null;
  }
// open dialog for an product details update (without the image)
  openDialog(product, whatToUpdate): void {
    const dialogRef = this.dialog.open(AdminUpdateModalComponent, {
      width: '250px',
      data: { price: product.price, prdouct_name: product.prdouct_name, property: whatToUpdate }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'dontUpdate') {
        return
      } else {
        let updateObj = { [whatToUpdate]: result }
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
// change the product category
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
