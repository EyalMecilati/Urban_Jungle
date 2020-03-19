import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsMainComponent } from './components/products-main/products-main.component';
import { LoginMainComponent } from './components/login-main/login-main.component';
import { MainComponent } from './components/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RejisterComponent } from './components/rejister/rejister.component';


const routes: Routes = [
  { path: 'welcome-to-the-jungle', component: MainComponent },
  { path: 'products', component: ProductsMainComponent },
  { path: 'login', component: LoginMainComponent },
  { path: 'rejister', component: RejisterComponent },
  { path: '', redirectTo: '/welcome-to-the-jungle', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
