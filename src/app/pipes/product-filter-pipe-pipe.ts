import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(
    products: Product[],
    search: string = '',
    sortBy: any,
    direction: 'asc' | 'desc' = 'asc',
    selectedType: string = ''
  ): Product[] {
    if (!products) return [];

    const normalizedSearch = this.normalizeText(search);
    const normalizedType = this.normalizeText(selectedType);

    const filtered = products.filter(product => {
      const matchesSearch =
      !search ||
      this.normalizeText(
        `${product.name} ${product.type} ${product.unit} ${product['tags'] || ''}`
      ).includes(normalizedSearch);



      const matchesType = !selectedType || this.normalizeText(product.type) === normalizedType;

      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortBy) {
        case 'name':
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;
        case 'type':
        valA = a.type.toLowerCase();
        valB = b.type.toLowerCase();
        break;
        case 'price':
        valA = a.price;
        valB = b.price;
        break;
        case 'quantity':
        valA = a.quantity;
        valB = b.quantity;
        break;
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private normalizeText(text: string): string {
    return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  }

}
