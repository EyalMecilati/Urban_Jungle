import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Order } from 'src/app/interfaces/Order';
import { Product } from 'src/app/interfaces/products';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss']
})
export class StoreInfoComponent implements OnInit {

  public orders: Order[];
  public products: Product[];
  public ordersNum: number;
  public productsNum: number;
  public lastOrderDate: Date = null;
  public lastOrderSum: number = null;

  constructor(public httpCallService: HttpCallService) { }

  ngOnInit(): void {
    this.getAllOrders();
    this.getProducts();
  }

  // get orders
  public getAllOrders() {
    this.httpCallService.getOrders().subscribe(
      res => {
        this.orders = res;
        this.ordersNum = res.length
      },
      err => console.log(err)
    )
  }

  // get products
  public getProducts() {
    this.httpCallService.getAllProducts().subscribe(
      res => {
        this.products = res
        // this.httpCallService.products = res;
        this.productsNum = res.length
      },
      err => console.log(err)
    )
  }

  // public getUserLastOrder() {
  //   const token = localStorage.getItem('token');
  //   this.httpCallService.getLastOrderOfUser(token).subscribe(
  //     res => {
  //       if (res[0]) {
  //         console.log(res[0])
  //         this.lastOrderDate = res[0].date_of_order;
  //         this.lastOrderSum = res[0].total_sum
  //       } else {
  //         this.lastOrderDate = null;
  //         this.lastOrderSum = null;
  //       }
  //     },err=>{
  //       this.lastOrderDate = null;
  //       this.lastOrderSum = null;
  //     }
  //   )
  // }

  ngOnDestroy(): void {
    this.lastOrderDate = null;
    this.lastOrderSum = null;
  }


}
