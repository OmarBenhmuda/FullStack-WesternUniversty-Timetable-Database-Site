import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseresultsComponent } from './courseresults.component';

describe('CourseresultsComponent', () => {
  let component: CourseresultsComponent;
  let fixture: ComponentFixture<CourseresultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseresultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
