import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpCallService } from './services/http-call.service';
import { } from '@angular/router';
import { slider } from './components/animations/route-animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slider
  ]
})
export class AppComponent {
  constructor(private router: Router, private httpCallService: HttpCallService) { }

  public prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  public logout() {
    if (this.httpCallService.cart !== undefined) {
      this.httpCallService.deleteCart().subscribe(
        res => {
        }, err => {
          console.log(err)
        }
      )
    }
    this.router.navigate(['/welcome-to-the-jungle']);
    localStorage.removeItem('token');
  }
}
