import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/products'
import { Category } from '../interfaces/Category';
import { User } from '../interfaces/user';
import { Order } from '../interfaces/Order';
import { Cart } from '../interfaces/Cart';

@Injectable({
  providedIn: 'root'
})
export class HttpCallService {

  constructor(private http: HttpClient) { }
  // public products:Product[];
  public headerCheck:boolean = false;
  public storeInfoTotalSum:any;
  public openCartFrom:Date;

  //all products                                          ------products------
  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:1000/api/products');
  };

  // products by category
  public getProductByCategory(id): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:1000/api/products/' + id);
  };

  // get all categorys
  public getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:1000/api/products/category');
  };
  // --------------------------------------------------------------------------------

  //                                                           -----users-------
  // add new user
  public addNewUser(body): Observable<User> {
    return this.http.post<User>('http://localhost:1000/api/users/rejister', body)
  }

  public checkNewUser(idNum): Observable<any> {
    return this.http.post<any>('http://localhost:1000/api/users/rejister-check', idNum)
  }

  // login 
  public getToken(loginForm): Observable<any> {
    return this.http.post<any>('http://localhost:1000/api/users/login', loginForm)
  }

  // check entry
  public checkEntry(token): Observable<any> {
    return this.http.get<any>('http://localhost:1000/api/users/check', {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    });
  };

  // open new cart 
  public newCart(id):Observable<Cart>{
    return this.http.post<Cart>('http://localhost:1000/api/cart',id);
  }

  // get all orders
  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:1000/api/order');
  }

}
