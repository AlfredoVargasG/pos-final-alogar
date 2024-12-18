import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ProductsComponent } from '../components/products/products.component';
import { NuevoProductoComponent } from '../components/products/nuevo-producto/nuevo-producto.component';
import { TodosProductosComponent } from '../components/products/todos-productos/todos-productos.component';
import { HistorialProductosComponent } from '../components/products/historial-productos/historial-productos.component';

interface PageItem {
  title: string;
  isActive: boolean;
  component?: any; // Componente opcional
}

interface Page {
  title: string;
  isActive: boolean;
  component?: any; // Componente principal opcional
  items: PageItem[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, NavbarComponent],
})
export class HomeComponent {
  isLoading = true;

  // Páginas con subitems y componentes asociados
  pages: Page[] = [
    { 
      title: 'Venta', 
      isActive: true, 
      items: this.createItems(['Nueva Venta', 'Historial de Ventas']) 
    },
    { 
      title: 'Producto', 
      isActive: false, 
      component: ProductsComponent,
      items: [
        { title: 'Nuevo Producto', isActive: true, component: NuevoProductoComponent },
        { title: 'Productos', isActive: false, component: TodosProductosComponent },
        { title: 'Historial de Productos', isActive: false, component: HistorialProductosComponent }
      ]
    },
    { title: 'Compra', isActive: false, items: [] },
    { title: 'Proveedor', isActive: false, items: [] },
    { title: 'Cliente', isActive: false, items: [] },
    { title: 'Busqueda', isActive: false, items: [] },
    { title: 'Reporte', isActive: false, items: [] }
  ];

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  // Método auxiliar para crear items con el primer activo
  private createItems(titles: string[]): PageItem[] {
    return titles.map((title, index) => ({ title, isActive: index === 0 }));
  }

  // Cambia la página activa y resetea los subitems
  changePage(selectedPage: Page): void {
    this.pages.forEach(page => {
      page.isActive = page === selectedPage;

      // Reinicia los subitems
      if (page.items.length > 0) {
        page.items.forEach((item, index) => item.isActive = index === 0);
      }
    });
  }

  // Cambia el subitem activo
  changeSubPage(selectedItem: PageItem): void {
    const activePage = this.pages.find(page => page.isActive);
    activePage?.items.forEach(item => (item.isActive = item === selectedItem));
  }

  // Obtiene el componente del subitem activo
  get activeSubPageComponent(): any {
    const activePage = this.pages.find(page => page.isActive);
    return activePage?.items.find(item => item.isActive)?.component;
  }

  // Loader
  getLoading(loading: boolean) {
    this.isLoading = loading;
  }
}
