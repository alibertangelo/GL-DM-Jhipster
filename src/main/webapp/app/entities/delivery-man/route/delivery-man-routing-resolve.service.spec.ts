jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDeliveryMan, DeliveryMan } from '../delivery-man.model';
import { DeliveryManService } from '../service/delivery-man.service';

import { DeliveryManRoutingResolveService } from './delivery-man-routing-resolve.service';

describe('Service Tests', () => {
  describe('DeliveryMan routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DeliveryManRoutingResolveService;
    let service: DeliveryManService;
    let resultDeliveryMan: IDeliveryMan | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DeliveryManRoutingResolveService);
      service = TestBed.inject(DeliveryManService);
      resultDeliveryMan = undefined;
    });

    describe('resolve', () => {
      it('should return IDeliveryMan returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDeliveryMan = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDeliveryMan).toEqual({ id: 123 });
      });

      it('should return new IDeliveryMan if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDeliveryMan = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDeliveryMan).toEqual(new DeliveryMan());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDeliveryMan = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDeliveryMan).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
