import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/products';

@Component({
  selector: 'app-oredr',
  templateUrl: './oredr.component.html',
  styleUrls: ['./oredr.component.scss']
})
export class OredrComponent implements OnInit {

  public order;
  public opened: boolean = true;
  public sum: number = 0;
  public products: Product[]; 
  public cities: any = ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beersheba', 'Herzliya', 'Hod HaSharon', 'Holon', 'Raanana', 'Rehovot', 'Tiberias'];


  constructor(public httpCallService: HttpCallService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserOrder();
  }

  public getTotalSum(): number {
    console.log(this.order)
    for (let price of this.order.cart_id.carts_info) {
      this.sum += price.sum;
    };
    return this.sum
  };

  public getUserOrder() {
    let order_id: Params;
    this.activatedRoute.params.subscribe(
      parmas => order_id = parmas
    );
    this.httpCallService.getOneOrder(order_id).subscribe(
      res => {
        if (res[1]) {
          this.order = res[res.length - 1];
        }
        else {
          this.order = res[0];
        }
        if (this.order == undefined) {
          return
        } else {
          this.getTotalSum();
          this.getProduct();
        }
      }, err => {
        console.log(err)
      }
    )
  };

  public getProduct() {
    this.products = [];
    this.httpCallService.getAllProducts().subscribe(
      res => {
        console.log(res)
        for(let product of this.order.cart_id.carts_info){
          let productCheck = res.filter(prod => prod._id == product.prdouct_id)
          this.products.push(productCheck[0]);
        }
      }, err => console.log(err)
    )
  }

}
