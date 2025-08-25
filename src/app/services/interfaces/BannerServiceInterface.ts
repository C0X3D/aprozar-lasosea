import { Observable } from 'rxjs';
import { Banner } from '../../models/banner';

export interface BannerServiceInterface {
  getBanners(): Observable<Banner[]>;
}
