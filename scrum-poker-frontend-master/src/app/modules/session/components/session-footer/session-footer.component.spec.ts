import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFooterComponent } from './session-footer.component';

describe('FooterSectionComponent', () => {
  let component: SessionFooterComponent;
  let fixture: ComponentFixture<SessionFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
