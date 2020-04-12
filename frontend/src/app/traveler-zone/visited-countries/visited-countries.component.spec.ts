import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitedCountriesComponent } from './visited-countries.component';

describe('VisitedCountriesComponent', () => {
  let component: VisitedCountriesComponent;
  let fixture: ComponentFixture<VisitedCountriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitedCountriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitedCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
