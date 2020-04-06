import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateBioComponent } from './dialog-update-bio.component';

describe('DialogUpdateBioComponent', () => {
  let component: DialogUpdateBioComponent;
  let fixture: ComponentFixture<DialogUpdateBioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUpdateBioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
