import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-historial-productos',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './historial-productos.component.html',
  styleUrl: './historial-productos.component.scss'
})
export class HistorialProductosComponent {
  isLoading = false;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getHistoricalProductsByMonth();
  }

  getHistoricalProductsByMonth() {
    this.isLoading = true;
    this.apiService.getHistoricalProductsByMonth().subscribe((data: any) => {
      console.log(data);
      this.isLoading = false;
    })
  }
}
