import { Injectable, inject } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Product } from "../../models/product";
import { ProductsServiceInterface } from "../interfaces/ProductsServiceInterface";
import { PRODUCTS_SERVICE } from '../../services/tokens/products-service.token';


@Injectable({ providedIn: 'root' })
export class ProductViewResolver implements Resolve<Product> {
  private productService = inject<ProductsServiceInterface>(PRODUCTS_SERVICE);

  resolve(route: ActivatedRouteSnapshot): Observable<Product> {
    const id = route.paramMap.get('id')!;
    return this.productService.getProductById(id);
  }
}
