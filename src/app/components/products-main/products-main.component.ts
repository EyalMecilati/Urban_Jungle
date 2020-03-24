import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Product } from 'src/app/interfaces/products';
import { Category } from 'src/app/interfaces/Category';
import { ActivatedRoute, Params, Router } from '@angular/router'
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
  public loading: boolean = false;
  public productsByCategory = [];

  constructor(public httpCallService: HttpCallService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private cd: ChangeDetectorRef, private router:Router) { }

  ngOnInit(): void {
    this.productsFromLastOrder = [];
    this.addThisToCart = {}
    this.getProducts();
    this.openCart();
  }

  public getProducts() {
    this.loading = true;
    this.httpCallService.getAllProducts().subscribe(
      res => {
        this.products = res
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
            console.log(err)
          }
        )
      },
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

  public getCartInfoForOpenCart() {
    let user_idNum: Params;
    this.activatedRoute.params.subscribe(
      parmas => user_idNum = parmas
    );
    this.httpCallService.newCart(user_idNum).subscribe(
      res => {
        this.httpCallService.cart = res[0]._id
        this.userCart = res[0].carts_info;
        this.productsFromLastOrder = [];
        this.totlalSumFromOldOrder = 0;
        // total sum and get more information about the products
        for (let i = 0; i < res[0].carts_info.length; i++) {
          this.totlalSumFromOldOrder += this.userCart[i].sum;
          let product1 = this.products.filter(product => product._id == this.userCart[i].prdouct_id);
          let orderProduct = product1[0];
          if (!this.productsFromLastOrder.includes(orderProduct)) {
            this.productsFromLastOrder.push(orderProduct)
          }
        }
        this.loading = false;
      })
  }

  public openCart() {
    this.loading = true
    this.errorMsg = false;
    let user_idNum: Params;


    this.activatedRoute.params.subscribe(
      parmas => user_idNum = parmas
    );
    this.httpCallService.newCart(user_idNum).subscribe(
      res => {
        if (!res.carts_info) {
          this.httpCallService.cart = res[0]._id
          this.userCart = res[0].carts_info;
          this.productsFromLastOrder = [];
          this.totlalSumFromOldOrder = 0;
          // total sum and get more information about the products
          for (let i = 0; i < res[0].carts_info.length; i++) {
            this.totlalSumFromOldOrder += this.userCart[i].sum;
            let product1 = this.products.filter(product => product._id == this.userCart[i].prdouct_id);
            let orderProduct = product1[0];
            if (!this.productsFromLastOrder.includes(orderProduct)) {
              this.productsFromLastOrder.push(orderProduct)
            }
          }
          this.loading = false;
        } else {
          this.loading = false;
          this.addtoCart(res);
        }
      },
      err => {
        this.loading = false;
      }
    )
  }
  // open/close cart
  public toggleCart() {
    this.opened = !this.opened;
  }
  // add item to the cart 

  public addtoCart(res) {
    this.totlalSumFromOldOrder = 0;
    let resultId = res;
    if (res._id) {
      this.httpCallService.cart = res._id;
      resultId = res._id;
    } else {
      this.httpCallService.cart = res[0]._id;
      resultId = res[0]._id;
    }
    this.httpCallService.getCartById(resultId).subscribe(
      result => {
        this.userCart = result[0].carts_info;
        for (let i = 0; i < result[0].carts_info.length; i++) {
          this.totlalSumFromOldOrder += this.userCart[i].sum;
          let product1 = this.products.filter(product => product._id == this.userCart[i].prdouct_id._id);
          let orderProduct = product1[0];
          if (!this.productsFromLastOrder.includes(orderProduct)) {
            this.productsFromLastOrder.push(orderProduct);
          };
        }
      }, err => {
        console.log(err);
      }
    )
  }

  // dialog logic add item to cart
  openDialog(productInfo): void {
    this.errorMsg = false;
    this.addThisToCart = { prdouct_name: productInfo.prdouct_name, price: productInfo.price, prdouct_id: productInfo._id };
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: { prdouct_name: productInfo.prdouct_name, quantity: this.amount, cart: this.httpCallService.cart }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'dontAdd') {
        return this.errorMsg = '';
      } else {
        this.amount = result;
        const sum = this.addThisToCart.price * result;
        const productObj = {
          prdouct_id: this.addThisToCart.prdouct_id,
          quantity: result,
          sum: sum,
          cart_id: this.httpCallService.cart
        }
        const token = localStorage.getItem('token');
        this.httpCallService.addProductToCart(productObj, token).subscribe(
          res => {
            this.addtoCart(res);
          },
          err => {
            return this.errorMsg = 'this item is alredy in your cart you can change the quantity inside your cart';
          }
        );
      }

    });
  }

  public removeProductFromCart(id) {
    this.httpCallService.removeItemFromCart(id, this.httpCallService.cart).subscribe(
      res => {
        this.getCartInfoForOpenCart()
      }, err => console.log(err)
    );
  };

  public removeItemFromCart() {
    this.httpCallService.emptyCart().subscribe(
      res => {
        this.getCartInfoForOpenCart();
      },
      err => console.log(err)
    )
  }

  public gotoOrder() {
    let token = localStorage.getItem('token')
    this.httpCallService.sendOrder(token).subscribe(res => {
      let order_id;
      if (res[1]) {
        order_id = res[res.length - 1]._id;
      }
      else {
        order_id = res[0]._id;
      }
      this.router.navigate(['/order/' + order_id]);
    }, err => {
      this.errorMsg = 'please try again';
    })
  }

}


