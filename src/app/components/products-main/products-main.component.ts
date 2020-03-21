import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Product } from 'src/app/interfaces/products';
import { Category } from 'src/app/interfaces/Category';
import { ActivatedRoute, Params } from '@angular/router'
import { Cart } from 'src/app/interfaces/Cart';

@Component({
  selector: 'app-products-main',
  templateUrl: './products-main.component.html',
  styleUrls: ['./products-main.component.scss']
})
export class ProductsMainComponent implements OnInit {

  public products: Product[];
  public categorys: Category[];
  public searchTerm: string;
  public userCart: Cart;
  public routeId: any;
  public totlalSumFromOldOrder: number = 0;
  public productsFromLastOrder: any[] = [];
  public opened: boolean = true;
  constructor(private httpCallService: HttpCallService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategory();
    this.openCart()
  }
  // get all products
  public getProducts() {
    this.httpCallService.getAllProducts().subscribe(
      res => this.products = res,
      err => console.log(err)
    )
  }
  // get products by category
  public getProductByCategory(id) {
    this.httpCallService.getProductByCategory(id).subscribe(
      res => {
        this.products = res;
      },
      err => console.log(err)
    )
  };

  public getCategory() {
    this.httpCallService.getAllCategory().subscribe(
      res => {
        this.categorys = res;
      },
      err => console.log(err)
    )
  };

  public openCart() {
    let user_idNum: Params;
    this.activatedRoute.params.subscribe(
      parmas => user_idNum = parmas
    );
    this.httpCallService.newCart(user_idNum).subscribe(
      res => {
        this.userCart = res[0].carts_info;
        // total sum and get more information about the products
        for (let info of res[0].carts_info) {
          this.totlalSumFromOldOrder += info.sum;
          let product1 = this.products.filter(product => product._id == info.prdouct_id)
          let orderProduct = product1[0];
          this.productsFromLastOrder.push(orderProduct)
          console.log(this.productsFromLastOrder)
        }
        // 
        console.log(res)
      }, err => console.log(err)
    )
  }

  public toggleCart() {
    this.opened = !this.opened
  }

}
