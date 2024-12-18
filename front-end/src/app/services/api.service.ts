import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getLogo(carpeta: string, archivo: string) {
    return this.http.get(`${this.url}/images/${carpeta}/${archivo}`);
  }

  uploadProductImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const headers = new HttpHeaders();
    const request = new HttpRequest('POST', `${this.url}/images/upload`, formData, { headers: headers });

    return this.http.request(request);
  }

  getCategories() {
    return this.http.get(`${this.url}/categories`);
  }

  getProducts(page: number, pageSize: number) {
    return this.http.get(`${this.url}/products?page=${page}&pageSize=${pageSize}`);
  }

  getProductsSorted(page: number, pageSize: number, sortBy: string, orderDirection: string) {
    return this.http.get(`${this.url}/products?page=${page}&pageSize=${pageSize}&orderBy=${sortBy}&orderDirection=${orderDirection}`);
  }

  ingresarProducto(producto: any) {
    return this.http.post(`${this.url}/products`, producto);
  }
}
