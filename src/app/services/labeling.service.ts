// File: src/app/services/labeling.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabelBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export interface LabelOrder {
  orderId: string;
  status: string;
  comment: string;
  labels: LabelBox[];
}

@Injectable({
  providedIn: 'root'
})
export class LabelingService {
  private jsonUrl = 'assets/fake-labels.json';

  constructor(private http: HttpClient) {}

  // GET: Load existing labels for an order
  getLabelingData(): Observable<LabelOrder[]> {
    return this.http.get<LabelOrder[]>(this.jsonUrl);
  }

  // POST: Save new labels (simulated)
  saveLabeling(orderId: string, labels: LabelBox[]): Observable<any> {
    console.log('Simulating save for:', orderId, labels);
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ message: 'Labels saved (fake API)' });
        observer.complete();
      }, 500);
    });
  }

  // Optional: Simulate uploading a new image
  uploadImage(imageFile: File): Observable<string> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next('assets/uploaded/' + imageFile.name); // simulate uploaded path
        observer.complete();
      }, 1000);
    });
  }

  // Optional: Get labels for specific order
  getLabelsByOrderId(orderId: string): Observable<LabelBox[]> {
    return new Observable(observer => {
      this.getLabelingData().subscribe(data => {
        const order = data.find(o => o.orderId === orderId);
        observer.next(order ? order.labels : []);
        observer.complete();
      });
    });
  }
}
