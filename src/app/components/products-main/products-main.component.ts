import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Product } from 'src/app/interfaces/products';
import { Category } from 'src/app/interfaces/Category';

@Component({
  selector: 'app-products-main',
  templateUrl: './products-main.component.html',
  styleUrls: ['./products-main.component.scss']
})
export class ProductsMainComponent implements OnInit {

  public products: Product[];
  public categorys: Category[];
  public searchTerm: string;
  constructor(private httpCallService: HttpCallService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategory();
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


}
