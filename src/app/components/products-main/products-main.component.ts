import { Component, OnInit, Inject } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Product } from 'src/app/interfaces/products';
import { Category } from 'src/app/interfaces/Category';
import { ActivatedRoute, Params } from '@angular/router'
import { Cart } from 'src/app/interfaces/Cart';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../interfaces/DialogData ';
import { ModalComponent } from './modal/modal.component';


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
  public amount: number = 0;
  public addThisToCart: any;
  public cart: any;
  public errorMsg: any = false

  constructor(private httpCallService: HttpCallService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.productsFromLastOrder = [];
    this.addThisToCart = {}
    this.getProducts();
    this.getCategory();
    this.openCart();
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
    this.errorMsg = false;
    let user_idNum: Params;
    this.activatedRoute.params.subscribe(
      parmas => user_idNum = parmas
    );
    this.httpCallService.newCart(user_idNum).subscribe(
      res => {
        console.log(res)
        if (res[0].carts_info[0] !== undefined) {
          this.httpCallService.cart = res[0]._id
          console.log(this.cart)
          this.userCart = res[0].carts_info;
          // total sum and get more information about the products
          for (let i = 0; i < res[0].carts_info.length; i++) {
            this.totlalSumFromOldOrder += res[0].carts_info[i].sum;
            let product1 = this.products.filter(product => product._id == res[0].carts_info[i].prdouct_id);
            let orderProduct = product1[0];
            if (this.productsFromLastOrder.includes(orderProduct)) {
              console.log(orderProduct)
            } else {
              this.productsFromLastOrder.push(orderProduct)
            }
            console.log(this.productsFromLastOrder)
          }
        } else {
          this.addtoCart(res)
          console.log(res)
          console.log(this.cart)
        }
      }, err => console.log(err)
    )
  }
  // open/close cart
  public toggleCart() {
    this.opened = !this.opened
  }
  // add item to the cart 

  public addtoCart(res) {
    this.totlalSumFromOldOrder = 0; 
    let resultId = res;
    console.log(res)
    if (res._id) {
      this.httpCallService.cart = res._id
      resultId = res._id
      console.log(resultId)
    } else {
      this.httpCallService.cart = res[0]._id
      resultId = res[0]._id
      console.log(resultId)
    }
    this.httpCallService.getCartById(resultId).subscribe(
      result => {
        // console.log(result)
        this.userCart = result[0].carts_info;
        for (let i = 0; i < result[0].carts_info.length; i++) {
          console.log(i)
          this.totlalSumFromOldOrder += result[0].carts_info[i].sum;
          let product1 = this.products.filter(product => product._id == result[0].carts_info[i].prdouct_id._id)
          let orderProduct = product1[0];
          console.log(orderProduct)
          if (this.productsFromLastOrder.includes(orderProduct)) {

            console.log(this.productsFromLastOrder)
          } else {
            this.productsFromLastOrder.push(orderProduct)
          }
        }
      }, err => console.log(err)
    )
  }

  // dialog logic add item to cart
  openDialog(productInfo): void {
    console.log(productInfo)
    this.addThisToCart = { prdouct_name: productInfo.prdouct_name, price: productInfo.price, prdouct_id: productInfo._id }
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: { prdouct_name: productInfo.prdouct_name, quantity: this.amount, cart: this.httpCallService.cart }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.amount = result;
      console.log(result)
      const sum = this.addThisToCart.price * result
      const productObj = {
        prdouct_id: this.addThisToCart.prdouct_id,
        quantity: result,
        sum: sum,
        cart_id: this.httpCallService.cart
      }
      console.log(this.cart, this.userCart)
      const token = localStorage.getItem('token');
      this.httpCallService.addProductToCart(productObj, token).subscribe(
        res => {
          console.log(res, 'f')
          this.addtoCart(res);
        },
        err => {
          console.log(err, 'ffffff')
          return this.errorMsg = 'this item is alredy in your cart you can change the amount inside your cart'
        }
      )

    });
  }

}


