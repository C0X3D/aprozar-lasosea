export interface Banner {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  backgroundColor:string,
  price?:number,
  oldPrice?:number,
  unit?:string
}
