import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';
import { StatusChartService } from '../services/status-chart.service';

type OrderStatus = 'Completed' | 'In Progress' | 'Rejected' | 'Confirmation Needed';

@Component({
  selector: 'app-pmr-chart',
  templateUrl: './pmr-chart.component.html',
  styleUrls: ['./pmr-chart.component.scss']
})
export class PMRChartComponent implements OnInit {

  // Chart Types
barChartType: 'bar' = 'bar';
pieChartType: 'pie' = 'pie';

  // Bar Chart
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 10 }, padding: 5 }
      },
      title: {
        display: true,
        text: 'Order Status by Month',
        position: 'bottom',
        font: { size: 20 }
      }
    },
    scales: {
      x: { ticks: { font: { size: 15 } } },
      y: { ticks: { font: { size: 15 } } }
    }
  };

  // Pie Chart
  pieChartData: ChartData<'pie'> = {
    labels: ['Completed', 'In Progress', 'Rejected', 'Confirmation Needed'],
    datasets: [
      {
        label: 'Orders', // ✅ Fix for undefined legend
        data: [0, 0, 0, 0],
        backgroundColor: ['green', 'blue', 'red', 'gray']
      }
    ]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 10 } } }
    }
  };

  constructor(private orderService: StatusChartService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders) => {
      const monthMap: Record<string, Record<OrderStatus, number>> = {};
      const totalStatus: Record<OrderStatus, number> = {
        Completed: 0,
        'In Progress': 0,
        Rejected: 0,
        'Confirmation Needed': 0
      };

      const today = new Date();
      const monthsToShow = 4;

      for (const order of orders) {
        const orderDate = new Date(order.date);
        if (isNaN(orderDate.getTime())) continue;

        const diffInMonths =
          (today.getFullYear() - orderDate.getFullYear()) * 12 +
          (today.getMonth() - orderDate.getMonth());

        if (diffInMonths >= monthsToShow) continue;

        const month = orderDate.toLocaleString('default', { month: 'short', year: 'numeric' });

        if (!monthMap[month]) {
          monthMap[month] = {
            Completed: 0,
            'In Progress': 0,
            Rejected: 0,
            'Confirmation Needed': 0
          };
        }

        const status = order.orderStatus as OrderStatus;
        monthMap[month][status]++;
        totalStatus[status]++;
      }

      const months = Object.keys(monthMap).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      const completed = months.map(m => monthMap[m].Completed);
      const inProgress = months.map(m => monthMap[m]['In Progress']);
      const rejected = months.map(m => monthMap[m].Rejected);
      const confirmation = months.map(m => monthMap[m]['Confirmation Needed']);

      // Update Bar Chart
      this.barChartData = {
        labels: months,
        datasets: [
          { label: 'Completed', data: completed, backgroundColor: 'green' },
          { label: 'In Progress', data: inProgress, backgroundColor: 'blue' },
          { label: 'Rejected', data: rejected, backgroundColor: 'red' },
          { label: 'Confirmation Needed', data: confirmation, backgroundColor: 'gray' }
        ]
      };

      // Update Pie Chart
      this.pieChartData = {
        labels: ['Completed', 'In Progress', 'Rejected', 'Confirmation Needed'],
        datasets: [
          {
            label: 'Orders',
            data: [
              totalStatus.Completed,
              totalStatus['In Progress'],
              totalStatus.Rejected,
              totalStatus['Confirmation Needed']
            ],
            backgroundColor: ['green', 'blue', 'red', 'gray']
          }
        ]
      };
    });
  }
}
