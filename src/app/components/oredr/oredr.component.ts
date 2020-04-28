import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { Product } from 'src/app/interfaces/products';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router'



@Component({
  selector: 'app-oredr',
  templateUrl: './oredr.component.html',
  styleUrls: ['./oredr.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OredrComponent implements OnInit {

  @Input()
  userCart: any;
  @Input()
  productsFromLastOrder: any;
  @Input()
  totlalSumFromOldOrder: number;
  @Input()
  userInfo: User;

  public orderForm: FormGroup;
  public minDate: Date = new Date();
  public opened: boolean = true;
  public products: Product[];
  public cities: any = ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beersheba', 'Herzliya', 'Hod HaSharon', 'Holon', 'Raanana', 'Rehovot', 'Tiberias'];
  public uInfo: User;
  public toManyDelivery: any[] = [];
  public invalidDates = {};
  public searchTerm: string;
  public download: boolean = false;

  constructor(public httpCallService: HttpCallService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.download = false;
    this.filterDate();
    this.uInfo = this.userInfo
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

  public myFilter = (d): boolean => {

    return !this.invalidDates[d._d];
  }

  public dateClass = (d) => {
    return this.invalidDates[d._d] ? 'highlight-dates' : undefined;
  }



  public sendNewOrder() {
    let token = localStorage.getItem('token')
    this.httpCallService.sendOrder(token, this.orderForm.value, this.totlalSumFromOldOrder).subscribe(res => {
      let order_id;
      if (res[1]) {
        order_id = res[res.length - 1]._id;
      }
      else {
        order_id = res[0]._id;
      }
      this.download = true
    }, err => {
      console.log(err)
    })
  };

  public setUserInfo() {
    this.orderForm.patchValue({
      city: this.uInfo.city,
      street: this.uInfo.street
    })
  }

  public filterDate() {
    this.toManyDelivery = [];
    this.httpCallService.getOrders().subscribe(
      res => {
        for (let order of res) {
          let dateCheck = order.date_for_delivery;
          let datecjeckSetting = new Date(dateCheck);
          if (!this.toManyDelivery.includes(datecjeckSetting)) {
            let count = this.countInArray(res, datecjeckSetting);
            this.toManyDelivery.push(datecjeckSetting)
            if (count >= 3) {
              this.invalidDates = {
                ...this.invalidDates,
                [`${datecjeckSetting}`]: true
              }
            }
          }
        }
      }
    )
  }

  public countInArray(orders, date) {
    let count = 0;
    for (let order of orders) {
      let dateCheck2 = order.date_for_delivery;
      let datecjeckSetting = new Date(dateCheck2).getDay();
      let datecjeckSetting2 = new Date(date).getDay();
      if (datecjeckSetting == datecjeckSetting2) {
        count++;
      }
    }
    return count;
  }

  public gotoOrder() {
    this.httpCallService.openOrder = !this.httpCallService.openOrder;
  };

  public downloadReceiptToTxtFile() {
    for (let i = 0; i < this.productsFromLastOrder.length; i++) {
      this.productsFromLastOrder[i] = { ...this.productsFromLastOrder[i], quantity: this.userCart[i].quantity }
    }
    this.httpCallService.downloadReceipt(this.productsFromLastOrder, this.totlalSumFromOldOrder).subscribe(
      res => {
        saveAs(res, "receipt.txt")
        this.httpCallService.emptyCart().subscribe(
          res=>{
            this.router.navigate((['/welcome-to-the-jungle']))
          }
        )
      }, err => {
        console.log(err)
      }
    )
  }

}
