import { Routes } from '@angular/router';
import { CatalogProduse } from './components/user-view/catalog-produse/catalog-produse';
import { ProductListResolver } from './services/resolvers/product-list.resolver';
import { PaginaProdus } from './components/user-view/pagina-produs/pagina-produs';
import { ProductViewResolver } from './services/resolvers/product-view.resolver';
import { AddProduct } from './components/admin/add-product/add-product';
import { AddBanner } from './components/admin/add-banner/add-banner';

export const routes: Routes = [
  {
    path:'',
    component:CatalogProduse,
    resolve:{
      products:ProductListResolver
    }
  },
  {
    path: 'product/:id',
    component:PaginaProdus,
    resolve: { product: ProductViewResolver }
  },
  {
    path: 'addproduct',
    component:AddProduct
  },
  {
    path: 'adminbanner',
    component:AddBanner
  }
];
