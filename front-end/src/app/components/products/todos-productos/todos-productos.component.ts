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
  isLoadingProducts: boolean = false;
  isLoadingCategories: boolean = false;
  isSearching: boolean = false;
  view: string = 'categories';
  activeCategoryId: number = 0;
  products: any[] = []; 
  categories: any[] = [];
  totalProducts: number = 0;
  pageSize: number = 10;
  page: number = 1;
  activeView: string = 'list';
  orderDirection: string = 'asc';
  orderBy: string = 'product';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.isLoadingCategories = true;
    this.apiService.getCategories().subscribe((res: any) => {
      this.categories = res;
      setTimeout(() => {
        this.isLoadingCategories = false;
      }, 2000);
    });
  }

  getProducts() {
    this.isLoadingProducts = true;
    this.apiService.getProducts(this.page, this.pageSize, this.orderBy, this.orderDirection).subscribe((res: any) => {
      this.products = res.products.filter((product: any) => product.id === this.activeCategoryId)[0].products;
      this.totalProducts = res.products.filter((product: any) => product.id === this.activeCategoryId)[0].totalProducts;
      setTimeout(() => {
        this.isLoadingProducts = false;
      }, 1000)
    })
  }

  changeView(view: string, category: any) {
    this.view = view;
    this.activeCategoryId = category.id
    if (view === 'products') {
      this.getProducts();
    }
  }

  onPageChange($event: number) {
    this.page = $event;
    this.getProducts();
  }

  searchProducts(searchTerm: any) {
    this.isSearching = true;
    this.apiService.searchProducts(searchTerm.target.value, this.activeCategoryId, this.page, this.pageSize).subscribe((res: any) => {
      this.products = res;
      this.totalProducts = res.length;
      setTimeout(() => {
        this.isSearching = false;
      }, 1000);
    });
  }

  sortProducts(orderBy: string) {
    this.orderBy = orderBy;
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.getProducts();
  }

  onViewChange(view: string): void {
    this.activeView = view;
  }
}
