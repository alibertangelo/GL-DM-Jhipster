import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { IDeliveryMan } from 'app/entities/delivery-man/delivery-man.model';
import { IClient } from 'app/entities/client/client.model';

export interface IOrder {
  id?: number;
  orderId?: number;
  description?: string | null;
  price?: number;
  restaurant?: IRestaurant | null;
  deliveryMan?: IDeliveryMan | null;
  client?: IClient | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public orderId?: number,
    public description?: string | null,
    public price?: number,
    public restaurant?: IRestaurant | null,
    public deliveryMan?: IDeliveryMan | null,
    public client?: IClient | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
