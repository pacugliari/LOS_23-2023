import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaEmpleadosComponent } from './alta-empleados.component';

describe('AltaEmpleadosComponent', () => {
  let component: AltaEmpleadosComponent;
  let fixture: ComponentFixture<AltaEmpleadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaEmpleadosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
