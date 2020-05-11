import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIngredientsComponent } from './select-ingredients.component';

describe('SelectIngredientsComponent', () => {
  let component: SelectIngredientsComponent;
  let fixture: ComponentFixture<SelectIngredientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectIngredientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
