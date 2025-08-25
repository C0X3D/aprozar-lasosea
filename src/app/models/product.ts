import { ProductType } from "./enums/productType";

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  newPice?: number;
  quantity: number;
  calitatea: number;
  origine: string;
  unit: string;
  imageUrl: string;
  thumbnailUrl:string | undefined;
  bio?: boolean;
  tags?: string;
  order?: number;
}


