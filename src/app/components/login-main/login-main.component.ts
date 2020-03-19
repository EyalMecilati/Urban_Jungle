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

  public headerCheck: boolean;
  public formLogin: FormGroup;
  public user: User;
  public token: string;
  public goToRejister: boolean = false;

  constructor(private httpCallService: HttpCallService, private fBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.tokenCheck();
    this.formLogin = this.fBuilder.group({
      idNum: ["", [Validators.required]],
      passwordRow: ['', Validators.required]
    })
  }

  public tokenCheck() {
    this.token = localStorage.getItem('token');
    this.httpCallService.checkEntry(this.token).subscribe(
      res => {
        console.log(res)
        // if (this.token == null) {
        //   return this.headerCheck = false;
        // } else {

        //   return this.headerCheck = true;
        // }
        // this.router.navigate(['/products/' + res.idNum]);
      },
      err => {
        console.log(err)
      }
    )

  }

  public login() {
    this.httpCallService.getToken(this.formLogin.value).subscribe(
      res => {
        console.log(res)
        this.token = res;
        localStorage.setItem('token', res)
        this.tokenCheck();
      },
      err => console.log(err)
    );
  };

  public checkAndEnterShop(): void {
    this.token = localStorage.getItem('token');
    this.httpCallService.checkEntry(this.token).subscribe(
      res => {
        this.router.navigate(['/products/' + res.idNum]);
      },
      err => {
        console.log(err)
      }
    )
  };

  public changeGoToRejister() {
    this.router.navigate(['/rejister']);
  }

}
