import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPosteClientsComponent } from './info-poste-clients.component';

describe('InfoPosteClientsComponent', () => {
  let component: InfoPosteClientsComponent;
  let fixture: ComponentFixture<InfoPosteClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPosteClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPosteClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
