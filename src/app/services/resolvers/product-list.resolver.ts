import { Injectable, Inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsServiceInterface } from '../interfaces/ProductsServiceInterface';
import { PRODUCTS_SERVICE } from '../tokens/products-service.token';

@Injectable({
  providedIn: 'root'
})
export class ProductListResolver implements Resolve<Product[]> {
  constructor(
    @Inject(PRODUCTS_SERVICE) private productsService: ProductsServiceInterface
  ) {}

  resolve(): Observable<Product[]> {
    return this.productsService.getAllProducts();
  }
}
