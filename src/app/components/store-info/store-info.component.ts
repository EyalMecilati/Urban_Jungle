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
        this.productsNum = res.length
      },
      err => console.log(err)
    )
  }

  ngOnDestroy(): void {
    this.lastOrderDate = null;
    this.lastOrderSum = null;
  }


}
