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

  constructor(private httpCallService: HttpCallService) { }

  ngOnInit(): void {
    this.getAllOrders();
    this.getProducts();
  }
  // get orders
  public getAllOrders() {
    this.httpCallService.getOrders().subscribe(
      res => {
        this.orders = res;
      },
      err => console.log(err)
    )
  }

  // get products
  public getProducts() {
    this.httpCallService.getAllProducts().subscribe(
      res => {
        this.products = res
      },
      err => console.log(err)
    )
  }
}
