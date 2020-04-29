import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/products'
import { Category } from '../interfaces/Category';
import { User } from '../interfaces/user';
import { Order } from '../interfaces/Order';
import {environment} from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class HttpCallService {

  constructor(private http: HttpClient) { }

  // public var
  public headerCheck: boolean = false;
  public storeInfoTotalSum: any;
  public openCartFrom: Date;
  public cart: any;
  public openOrder: boolean = true;
  public lastOrderSum: number = null;
  public lastOrderDate: Date = null;


  //all products                                          ------products------
  public getAllProducts(): Observable<Product[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Product[]>(environment.apiUrl +'/products');
  };

  // products by category
  public getProductByCategory(id): Observable<Product[]> {
    return this.http.get<Product[]>(environment.apiUrl +'/products/' + id);
  };

  // get specific product
  public getSpecificProduct(product): Observable<any> {
    let product_name = {
      product_name: product
    }
    return this.http.post<any>(environment.apiUrl +'/products', product_name)
  }

  // get all categorys
  public getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl +'/products/category');
  };
  // --------------------------------------------------------------------------------

  //                                                           -----users-------
  // add new user
  public addNewUser(body): Observable<User> {
    return this.http.post<User>(environment.apiUrl +'/users/rejister', body)
  }

  public checkNewUser(idNum): Observable<any> {
    return this.http.post<any>(environment.apiUrl +'/users/rejister-check', idNum)
  }

  // login 
  public getToken(loginForm): Observable<any> {
    return this.http.post<any>(environment.apiUrl +'/users/login', loginForm)
  }

  // check entry
  public checkEntry(token): Observable<any> {
    return this.http.get<any>(environment.apiUrl +'/users/check', {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    });
  };

  // open new cart 
  public newCart(id): Observable<any> {
    return this.http.post<any>(environment.apiUrl +'/cart', id);
  }

  // delete cart 
  public deleteCart(): Observable<any> {
    return this.http.delete(environment.apiUrl +'/cart/' + this.cart)
  }

  // get all orders
  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(environment.apiUrl +'/order');
  }
  // get specific order
  public getOneOrder(id): Observable<any> {
    return this.http.get<any>(environment.apiUrl +'/order/' + id.id);
  }

  public getLastOrderOfUser(token): Observable<any> {
    return this.http.get<any>(environment.apiUrl +'/order/latest', {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    })
  }


  // add product to cart 
  public addProductToCart(product, token): Observable<any> {
    return this.http.post<any>(environment.apiUrl +'/cart/info', product, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    })
  }

  // get cartby id 
  public getCartById(id): Observable<any> {
    return this.http.get(environment.apiUrl +'/cart/' + id);
  }

  // remove product from cart 
  public removeItemFromCart(productId, cart_id): Observable<any> {
    const id = { productId: productId }
    return this.http.post<any>(environment.apiUrl +'/cart/remove-product/' + cart_id, id)
  }

  // empty cart 
  public emptyCart(): Observable<any> {
    return this.http.get<any>(environment.apiUrl +'/cart/delete-all-products/' + this.cart)
  }

  // make oreder
  public sendOrder(token, order, sum): Observable<any> {
    const orderObj = { cart_id: this.cart, ...order, total_sum: sum }
    return this.http.post<any>(environment.apiUrl +'/order', orderObj, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    })
  }

  // check order date for more then 2 orders
  public checkDate(date): Observable<Order[]> {
    return this.http.post<Order[]>(environment.apiUrl +'/order/date', date)
  }

  public getUserLastOrder() {
    const token = localStorage.getItem('token');
    this.getLastOrderOfUser(token).subscribe(
      res => {
        if (res[0]) {
          this.lastOrderDate = res[0].date_of_order;
          this.lastOrderSum = res[0].total_sum
        } else {
          this.lastOrderDate = null;
          this.lastOrderSum = null;
        }
      }, err => {
        this.lastOrderDate = null;
        this.lastOrderSum = null;
      }
    )
  }

  // download receipt
  public downloadReceipt(receipt, total) {
    let products = {
      'products': receipt,
      'total': total
    }
    return this.http.post(environment.apiUrl +'/receipt/download/' + this.cart, products, { responseType: 'blob' })
  }

  // admin functions
  public removeProduct(id, token): Observable<any> {
    return this.http.delete<any>(environment.apiUrl +'/admin/' + id);
  }
  // upload image to server 
  public adminAddImage(imageData): Observable<any> {
    let token = localStorage.getItem('token');
    return this.http.post(environment.apiUrl +'/admin/uploadPhoto', imageData)
  }
  // upload a new product
  public adminAddProduct(newProductForm): Observable<any> {
    let token = localStorage.getItem('token');
    return this.http.post<any>(environment.apiUrl +'/admin/new-product', newProductForm)
  }

  // update price/category_id/prdouct_name
  public updateProductWithOutImage(updateObj, id): Observable<any> {
    let token = localStorage.getItem('token');
    return this.http.post<any>(environment.apiUrl +'/admin/update-product/' + id, updateObj, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    });
  }

  // update image
  public updateImg(id, updateImageForm): Observable<any> {
    let token = localStorage.getItem('token');
    return this.http.post<any>(environment.apiUrl +'/admin/updatePhoto/' + id, updateImageForm)
  }

  public adminCheck():Observable<any>{
    let token = localStorage.getItem('token');
    return this.http.get(environment.apiUrl +'/admin/check', {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      }
    })
  }

}
