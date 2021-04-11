import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDeliveryMan, DeliveryMan } from '../delivery-man.model';
import { DeliveryManService } from '../service/delivery-man.service';

@Component({
  selector: 'jhi-delivery-man-update',
  templateUrl: './delivery-man-update.component.html',
})
export class DeliveryManUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    phone: [null, [Validators.required, Validators.pattern('[0-9]*')]],
    name: [null, [Validators.required, Validators.minLength(2), Validators.pattern('[a-z]*')]],
  });

  constructor(protected deliveryManService: DeliveryManService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deliveryMan }) => {
      this.updateForm(deliveryMan);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const deliveryMan = this.createFromForm();
    if (deliveryMan.id !== undefined) {
      this.subscribeToSaveResponse(this.deliveryManService.update(deliveryMan));
    } else {
      this.subscribeToSaveResponse(this.deliveryManService.create(deliveryMan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDeliveryMan>>): void {
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

  protected updateForm(deliveryMan: IDeliveryMan): void {
    this.editForm.patchValue({
      id: deliveryMan.id,
      phone: deliveryMan.phone,
      name: deliveryMan.name,
    });
  }

  protected createFromForm(): IDeliveryMan {
    return {
      ...new DeliveryMan(),
      id: this.editForm.get(['id'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
