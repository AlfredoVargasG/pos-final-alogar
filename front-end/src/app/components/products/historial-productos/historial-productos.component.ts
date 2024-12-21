import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-historial-productos',
  imports: [CommonModule],
  templateUrl: './historial-productos.component.html',
  styleUrl: './historial-productos.component.scss'
})
export class HistorialProductosComponent {
  isLoading = false;
  products: any[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getHistoricalProductsByMonth();
  }

  getHistoricalProductsByMonth() {
    this.isLoading = true;
    this.apiService.getHistoricalProducts().subscribe((data: any) => {
      this.products = data;
      this.isLoading = false;
    })
  }
}
