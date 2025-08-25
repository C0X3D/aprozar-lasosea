# Aprozar La Șosea

Aplicație web pentru prezentarea și administrarea unui catalog de produse (legume/fructe), cu SEO avansat, randare hibridă SSR + CSR, integrare Firebase (Firestore + Storage), stilizare cu Tailwind CSS și Angular standalone components.

URL public: https://www.aprozar-magurele.ro

---

## Cuprins
- Prezentare
- Arhitectură și structură
- Tehnologii folosite
- SSR vs CSR: strategie de randare
- Pattern‑uri de design și tehnici folosite
- Modele de date
- SEO și Social Sharing
- Mediul și configurarea
- Rulare locală și comenzi utile
- Deploy
- Testare
- Întrebări frecvente
- Contribuții

---

## Prezentare

Proiect Angular care servește:
- Catalog public de produse cu filtre, sortare și SEO on-page.
- Admin pentru bannere și produse (upload imagini, ordonare, tag-uri), realizat client-side.
- Integrare Firebase:
  - Firestore: produse, bannere, metadata (tags).
  - Storage: imagini bannere/produse.
- Randare hibridă:
  - SSR pentru rutele publice (indexare SEO, TTFB mai bun).
  - CSR pentru rutele de administrare (interacțiuni real-time, upload, SDK client).

---

## Arhitectură și structură

- Componente UI (user-facing):
  - src/app/components/user-view/catalog-produse/…
  - src/app/components/user-view/pagina-produs/…
- Servicii de date, separate pe medii de randare:
  - CSR:
    - src/app/services/csr/csr-products-service.ts
    - src/app/services/csr/csr-banner-service.ts
  - SSR:
    - src/app/services/ssr/ssr-products-service.ts
    - src/app/services/ssr/ssr-banner-service.ts
- Rute SSR/CSR:
  - src/app/app.routes.server.ts (control pe rută cu RenderMode.Server/Client)
- Stiluri:
  - Tailwind + SCSS: tailwind.config.js, src/styles.scss
  - SCSS per component (ex: catalog-produse.scss)
- Utilitare:
  - Pipe pentru filtrare/sortare produse: src/app/pipes/product-filter-pipe-pipe.ts
- Config/iconografie:
  - Lucide Angular, Meta/Title pentru SEO, HttpClient pe SSR

---

## Tehnologii folosite

Frontend
- Angular (standalone components, Angular Router, Meta/Title, HttpClient)
- TypeScript
- RxJS (Observable, BehaviorSubject, map, from)
- SCSS
- Tailwind CSS (utility-first, @apply în SCSS)
- Lucide Angular (pictograme)

Backend/Date & Hosting
- Firebase Firestore (colecții: products, banners, metadata/tags) – CSR
- Firebase Storage (upload imagini) – CSR
- Firestore REST API – SSR (citire colecții din server)
- Hosting/Edge: Google Cloud Hosted App (URL base utilizat în aplicație pentru API)
  - Exemplu bază API: `https://aprozar-magurele-server--aprozar-magurele-3ec90.europe-west4.hosted.app/`

Build/SSR
- Angular SSR cu @angular/ssr și RenderMode per rută
- Angular CLI (build, serve, ssr)
- Tailwind via postcss în build Angular

Altele
- HTML semantic, meta OG/Twitter, JSON‑LD pentru schema.org

---

## SSR vs CSR: strategie de randare

Controlul randării se face per rută în src/app/app.routes.server.ts:
- Implicit: SSR pentru toate rutele (`path: '**', renderMode: RenderMode.Server`)
- CSR explicit pentru rutele de administrare:
  - `/addproduct` → RenderMode.Client
  - `/adminbanner` → RenderMode.Client

Motivație și avantaje:
- SSR (rute publice):
  - SEO, TTFB bun, meta dinamic setat la pre-randare
  - Acces read-only la Firestore via REST (fără SDK browser pe server)
- CSR (admin):
  - Realtime updates cu Firestore SDK (onSnapshot)
  - Upload la Firebase Storage din browser
  - Interacțiuni directe cu SDK-urile client (autentificare, permisiuni)

Implementare servicii:
- CSR:
  - produse: src/app/services/csr/csr-products-service.ts
    - Firestore SDK (getDocs, addDoc, doc, getDoc, setDoc)
    - Gestionare tag-uri la adăugarea produselor
  - bannere: src/app/services/csr/csr-banner-service.ts
    - BehaviorSubject pentru flux realtime (onSnapshot + query(orderBy('order')))
    - Upload imagini: uploadBytes + getDownloadURL pe Firebase Storage
- SSR:
  - bannere: src/app/services/ssr/ssr-banner-service.ts
    - HttpClient → Firestore REST API
    - Mapare tipuri (integerValue/doubleValue) la Banner
    - Sortare după order
  - produse: src/app/services/ssr/ssr-products-service.ts
    - Interfață pentru compatibilitate cu varianta CSR

---

## Pattern‑uri de design și tehnici folosite

- Layered / Repository-like services
  - Serviciile CSR/SSR acționează ca strat de acces la date pentru UI.
