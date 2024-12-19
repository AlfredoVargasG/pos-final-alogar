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
  isLoadingProducts: boolean = true;
  isLoadingCategories: boolean = true;
  isSearching: boolean = false;
  view: string = 'categories'; // Vista activa ('categories' o 'products')
  activeCategoryId: number = 0; // Categoría activa
  products: any[] = []; // Productos de la página actual
  categories: any[] = []; // Categorías
  totalProducts: number = 0; // Total de productos (desde el backend)
  pageSize: number = 10; // Productos por página
  page: number = 1; // Página actual
  activeView: string = 'list'; // Vista activa ('list' o 'grid_view')
  orderDirection: string = 'asc'; // Dirección de ordenamiento ('asc' o 'desc')
  orderBy: string = 'product'; // Campo por el que se ordenan los productos

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCategories(); // Obtener categorías al iniciar
  }

  // Método para obtener productos con paginación
  getProducts(category: number) {
    this.isLoadingProducts = true; // Activar el loader
    this.apiService.getProductsByCategory(category, this.page, this.pageSize, this.orderBy, this.orderDirection).subscribe((res: any) => {
      this.products = res.data;
      this.totalProducts = res.totalCount; // Total de productos
      setTimeout(() => {
        this.isLoadingProducts = false; // Desactivar el loader
      }, 1000); // Simular tiempo de carga
    });
  }

  // Método para obtener categorías
  getCategories() {
    this.isLoadingCategories = true; // Activar el loader
    this.apiService.getCategories().subscribe((res: any) => {
      this.categories = res;
      setTimeout(() => {
        this.isLoadingCategories = false; // Desactivar el loader
      }, 2000); // Simular tiempo de carga
    });
  }

  changeView(view: string, category: any) {
    this.view = view;
    this.activeCategoryId = category.id
    if (view === 'products') {
      this.getProducts(category.id); // Obtener productos de la categoría seleccion
    }
  }

  // Manejar el cambio de página
  onPageChange(newPage: number) {
    this.page = newPage;
    this.getProducts(this.activeCategoryId); // Obtener productos para la nueva página
  }

  sortProducts(sortBy: string) {
    if (this.orderBy === sortBy) {
      this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = sortBy;
      this.orderDirection = 'asc';
    }
    this.getProducts(this.activeCategoryId); // Obtener productos ordenados
  }

  searchProducts(searchTerm: any) {
    this.isSearching = true; // Activar el loader
    this.apiService.searchProducts(searchTerm.target.value, this.activeCategoryId, this.page, this.pageSize).subscribe((res: any) => {
      this.products = res;
      this.totalProducts = res.length; // Total de productos
      setTimeout(() => {
        this.isSearching = false; // Desactivar el loader
      }, 1000); // Simular tiempo de carga
    });
  }

  onViewChange(view: string): void {
    this.activeView = view;
  }
}
