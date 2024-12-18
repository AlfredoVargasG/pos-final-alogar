import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardProductoComponent } from './card-producto/card-producto.component';

@Component({
  imports: [CommonModule, NgbModule, CardProductoComponent],
  templateUrl: './todos-productos.component.html',
  styleUrls: ['./todos-productos.component.scss'],
})
export class TodosProductosComponent {
  isLoading: boolean = true;
  products: any[] = []; // Productos de la página actual
  totalProducts: number = 0; // Total de productos (desde el backend)
  pageSize: number = 10; // Productos por página
  page: number = 1; // Página actual
  activeView: string = 'list'; // Vista activa ('list' o 'grid_view')
  orderDirection: string = 'asc'; // Dirección de ordenamiento ('asc' o 'desc')
  orderBy: string = 'product'; // Campo por el que se ordenan los productos

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getProducts(); // Obtener productos al iniciar
  }

  // Método para obtener productos con paginación
  getProducts() {
    this.isLoading = true; // Activar el loader
    this.apiService.getProducts(this.page, this.pageSize).subscribe((res: any) => {
      this.products = res.data;
      this.totalProducts = res.totalCount; // Total de productos
      setTimeout(() => {
        this.isLoading = false; // Desactivar el loader
      }, 2000); // Simular tiempo de carga
    });
  }

  // Manejar el cambio de página
  onPageChange(newPage: number) {
    this.page = newPage;
    this.getProducts(); // Obtener productos para la nueva página
  }

  sortProducts(sortBy: string) {
    this.isLoading = true; // Activar el loader
    this.orderBy = sortBy; // Cambiar el campo por el que se ordenan los productos
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc'; // Cambiar la dirección de ordenamiento
    this.apiService.getProductsSorted(this.page, this.pageSize, this.orderBy, this.orderDirection).subscribe((res: any) => {
      this.products = res.data;
      setTimeout(() => {
        this.isLoading = false; // Desactivar el loader
      }, 2000); // Simular tiempo de carga
    });
  }

  onViewChange(view: string): void {
    this.activeView = view;
  }
}