- Strategy (prin Interfețe + variante CSR/SSR)
  - Interfețe: ProductsServiceInterface, BannerServiceInterface
  - Implementări paralele CSR vs SSR, selectate în funcție de mediul/ruta de randare.
- Observer / Pub-Sub
  - RxJS Observables, BehaviorSubject
  - Firestore onSnapshot → push realtime către UI (bannere CSR)
- Singleton (Angular DI)
  - Injectable({ providedIn: 'root' }) pentru servicii partajate global
- Adapter
  - SSR BannerService adaptează răspunsul Firestore REST (fields.*Value) la modelul Banner
- Separation of Concerns
  - Pipe dedicat filtrării/sortării (ProductFilterPipe)
  - Stiluri modulare și utilitare via Tailwind în SCSS
- SEO on-page
  - Actualizare Meta/Title, OG/Twitter Cards, JSON‑LD per component

---

## Modele de date

Product (indicativ, pe baza utilizării în cod):
- id (string)
- name (string)
- type (string)
- price (number)
- quantity (number)
- unit (string)
- origine, calitatea (string)
- imageUrl, thumbnailUrl (string)
- order (number, opțional)
- tags (string, ex: listă separată prin virgulă)
- newPice (probabil newPrice) – preț promoțional

Banner:
- id (string)
- title (string)
- description (string)
- imageUrl (string)
- link (string)
- order (number)
- backgroundColor (string)
- price, oldPrice (number, opțional)
- unit (string, opțional)
- createdAt, updatedAt (gestionate în CSR cu serverTimestamp)

---

## SEO și Social Sharing

Setare dinamică în componente (ex: CatalogProduse, PaginaProdus):
- Meta standard: title, description, keywords, author, robots
- Open Graph: og:title, og:description, og:image, og:url
- Twitter Cards: twitter:card, twitter:image
- JSON‑LD Schema.org:
  - Pagina produs: tip Product (name, image, sku, offers etc.)
  - Catalog: fragment generic de Product pentru listă

Notă: Pentru JSON‑LD, este recomandat un <script type="application/ld+json"> injectat în DOM (pe SSR via templating sau pe CSR via Renderer2), nu meta name="application/ld+json".

---

## Mediul și configurarea

Firebase
- Firestore: colecții „products”, „banners” și document „metadata/tags”
- Storage: „banners/*”, „products/*”
- Config client: src/app/firebase.config.ts (db, storage exportate)
- Config SSR:
  - Firestore REST folosește `projectId = 'aprozar-magurele-3ec90'` (vezi SsrBannerService)
  - Bază REST: https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents

Variabile și chei
- Nu comitați secretele în cod.
- Mutați valori sensibile (ID proiect, chei API) în medii dedicate:
  - Angular environment.* sau mecanism de runtime config.
  - Setări la build/deploy pentru SSR.

Tailwind
- tailwind.config.js include scanare fișiere Angular: "./src/**/*.{html,ts}"
- src/styles.scss activează @tailwind base/components/utilities

---

## Rulare locală și comenzi utile

Pre-rechizite
- Node.js 18+ (recomandat 18/20 LTS)
- npm sau pnpm
- Cont Firebase cu proiectul configurat (Firestore + Storage)

Instalare
- npm install

Dev
- npm run start
  - Rulează aplicația în mod dev (CSR + SSR dacă este configurat).
- npm run start:ssr (dacă este definit) / ng serve --ssr
  - Serve cu server-side rendering.

Build
- npm run build
  - Build de producție pentru client.
- npm run build:ssr (dacă este definit)
  - Build pentru server SSR.

Testare
- npm test

Notă: Comenzile exacte depind de scripts din package.json. Dacă lipsesc, adăugați scripturile Angular CLI și SSR corespunzătoare.

---

## Deploy

Opțiuni uzuale:
- Firebase Hosting + funcție/SSR server (sau Cloud Run)
- Google Cloud Run pentru serverul SSR, cu frontend static pe Hosting/CDN
- Configurați rewrites/proxy pentru rutele SSR și fișierele statice

Checklist:
- Setați variabilele de mediu (ID proiect, endpointuri) pe mediu.
- Activați cache headers pentru assets.
- Verificați regulile Firestore pentru accesul public (read-only la documentele necesare).

---

## Testare

- Unit test exemplu pentru ProductFilterPipe:
  - src/app/pipes/product-filter-pipe-pipe.spec.ts
- Recomandare:
  - Adăugați teste pentru servicii (mapări REST → modele), componente (SEO meta), pipe (filtrare/sortare).

---

## Referințe în cod (exemple)

- Control randare SSR/CSR: src/app/app.routes.server.ts
- Produse (CSR): src/app/services/csr/csr-products-service.ts
- Bannere (CSR): src/app/services/csr/csr-banner-service.ts
- Bannere (SSR, REST): src/app/services/ssr/ssr-banner-service.ts
- Catalog + SEO: src/app/components/user-view/catalog-produse/catalog-produse.ts
- Pagină produs + JSON‑LD: src/app/components/user-view/pagina-produs/pagina-produs.ts
- Tailwind: tailwind.config.js, src/styles.scss
- Filtrare/sortare: src/app/pipes/product-filter-pipe-pipe.ts