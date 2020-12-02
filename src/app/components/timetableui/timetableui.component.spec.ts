import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableuiComponent } from './timetableui.component';

describe('TimetableuiComponent', () => {
  let component: TimetableuiComponent;
  let fixture: ComponentFixture<TimetableuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableuiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
