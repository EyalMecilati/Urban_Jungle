import { Component, OnInit } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { User } from 'src/app/interfaces/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss']
})
export class LoginMainComponent implements OnInit {

  public formLogin: FormGroup;
  public user: User;
  public token: string;
  public goToRejister: boolean = false;
  public header: string;
  public errors: string = '';
  public loading: boolean = false; 

  constructor(public httpCallService: HttpCallService, private fBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.tokenCheck();
    this.formLogin = this.fBuilder.group({
      idNum: ["", [Validators.required]],
      passwordRow: ['', Validators.required]
    })
  }

  public tokenCheck() {
    this.loading = true
    this.token = localStorage.getItem('token');
    this.httpCallService.checkEntry(this.token).subscribe(
      res => {
        this.loading = false;
        this.httpCallService.headerCheck = true;
        // dont have a cart
        if (res.errors == 'dont have a cart yet') {
          this.httpCallService.storeInfoTotalSum = null;
          this.header = 'Start shopping'

          // cart is empty
        } else if (res.errors == 'couldnt find a cartinfo') {
          this.header = 'Continue shopping'
          this.httpCallService.storeInfoTotalSum = null;
        } else if (res.errors == 'no err') {
          // have a cart with products
          this.header = 'Continue shopping'
          let totalSum = 0
          for (let info of res.cartsInfo) {
            totalSum += info.sum;
          };
          this.httpCallService.openCartFrom = res.cart.date
          this.httpCallService.storeInfoTotalSum = totalSum;
          // first order
        } else if (res.errors = 'dont have a last order') {
          this.header = 'start your first order'
          this.httpCallService.storeInfoTotalSum = null;
        }
      },
      err => {
        this.loading = false;
        // hide open order text in store info
        this.httpCallService.storeInfoTotalSum = null;
        this.httpCallService.headerCheck = false;
      }
    )

  }

  public login() {
    this.httpCallService.getToken(this.formLogin.value).subscribe(
      res => {
        this.errors = '';
        this.token = res;
        localStorage.setItem('token', res)
        this.tokenCheck();
      },
      err => {
        this.httpCallService.storeInfoTotalSum = null;
        this.errors = 'wrong id number or password'
        this.httpCallService.headerCheck = false;
      }
    );
  };

  public checkAndEnterShop(): void {
    this.token = localStorage.getItem('token');
    this.httpCallService.checkEntry(this.token).subscribe(
      res => {
        this.router.navigate(['/products/' + res.idNum]);
      },
      err => {
        this.errors = 'not authorised'
      }
    )
  };

  public changeGoToRejister() {
    this.router.navigate(['/rejister']);
  }

}
