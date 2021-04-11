import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';
import { IDeliveryMan } from 'app/entities/delivery-man/delivery-man.model';
import { DeliveryManService } from 'app/entities/delivery-man/service/delivery-man.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;

  restaurantsCollection: IRestaurant[] = [];
  deliveryMenSharedCollection: IDeliveryMan[] = [];
  clientsSharedCollection: IClient[] = [];

  editForm = this.fb.group({
    id: [],
    orderId: [null, [Validators.required]],
    description: [],
    price: [null, [Validators.required]],
    restaurant: [],
    deliveryMan: [],
    client: [],
  });

  constructor(
    protected orderService: OrderService,
    protected restaurantService: RestaurantService,
    protected deliveryManService: DeliveryManService,
    protected clientService: ClientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.updateForm(order);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackRestaurantById(index: number, item: IRestaurant): number {
    return item.id!;
  }

  trackDeliveryManById(index: number, item: IDeliveryMan): number {
    return item.id!;
  }

  trackClientById(index: number, item: IClient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      orderId: order.orderId,
      description: order.description,
      price: order.price,
      restaurant: order.restaurant,
      deliveryMan: order.deliveryMan,
      client: order.client,
    });

    this.restaurantsCollection = this.restaurantService.addRestaurantToCollectionIfMissing(this.restaurantsCollection, order.restaurant);
    this.deliveryMenSharedCollection = this.deliveryManService.addDeliveryManToCollectionIfMissing(
      this.deliveryMenSharedCollection,
      order.deliveryMan
    );
    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing(this.clientsSharedCollection, order.client);
  }

  protected loadRelationshipsOptions(): void {
    this.restaurantService
      .query({ filter: 'order-is-null' })
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing(restaurants, this.editForm.get('restaurant')!.value)
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsCollection = restaurants));

    this.deliveryManService
      .query()
      .pipe(map((res: HttpResponse<IDeliveryMan[]>) => res.body ?? []))
      .pipe(
        map((deliveryMen: IDeliveryMan[]) =>
          this.deliveryManService.addDeliveryManToCollectionIfMissing(deliveryMen, this.editForm.get('deliveryMan')!.value)
        )
      )
      .subscribe((deliveryMen: IDeliveryMan[]) => (this.deliveryMenSharedCollection = deliveryMen));

    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      orderId: this.editForm.get(['orderId'])!.value,
      description: this.editForm.get(['description'])!.value,
      price: this.editForm.get(['price'])!.value,
      restaurant: this.editForm.get(['restaurant'])!.value,
      deliveryMan: this.editForm.get(['deliveryMan'])!.value,
      client: this.editForm.get(['client'])!.value,
    };
  }
}
