import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DeliveryManService } from '../service/delivery-man.service';

import { DeliveryManComponent } from './delivery-man.component';

describe('Component Tests', () => {
  describe('DeliveryMan Management Component', () => {
    let comp: DeliveryManComponent;
    let fixture: ComponentFixture<DeliveryManComponent>;
    let service: DeliveryManService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DeliveryManComponent],
      })
        .overrideTemplate(DeliveryManComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DeliveryManComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DeliveryManService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.deliveryMen?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
