import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Order {
  orderId: string;
  orderType: string;
  orderStatus: string;
  comment: string;
  user: string;
  imageUrl: string;
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
   private ordersUrl = 'assets/orders.json'; 
   private jsonUrl = 'assets/LabelsOrders.json';
    constructor(private http: HttpClient) {}


    getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl);

  }

  getLabelOrders(): Observable<Order[]> {
    console.log("jsonUrl", this.jsonUrl);
    
    return this.http.get<Order[]>(this.jsonUrl);
  }
}
