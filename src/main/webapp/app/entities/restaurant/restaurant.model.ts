import { IProduct } from 'app/entities/product/product.model';

export interface IRestaurant {
  id?: number;
  restaurantId?: number;
  title?: string;
  location?: string;
  mark?: number | null;
  products?: IProduct[] | null;
}

export class Restaurant implements IRestaurant {
  constructor(
    public id?: number,
    public restaurantId?: number,
    public title?: string,
    public location?: string,
    public mark?: number | null,
    public products?: IProduct[] | null
  ) {}
}

export function getRestaurantIdentifier(restaurant: IRestaurant): number | undefined {
  return restaurant.id;
}
