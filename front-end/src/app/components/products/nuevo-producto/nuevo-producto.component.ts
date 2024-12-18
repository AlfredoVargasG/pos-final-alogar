import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class NuevoProductoComponent {
  productForm: FormGroup;

  // Lista de categorías disponibles
  categories: any[] = [];
  isLoading: boolean = true;

  constructor(
    private builder: FormBuilder,
    private apiService: ApiService
  ) {
    // Inicializamos el formulario con un array vacío para las categorías seleccionadas
    this.productForm = this.builder.group({
      product: ['', Validators.required],
      price: [null, Validators.required],
      image: [null, Validators.required],
      url: ['', Validators.required],
      categories: [[]]
    });
  }

  ngOnInit() {
    this.getCategories();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000)
  }

  getCategories() {
    this.apiService.getCategories().subscribe((data: any) => {
      this.categories = data.map((category: any) => {
        return {
          ...category,
          selected: false
        }
      });
    })
  }

  onCategoryChange(event: any, category: any): void {
    category.selected = event.target.checked;

    const categories = this.productForm.get('categories')?.value;

    if (category.selected) {
      categories.push(category.category);
    } else {
      const index = categories.findIndex((cat: any) => cat.id === category.id);
      if (index > -1) {
        categories.splice(index, 1);
      }
    }

    this.productForm.get('categories')?.setValue(categories);
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({
        image: file
      });
    }
  }

  onSubmit() {
    const formData = this.productForm.value;
    this.apiService.uploadProductImage(formData.image).subscribe((data: any) => {
      const product = {
        ...this.productForm.value,
        image: data.body.url
      }

      this.apiService.ingresarProducto(product).subscribe((data: any) => {
        console.log(data);
      })
    })
  }
}
