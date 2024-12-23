import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-nueva-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-venta.component.html',
  styleUrls: ['./nueva-venta.component.scss'], // Arreglado nombre del campo
})
export class NuevaVentaComponent {
  salesForm: FormGroup;
  constructor(private api: ApiService, private fb: FormBuilder) {
    this.salesForm = this.fb.group({
      products: this.fb.array([{ product: '', quantity: 0, total: 0 }]),
      total: [0, Validators.required],
    })
  }

  ngOnInit(): void {}

  searchProductByCode(code: any): void {
    this.api.searchProductByCode(code).subscribe((res: any) => {
      console.log(res);
    })
  }
}