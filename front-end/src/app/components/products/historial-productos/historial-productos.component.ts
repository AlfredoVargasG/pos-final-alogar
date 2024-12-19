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
    this.getHistorialProductos();
  }

  getHistorialProductos() {
    this.isLoading = true;
    this.apiService.getHistoricalProducts().subscribe((res: any) => {
      console.log(res);
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    })
  }
}
