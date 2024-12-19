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

  categories: any[] = [];
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  constructor(
    private builder: FormBuilder,
    private apiService: ApiService
  ) {
    this.productForm = this.builder.group({
      product: ['', Validators.required],
      price: [null, Validators.required],
      image: [null, Validators.required],
      url: ['', Validators.required],
      categories: [[]],
      principal_category_id: [null, Validators.required],
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
      categories.push(category.id);
    } else {
      const index = categories.findIndex((cat: any) => cat.id === category.id);
      if (index > -1) {
        categories.splice(index, 1);
      }
    }

    this.productForm.get('categories')?.setValue(categories);
    this.productForm.get('principal_category_id')?.setValue(categories[0]);
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      this.apiService.ingresarProducto(this.productForm.value).subscribe((data: any) => {
        console.log('Producto creado correctamente', data);
        this.isSubmitting = false;
      });
    }
  }
}
