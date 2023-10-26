import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaClienteAnonimoComponent } from './alta-cliente-anonimo.component';

describe('AltaClienteAnonimoComponent', () => {
  let component: AltaClienteAnonimoComponent;
  let fixture: ComponentFixture<AltaClienteAnonimoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaClienteAnonimoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaClienteAnonimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
