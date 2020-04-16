import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Category } from 'src/app/interfaces/Category';
import { Product } from 'src/app/interfaces/products';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(private httpCallService: HttpCallService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getProducts();

    this.newProductForm = this.formBuilder.group({
      category: ['', [Validators.required]],
      prdouct_name: ['', [Validators.required]],
      price: ['', [Validators.required]]
    })
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

  // public changePrice(id){
  //   let token = localStorage.getItem('token');
  //   this.httpCallService.changePriceOfProduct(id,token).subscribe(res=>{

  //   })

  // }

}
