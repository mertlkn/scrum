import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackJiraComponent } from './callback-jira.component';

describe('CallbackJiraComponent', () => {
  let component: CallbackJiraComponent;
  let fixture: ComponentFixture<CallbackJiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallbackJiraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackJiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
