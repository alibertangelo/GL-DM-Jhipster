import { IOrder } from 'app/entities/order/order.model';

export interface IClient {
  id?: number;
  phone?: string;
  name?: string;
  surname?: string;
  address?: string;
  orders?: IOrder[] | null;
}

export class Client implements IClient {
  constructor(
    public id?: number,
    public phone?: string,
    public name?: string,
    public surname?: string,
    public address?: string,
    public orders?: IOrder[] | null
  ) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
