import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionnaireComponent } from './create-questionnaire.component';

describe('CreateQuestionnaireComponent', () => {
  let component: CreateQuestionnaireComponent;
  let fixture: ComponentFixture<CreateQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuestionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
