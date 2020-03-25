import { Component, OnInit, Input } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/products';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-oredr',
  templateUrl: './oredr.component.html',
  styleUrls: ['./oredr.component.scss']
})
export class OredrComponent implements OnInit {

  @Input()
  userCart: any;
  @Input()
  productsFromLastOrder: any;
  @Input()
  totlalSumFromOldOrder: number;

  public orderForm: FormGroup;
  public minDate: Date = new Date();
  public order;
  public opened: boolean = true;
  public sum: number = 0;
  public products: Product[];
  public cities: any = ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beersheba', 'Herzliya', 'Hod HaSharon', 'Holon', 'Raanana', 'Rehovot', 'Tiberias'];


  constructor(public httpCallService: HttpCallService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.getUserOrder();
    this.orderForm = this.formBuilder.group({
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      shippingDate: ['', [Validators.required]],
      creditCard: ['', [Validators.required, Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$')]]
    })
  }

  public toggleCart() {
    this.opened = !this.opened
  }

  public sentOrder() {
    console.log(this.orderForm.value)
  }

  public sendNewOrder() {
    let token = localStorage.getItem('token')
    this.httpCallService.sendOrder(token, this.orderForm.value,this.totlalSumFromOldOrder).subscribe(res => {
      console.log(res)
      let order_id;
      if (res[1]) {
        order_id = res[res.length - 1]._id;
      }
      else {
        order_id = res[0]._id;
      }
    }, err => {
      console.log(err)
    })
  };

}
