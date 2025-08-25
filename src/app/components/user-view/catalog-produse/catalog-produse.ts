import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../models/product';
import { Meta, Title } from '@angular/platform-browser';
import { ProductFilterPipe } from '../../../pipes/product-filter-pipe-pipe';
import { FilterDict } from '../../../models/filterDict';

@Component({
  selector: 'app-catalog-produse',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
    ProductFilterPipe
  ],
  templateUrl: './catalog-produse.html',
  styleUrl: './catalog-produse.scss',
})
export class CatalogProduse {
  products: Product[] = [];

  searchTerm: any;
  sortBy = 'name';
  sortDir: 'asc' | 'desc' = 'asc';
  sortTypes = FilterDict.sortTypes;
  selectedType: string = '';
  baseUrl: string = 'https://aprozar-magurele-server--aprozar-magurele-3ec90.europe-west4.hosted.app/';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.products = this.route.snapshot.data['products'];
    this.setSEO();
  }

  setSEO(): void {
    // Setează titlul paginii pentru Google, axat pe Aprozar Magurele și legume proaspete
    this.titleService.setTitle('Aprozar Magurele - La Sosea | Legume Proaspete | Reduceri și Oferte Speciale');

    // Setează meta tagul pentru descriere pentru Google
    this.metaService.updateTag({ name: 'description', content: 'Aprozar Magurele - La Sosea îți aduce cele mai proaspete legume, direct de la fermieri. Reduceri și oferte speciale pentru clienți. Cumpără acum legume proaspete și sănătoase!' });

    // Setează meta tagul pentru cuvinte cheie pentru Google
    this.metaService.updateTag({ name: 'keywords', content: 'Aprozar Magurele, legume proaspete, La Sosea, reduceri, legume de sezon, produse locale, magazin legume' });

    // Setează meta tagul pentru robots pentru Google
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

    // Setează meta tagul pentru autor pentru Google
    this.metaService.updateTag({ name: 'author', content: 'Aprozar Magurele - La Sosea' });

    const d = new Date(Date.UTC(2025, 6, 2)); // 2025-07-02 UTC
    const formatted = d.toISOString().split('T')[0]; // '2025-07-02'
    // Setează data de publicare pentru Google
    this.metaService.updateTag({ name: 'date', content: formatted, scheme: 'YYYY-MM-DD' });

    // **Facebook Open Graph Meta Tags** - pentru Aprozar Magurele și legume proaspete
    this.metaService.updateTag({ property: 'og:title', content: 'Aprozar Magurele - La Sosea | Legume Proaspete | Reduceri și Oferte Speciale' });
    this.metaService.updateTag({ property: 'og:description', content: 'Aprozar Magurele - La Sosea îți aduce cele mai proaspete legume, direct de la fermieri. Reduceri și oferte speciale pentru tine!' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://www.aprozar-magurele.ro/assets/proaspete.png' });
    this.metaService.updateTag({
      property: 'og:image',
      content: this.baseUrl + 'current/assets/legume-proaspete.png'
    });

    // **Meta pentru Twitter** - pentru promovarea Aprozarului și legumelor proaspete
    this.metaService.updateTag({ name: 'twitter:title', content: 'Aprozar Magurele - La Sosea | Legume Proaspete | Reduceri și Oferte Speciale' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Legume proaspete la Aprozar Magurele - La Sosea. Reduceri și oferte speciale pentru familiile care iubesc produsele naturale și sănătoase!' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://www.aprozar-magurele.ro/assets/proaspete.png' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    // **TikTok Meta Tags** (Preia Open Graph și Twitter Cards pentru TikTok)
    // TikTok preia automat datele din Open Graph și Twitter Cards.
    console.log('done with tags');

    // **Schema.org (Google Structured Data pentru Produse Locally Sourced)**
    this.metaService.updateTag({
      name: 'application/ld+json',
      content: `
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Legume Proaspete - Aprozar Magurele",
        "image": "https://www.aprozar-magurele.ro/assets/proaspete.png",
        "description": "Legume proaspete, direct de la fermieri, la Aprozar Magurele - La Sosea.",
        "offers": {
          "@type": "Offer",
          "url": "https://www.aprozar-magurele.ro",
          "priceCurrency": "RON",
          "price": "Valoarea prețului",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock"
        }
      }`
    });
  }
}

//4che3*fQ7kmf0U!?
