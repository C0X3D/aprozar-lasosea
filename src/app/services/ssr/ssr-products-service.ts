import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsServiceInterface } from '../interfaces/ProductsServiceInterface';
import { Banner } from '../../models/banner';

@Injectable({
  providedIn: 'root',
})
export class SsrProductsService implements ProductsServiceInterface {
  private projectId = 'aprozar-magurele-3ec90'; // înlocuiește cu proiectul tău
  private baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents`;
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {

    const url = `${this.baseUrl}/products`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const products: Product[] = (response.documents ?? []).map(
          (doc: any) => {
            const fields = doc.fields || {};
            return {
              id: doc.name.split('/').pop(),
              name: fields.name?.stringValue ?? '',
              price: Number(
                fields.price?.integerValue ?? fields.price?.doubleValue ?? 0
              ),
              quantity: Number(fields.quantity?.integerValue ?? 0),
              type: fields.type?.stringValue ?? '',
              unit: fields.unit?.stringValue ?? '',
              origine: fields.origine?.stringValue ?? '',
              calitatea: fields.calitatea?.integerValue ?? 2,
              imageUrl: fields.imageUrl?.stringValue ?? '',
              thumbnailUrl: fields.thumbnailUrl?.stringValue ?? '',
              newPice: Number(
                fields.newPice?.integerValue ?? fields.newPice?.doubleValue ?? 0
              ),
              order: Number(fields.order?.integerValue ?? 9999),
              tags: fields.tags?.stringValue ?? '',
            } as Product;
          }
        );
        return products.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    console.log('SSR LOADING ' + id);


    const url = `${this.baseUrl}/products/${id}`;

    return this.http.get<any>(url).pipe(
      map((doc) => {
        const fields = doc.fields || {};
        return {
          id: doc.name.split('/').pop(),
          name: fields.name?.stringValue ?? '',
          price: Number(
            fields.price?.integerValue ?? fields.price?.doubleValue ?? 0
          ),
          quantity: Number(fields.quantity?.integerValue ?? 0),
          type: fields.type?.stringValue ?? '',
          unit: fields.unit?.stringValue ?? '',
          origine: fields.origine?.stringValue ?? '',
          calitatea: fields.calitatea?.stringValue ?? '',
          imageUrl: fields.imageUrl?.stringValue ?? '',
          thumbnailUrl: fields.thumbnailUrl?.stringValue ?? '',
          newPice: Number(
            fields.newPice?.integerValue ?? fields.newPice?.doubleValue ?? 0
          ),
          order: Number(fields.order?.integerValue ?? 9999),
          tags: fields.tags?.stringValue ?? '',
        } as Product;
      })
    );
  }
}
