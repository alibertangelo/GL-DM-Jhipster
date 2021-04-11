jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DeliveryManService } from '../service/delivery-man.service';
import { IDeliveryMan, DeliveryMan } from '../delivery-man.model';

import { DeliveryManUpdateComponent } from './delivery-man-update.component';

describe('Component Tests', () => {
  describe('DeliveryMan Management Update Component', () => {
    let comp: DeliveryManUpdateComponent;
    let fixture: ComponentFixture<DeliveryManUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let deliveryManService: DeliveryManService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DeliveryManUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DeliveryManUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DeliveryManUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      deliveryManService = TestBed.inject(DeliveryManService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const deliveryMan: IDeliveryMan = { id: 456 };

        activatedRoute.data = of({ deliveryMan });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(deliveryMan));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const deliveryMan = { id: 123 };
        spyOn(deliveryManService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ deliveryMan });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: deliveryMan }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(deliveryManService.update).toHaveBeenCalledWith(deliveryMan);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const deliveryMan = new DeliveryMan();
        spyOn(deliveryManService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ deliveryMan });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: deliveryMan }));
        saveSubject.complete();

        // THEN
        expect(deliveryManService.create).toHaveBeenCalledWith(deliveryMan);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const deliveryMan = { id: 123 };
        spyOn(deliveryManService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ deliveryMan });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(deliveryManService.update).toHaveBeenCalledWith(deliveryMan);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
