import { Component, inject } from '@angular/core';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pagina-produs',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pagina-produs.html',
  styleUrl: './pagina-produs.scss',
})
export class PaginaProdus {
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private meta = inject(Meta);
  private sanitizer = inject(DomSanitizer);

  product: Product = this.route.snapshot.data['product'];
  productJsonLd!: SafeHtml;

  constructor() {
    this.setupSEO();
    this.generateJsonLd();
  }

  setupSEO() {
    const title = `${this.product.name} - Catalog Aprozar`;
    const description = `Cumpără ${this.product.name} la ${
      (this.product.newPice ?? 0) > 0
        ? this.product.newPice
        : this.product.price
    } RON/${this.product.unit}. Origine: ${this.product.origine}.`;

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({
      property: 'og:image',
      content: this.product.thumbnailUrl  ?? this.product.imageUrl
    });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
  }

  generateJsonLd() {
    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: this.product.name,
      image: [this.product.thumbnailUrl ?? this.product.imageUrl],
      description: `Origine: ${this.product.origine}, Calitate: ${this.product.calitatea}`,
      sku: this.product.id,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RON',
        price:
          (this.product.newPice ?? 0) > 0
            ? this.product.newPice
            : this.product.price,
        availability:
          this.product.quantity > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
    };
    this.productJsonLd = this.sanitizer.bypassSecurityTrustHtml(
      `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    );
  }

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(fbShareUrl, '_blank', 'noopener');
  }
}
