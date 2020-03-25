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
  public headerCheck: boolean = false;
  public storeInfoTotalSum: any;
  public openCartFrom: Date;
  public cart: any;

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
  public newCart(id): Observable<any> {
    return this.http.post<any>('http://localhost:1000/api/cart', id);
  }

  // get all orders
  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:1000/api/order');
  }
  // get specific order
  public getOneOrder(id): Observable<any> {
    console.log(id)
    return this.http.get<any>('http://localhost:1000/api/order/' + id.id);
  }


  // add product to cart 
  public addProductToCart(product, token): Observable<any> {
    return this.http.post<any>('http://localhost:1000/api/cart/info', product, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    })
  }

  // get cartby id 
  public getCartById(id): Observable<any> {
    return this.http.get('http://localhost:1000/api/cart/' + id);
  }

  // remove product from cart 
  public removeItemFromCart(productId, cart_id): Observable<any> {
    const id = { productId: productId }
    return this.http.post<any>('http://localhost:1000/api/cart/remove-product/' + cart_id, id)
  }

  // empty cart 
  public emptyCart(): Observable<any> {
    return this.http.get<any>('http://localhost:1000/api/cart/delete-all-products/' + this.cart)
  }

  // make oreder
  public sendOrder(token,order,sum): Observable<any> {
    const orderObj =  { cart_id: this.cart,...order,total_sum:sum }
    console.log(orderObj)
    return this.http.post<any>('http://localhost:1000/api/order',orderObj, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    })
  }

}
