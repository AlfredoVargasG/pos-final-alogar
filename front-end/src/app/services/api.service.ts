import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get(`${this.url}/categories`);
  }

  getProducts(page?: number, pageSize?: number, orderBy?: string, orderDirection?: string) {
    let params = `?`;
    if (page !== undefined) params += `page=${page}&`;
    if (pageSize !== undefined) params += `pageSize=${pageSize}&`;
    if (orderBy) params += `orderBy=${orderBy}&`;
    if (orderDirection) params += `orderDirection=${orderDirection}&`;
    params = params.slice(0, -1);

    return this.http.get(`${this.url}/products${params}`);
  }

  getHistoricalProducts(){
    return this.http.get(`${this.url}/products/historical`);
  }

  searchProductByCode(code: any) {
    return this.http.get(`${this.url}/products/search/${code}`);
  }

  ingresarProducto(producto: any) {
    return this.http.post(`${this.url}/products`, producto);
  }
}
