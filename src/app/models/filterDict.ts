import { ProductType } from "./enums/productType";

export class FilterDict{
  public static readonly sortTypes = [
  { value: ProductType.All, label: 'Toate tipurile' },
  { value: ProductType.Fruct, label: 'Fructe' },
  { value: ProductType.Citrice, label: 'Citrice' },
  { value: ProductType.Leguma, label: 'Legume' },
  { value: ProductType.Radacinoasa, label: 'Rădăcinoase' },
  { value: ProductType.Verdeata, label: 'Verdeață' },
  { value: ProductType.Ciuperca, label: 'Ciuperci' },
  { value: ProductType.Altele, label: 'Altele' }
];

public static commonTags = [
    'bio', 'dulce', 'românesc', 'import', 'eco', 'nou', 'proaspăt', 'ieftin'
  ];
}
