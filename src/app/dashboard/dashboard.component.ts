import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { OrderService, Order } from '../services/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string | null = '';
  orders: Order[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderService.getLabelOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error("Error loading orders:", err);
      }
    });

  }

  openLabelingPage(order: Order): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/labeling'], {
        queryParams: {
          orderId: order.orderId,
          image: order.imageUrl,
          status: order.orderStatus,
          comment: order.comment,
          accuracy: order.accuracy
        }
      })
    );
    console.log("Opening URL:", url);
    window.open(url, '_blank');
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-warning';
      case 'in progress': return 'text-primary';
      case 'completed': return 'text-success';
      case 'rejected': return 'text-danger';
      default: return 'text-secondary';
    }
  }
}
