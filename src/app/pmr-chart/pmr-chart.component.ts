import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { StatusChartService } from '../services/status-chart.service';

@Component({
  selector: 'app-pmr-chart',
  templateUrl: './pmr-chart.component.html',
  styleUrls: ['./pmr-chart.component.scss']
})
export class PMRChartComponent implements OnInit {


barChartData: ChartData<'bar'> = {
  labels: ['April', 'May', 'June', 'July'], // last 4 months
  datasets: [
    {
      label: 'Completed',
      data: [10, 15, 8, 12], // fake data
      backgroundColor: 'green'
    },
    {
      label: 'In Progress',
      data: [5, 9, 6, 10],
      backgroundColor: 'blue'
    },
    {
      label: 'Rejected',
      data: [2, 1, 3, 4],
      backgroundColor: 'red'
    },
    {
      label: 'Confirmation Needed',
      data: [4, 3, 2, 5],
      backgroundColor: 'gray'
    }
  ]
};


 public barChartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          size: 10 // ≈ 50% of default (default is ~12–14px)
        },
        padding: 20 
      }
      
    },
    title: {
      display: true,
      text: 'Order Status by Month',
      position: 'bottom', 
      font: {
        size: 20 // Title font size reduced
      }
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      ticks: {
        font: {
          size: 10
        }
      }
    }
  }
};


constructor(private orderService: StatusChartService) {}

 ngOnInit(): void {
  this.orderService.getOrders().subscribe((orders) => {
    const monthMap: { [key: string]: any } = {};

    const today = new Date();
    const monthsToShow = 4;

    for (const order of orders) {
      const orderDate = new Date(order.date);
      if (isNaN(orderDate.getTime())) continue; // skip invalid date

      const diffInMonths = (today.getFullYear() - orderDate.getFullYear()) * 12 +
                           (today.getMonth() - orderDate.getMonth());
      if (diffInMonths >= monthsToShow) continue; // skip orders older than 4 months

      const month = orderDate.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthMap[month]) {
        monthMap[month] = {
          Completed: 0,
          'In Progress': 0,
          Rejected: 0,
          'Confirmation Needed': 0
        };
      }

      switch (order.orderStatus) {
        case 'Completed':
          monthMap[month].Completed++;
          break;
        case 'In Progress':
          monthMap[month]['In Progress']++;
          break;
        case 'Rejected':
          monthMap[month].Rejected++;
          break;
        case 'Confirmation Needed':
          monthMap[month]['Confirmation Needed']++;
          break;
      }
    }

    const months = Object.keys(monthMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const completed = months.map(m => monthMap[m].Completed);
    const inProgress = months.map(m => monthMap[m]['In Progress']);
    const rejected = months.map(m => monthMap[m].Rejected);
    const confirmation = months.map(m => monthMap[m]['Confirmation Needed']);

    this.barChartData = {
      labels: months,
      datasets: [
        { label: 'Completed', data: completed, backgroundColor: 'green' },
        { label: 'In Progress', data: inProgress, backgroundColor: 'blue' },
        { label: 'Rejected', data: rejected, backgroundColor: 'red' },
        { label: 'Confirmation Needed', data: confirmation, backgroundColor: 'grey' }
      ]
    };
  });
}

}
