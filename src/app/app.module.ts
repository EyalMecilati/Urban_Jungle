import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsMainComponent } from './components/products-main/products-main.component';
import { LoginMainComponent } from './components/login-main/login-main.component';
import { MainComponent } from './components/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MaterialModule } from './module/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RejisterComponent } from './components/rejister/rejister.component';
import { MatInputModule} from '@angular/material/input';
import { AboutMainComponent } from './components/about-main/about-main.component';
import { ColorYellowPipe } from './pipes/color-yellow.pipe';
import { StoreInfoComponent } from './components/store-info/store-info.component';
import { ModalComponent } from './components/products-main/modal/modal.component';
import { OredrComponent } from './components/oredr/oredr.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { AdminComponent } from './components/admin/admin.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductsMainComponent,
    LoginMainComponent,
    MainComponent,
    PageNotFoundComponent,
    RejisterComponent,
    AboutMainComponent,
    ColorYellowPipe,
    StoreInfoComponent,
    ModalComponent,
    OredrComponent,
    AdminComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
