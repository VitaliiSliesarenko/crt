import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptTableComponent } from './crypt-table.component';

describe('ExchangeComponent', () => {
  let component: CryptTableComponent;
  let fixture: ComponentFixture<CryptTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
