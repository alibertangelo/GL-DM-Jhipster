jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderService } from '../service/order.service';
import { IOrder, Order } from '../order.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';
import { IDeliveryMan } from 'app/entities/delivery-man/delivery-man.model';
import { DeliveryManService } from 'app/entities/delivery-man/service/delivery-man.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Component Tests', () => {
  describe('Order Management Update Component', () => {
    let comp: OrderUpdateComponent;
    let fixture: ComponentFixture<OrderUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let orderService: OrderService;
    let restaurantService: RestaurantService;
    let deliveryManService: DeliveryManService;
    let clientService: ClientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrderUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      orderService = TestBed.inject(OrderService);
      restaurantService = TestBed.inject(RestaurantService);
      deliveryManService = TestBed.inject(DeliveryManService);
      clientService = TestBed.inject(ClientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call restaurant query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const restaurant: IRestaurant = { id: 31271 };
        order.restaurant = restaurant;

        const restaurantCollection: IRestaurant[] = [{ id: 80141 }];
        spyOn(restaurantService, 'query').and.returnValue(of(new HttpResponse({ body: restaurantCollection })));
        const expectedCollection: IRestaurant[] = [restaurant, ...restaurantCollection];
        spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(restaurantService.query).toHaveBeenCalled();
        expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(restaurantCollection, restaurant);
        expect(comp.restaurantsCollection).toEqual(expectedCollection);
      });

      it('Should call DeliveryMan query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const deliveryMan: IDeliveryMan = { id: 30443 };
        order.deliveryMan = deliveryMan;

        const deliveryManCollection: IDeliveryMan[] = [{ id: 95809 }];
        spyOn(deliveryManService, 'query').and.returnValue(of(new HttpResponse({ body: deliveryManCollection })));
        const additionalDeliveryMen = [deliveryMan];
        const expectedCollection: IDeliveryMan[] = [...additionalDeliveryMen, ...deliveryManCollection];
        spyOn(deliveryManService, 'addDeliveryManToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(deliveryManService.query).toHaveBeenCalled();
        expect(deliveryManService.addDeliveryManToCollectionIfMissing).toHaveBeenCalledWith(
          deliveryManCollection,
          ...additionalDeliveryMen
        );
        expect(comp.deliveryMenSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Client query and add missing value', () => {
        const order: IOrder = { id: 456 };
        const client: IClient = { id: 39825 };
        order.client = client;

        const clientCollection: IClient[] = [{ id: 31201 }];
        spyOn(clientService, 'query').and.returnValue(of(new HttpResponse({ body: clientCollection })));
        const additionalClients = [client];
        const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
        spyOn(clientService, 'addClientToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(clientService.query).toHaveBeenCalled();
        expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, ...additionalClients);
        expect(comp.clientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const order: IOrder = { id: 456 };
        const restaurant: IRestaurant = { id: 7546 };
        order.restaurant = restaurant;
        const deliveryMan: IDeliveryMan = { id: 35859 };
        order.deliveryMan = deliveryMan;
        const client: IClient = { id: 86760 };
        order.client = client;

        activatedRoute.data = of({ order });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(order));
        expect(comp.restaurantsCollection).toContain(restaurant);
        expect(comp.deliveryMenSharedCollection).toContain(deliveryMan);
        expect(comp.clientsSharedCollection).toContain(client);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const order = { id: 123 };
        spyOn(orderService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: order }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(orderService.update).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const order = new Order();
        spyOn(orderService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: order }));
        saveSubject.complete();

        // THEN
        expect(orderService.create).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const order = { id: 123 };
        spyOn(orderService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ order });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(orderService.update).toHaveBeenCalledWith(order);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRestaurantById', () => {
        it('Should return tracked Restaurant primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRestaurantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDeliveryManById', () => {
        it('Should return tracked DeliveryMan primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDeliveryManById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackClientById', () => {
        it('Should return tracked Client primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackClientById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
