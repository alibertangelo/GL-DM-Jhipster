import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRestaurant, Restaurant } from '../restaurant.model';
import { RestaurantService } from '../service/restaurant.service';

@Component({
  selector: 'jhi-restaurant-update',
  templateUrl: './restaurant-update.component.html',
})
export class RestaurantUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    restaurantId: [null, [Validators.required]],
    title: [null, [Validators.required]],
    location: [null, [Validators.required]],
    mark: [],
  });

  constructor(protected restaurantService: RestaurantService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurant }) => {
      this.updateForm(restaurant);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const restaurant = this.createFromForm();
    if (restaurant.id !== undefined) {
      this.subscribeToSaveResponse(this.restaurantService.update(restaurant));
    } else {
      this.subscribeToSaveResponse(this.restaurantService.create(restaurant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRestaurant>>): void {
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

  protected updateForm(restaurant: IRestaurant): void {
    this.editForm.patchValue({
      id: restaurant.id,
      restaurantId: restaurant.restaurantId,
      title: restaurant.title,
      location: restaurant.location,
      mark: restaurant.mark,
    });
  }

  protected createFromForm(): IRestaurant {
    return {
      ...new Restaurant(),
      id: this.editForm.get(['id'])!.value,
      restaurantId: this.editForm.get(['restaurantId'])!.value,
      title: this.editForm.get(['title'])!.value,
      location: this.editForm.get(['location'])!.value,
      mark: this.editForm.get(['mark'])!.value,
    };
  }
}
