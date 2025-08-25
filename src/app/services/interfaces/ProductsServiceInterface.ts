import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { Banner } from '../../models/banner';

export interface ProductsServiceInterface {
  getAllProducts(): Observable<Product[]>;
  getProductById(id: string): Observable<Product>;
}
