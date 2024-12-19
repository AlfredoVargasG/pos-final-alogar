import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() isLoading: boolean = false;
  @Output() changeLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    setTimeout(() => {
      this.changeLoading.emit(false);
    }, 1000)
  }
}
