import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCallService } from './services/http-call.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private httpCallService: HttpCallService) { } 

  public logout() {
    console.log(this.httpCallService.cart)
    if (this.httpCallService.cart !== undefined) {
      this.httpCallService.deleteCart().subscribe(
        res => {
          console.log(res)
        }, err => {
          console.log(err)
        }
      )
    }
    this.router.navigate(['/welcome-to-the-jungle']);
    localStorage.removeItem('token');
  }
}
