import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Displaytop5Component } from './displaytop5.component';

describe('Displaytop5Component', () => {
  let component: Displaytop5Component;
  let fixture: ComponentFixture<Displaytop5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Displaytop5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Displaytop5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
