import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElemListeComponent } from './elem-liste.component';

describe('ElemListeComponent', () => {
  let component: ElemListeComponent;
  let fixture: ComponentFixture<ElemListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElemListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElemListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
