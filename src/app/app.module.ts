import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AltaClienteComponent } from './components/alta-cliente/alta-cliente.component';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { AltaDuenioComponent } from './components/alta-duenio/alta-duenio.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './components/home/home.component';
import { Vibration } from '@ionic-native/vibration/ngx';
import { AltaClienteAnonimoComponent } from './components/alta-cliente-anonimo/alta-cliente-anonimo.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { AltaMesaComponent } from './components/alta-mesa/alta-mesa.component';
import { ListadoMesasComponent } from './components/listado-mesas/listado-mesas.component';

import { QRCodeModule } from 'angularx-qrcode';
import { AltaProductosComponent } from './components/alta-productos/alta-productos.component';
import { AltaEmpleadosComponent } from './components/alta-empleados/alta-empleados.component';
import { ListadoProductosComponent } from './components/listado-productos/listado-productos.component';
import { HomeEmpleadoComponent } from './components/home-empleado/home-empleado.component';
import { HttpClientModule } from '@angular/common/http';
import { ClientesPendientesComponent } from './components/clientes-pendientes/clientes-pendientes.component';
import { HomeClienteComponent } from './components/home-cliente/home-cliente.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MemotestComponent } from './components/memotest/memotest.component';
import { MayormenorComponent } from './components/mayormenor/mayormenor.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LoginComponent,
    AltaDuenioComponent,
    SpinnerComponent,
    MayormenorComponent,
    AhorcadoComponent,
    MemotestComponent,
    HomeComponent,
    ListadoProductosComponent,
    AltaClienteComponent,
    ReservaComponent,
    AltaProductosComponent,
    AltaEmpleadosComponent,
    AltaClienteAnonimoComponent,
    RegistroClienteComponent,
    AltaMesaComponent,
    HomeEmpleadoComponent,
    ListadoMesasComponent,
    ClientesPendientesComponent,
    HomeClienteComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    QRCodeModule,
  ],
  providers: [
    BarcodeScanner,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}