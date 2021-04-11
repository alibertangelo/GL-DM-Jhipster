import { IOrder } from 'app/entities/order/order.model';

export interface IDeliveryMan {
  id?: number;
  phone?: string;
  name?: string;
  orders?: IOrder[] | null;
}

export class DeliveryMan implements IDeliveryMan {
  constructor(public id?: number, public phone?: string, public name?: string, public orders?: IOrder[] | null) {}
}

export function getDeliveryManIdentifier(deliveryMan: IDeliveryMan): number | undefined {
  return deliveryMan.id;
}
