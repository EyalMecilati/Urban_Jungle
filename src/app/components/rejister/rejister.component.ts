import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpCallService } from 'src/app/services/http-call.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-rejister',
  templateUrl: './rejister.component.html',
  styleUrls: ['./rejister.component.scss']
})
export class RejisterComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  public token: string;
  public cities: any = ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beersheba', 'Herzliya', 'Hod HaSharon', 'Holon', 'Raanana', 'Rehovot', 'Tiberias'];
  public isLinear = false;
  public rejisterForm1: FormGroup;
  public rejisterForm2: FormGroup;
  public taken: boolean = false;
  public wrongPassword: boolean = false;

  constructor(private httpCallService: HttpCallService, private fBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.rejisterForm1 = this.fBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      idNum: ['', [Validators.required]],
      passwordRow: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.rejisterForm2 = this.fBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]]
    })
  }

  // check if user is alredy rejister;
  public handleSubmit1() {
    this.wrongPassword = false;
    if (this.rejisterForm1.value.passwordRow == this.rejisterForm1.value.confirmPassword) {
      this.httpCallService.checkNewUser({ idNum: this.rejisterForm1.value.idNum }).subscribe(
        res => {
          console.log(res)
          if (res == null) {
            this.taken = false;
          } else {
            this.taken = true;
            this.stepper.previous();
          }
        },
        err => {
          this.taken = true;
          this.stepper.previous();

        }
      )
    } else {
      this.taken = false;
      this.wrongPassword = true;
      this.stepper.previous();
    }
  }

  public handleSubmit2() {
    const user = { ...this.rejisterForm1.value, ...this.rejisterForm2.value }
    this.httpCallService.addNewUser(user).subscribe(
      res => {
        this.httpCallService.getToken(this.rejisterForm1.value).subscribe(
          res => {
            this.token = res;
            localStorage.setItem('token', res)
            this.httpCallService.headerCheck = true;
            this.router.navigate(['/welcome-to-the-jungle']);
          },
          err => console.log(err)
        );
      },
      err => console.log(err)
    )

  }


}

