import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsMainComponent } from './components/products-main/products-main.component';
import { LoginMainComponent } from './components/login-main/login-main.component';
import { MainComponent } from './components/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RejisterComponent } from './components/rejister/rejister.component';
import { AdminComponent } from './components/admin/admin.component';


const routes: Routes = [
  { path: 'welcome-to-the-jungle', component: MainComponent , data: { animation: 'isRight' } },
  { path: 'products/:id', component: ProductsMainComponent , data: { animation: 'isLeft' } },
  { path: 'login', component: LoginMainComponent, data: { animation: 'isRight' }  },
  { path: 'rejister', component: RejisterComponent , data: { animation: 'isLeft' } },
  { path: 'admin', component: AdminComponent, data: { animation: 'isRight' }  }, 
  { path: '', redirectTo: '/welcome-to-the-jungle', pathMatch: 'full', data: { animation: 'isLeft' }  },
  { path: '**', component: PageNotFoundComponent, data: { animation: 'isRight' }  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
