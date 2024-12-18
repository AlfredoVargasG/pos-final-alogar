import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-producto',
  imports: [CommonModule],
  templateUrl: './card-producto.component.html',
  styleUrl: './card-producto.component.scss'
})
export class CardProductoComponent {
  @Input() producto: any;
  
  constructor() { }

  ngOnInit(): void {}
}
