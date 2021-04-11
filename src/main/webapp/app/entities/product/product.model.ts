import { IRestaurant } from 'app/entities/restaurant/restaurant.model';

export interface IProduct {
  id?: number;
  productId?: number;
  name?: string;
  description?: string | null;
  price?: number;
  restaurant?: IRestaurant | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public productId?: number,
    public name?: string,
    public description?: string | null,
    public price?: number,
    public restaurant?: IRestaurant | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
