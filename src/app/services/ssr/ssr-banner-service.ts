import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Banner } from '../../models/banner';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SsrBannerService {
  private projectId = 'aprozar-magurele-3ec90'; // înlocuiește cu proiectul tău
  private baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents`;
  constructor(private http: HttpClient) { }

  getBanners(): Observable<Banner[]> {
    const url = `${this.baseUrl}/banners`;

    return this.http.get<{ documents?: any[] }>(url).pipe(
      map(response => {
        const banners: Banner[] = (response.documents ?? []).map(doc => {
          const fields = doc.fields ?? {};
          return {
            id: doc.name.split('/').pop() ?? '',
            title: fields.title?.stringValue ?? '',
            description: fields.description?.stringValue ?? '',
            imageUrl: fields.imageUrl?.stringValue ?? '',
            link: fields.link?.stringValue ?? '',
            order: Number(fields.order?.integerValue ?? fields.order?.doubleValue ?? 0),
            backgroundColor: fields.backgroundColor?.stringValue ?? '#ffffff',
            price: fields.price
            ? Number(fields.price.integerValue ?? fields.price.doubleValue ?? 0)
            : undefined,
            oldPrice: fields.oldPrice
            ? Number(fields.oldPrice.integerValue ?? fields.oldPrice.doubleValue ?? 0)
            : undefined,
            unit: fields.unit?.stringValue ?? undefined,
          };
        });

        return banners.sort((a, b) => a.order - b.order);
      })
    );
  }
}
