import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  },
  {
    path: 'addproduct',
    renderMode: RenderMode.Client,
  },
  {
    path: 'adminbanner',
    renderMode: RenderMode.Client,
  }
];
