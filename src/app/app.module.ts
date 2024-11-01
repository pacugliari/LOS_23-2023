import { NgModule } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
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
import { GraficoClientesComponent } from './components/grafico-clientes/grafico-clientes.component';
import { ClientesPendientesComponent } from './components/clientes-pendientes/clientes-pendientes.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeClienteComponent } from './components/home-cliente/home-cliente.component';
import { MemotestComponent } from './components/memotest/memotest.component';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { EncuestasClientesComponent } from './components/encuestas-clientes/encuestas-clientes.component';
import { MayormenorComponent } from './components/mayormenor/mayormenor.component';
import { ListaEncuestasComponent } from './components/lista-encuestas/lista-encuestas.component';
import { ChatMozoComponent } from './components/chat-mozo/chat-mozo.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ListadoPedidosComponent } from './components/listado-pedidos/listado-pedidos.component';
import { ListadoChatsComponent } from './components/listado-chats/listado-chats.component';
import { EncuestasSupervisorComponent } from './components/encuestas-supervisor/encuestas-supervisor.component';
import { JuegosComponent } from './components/juegos/juegos.component';
import { EncuestaEmpleadosComponent } from './components/encuesta-empleados/encuesta-empleados.component';
import { GraficoEmpleadosComponent } from './components/grafico-empleados/grafico-empleados.component';
import { GraficoSupervisorComponent } from './components/grafico-supervisor/grafico-supervisor.component';
import { EncuestaSupervisorComponent } from './components/encuesta-supervisor/encuesta-supervisor.component';


@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LoginComponent,
    JuegosComponent,
    AltaDuenioComponent,
    SpinnerComponent,
    GraficoEmpleadosComponent,
    GraficoSupervisorComponent,
    EncuestaEmpleadosComponent,
    EncuestasClientesComponent,
    AhorcadoComponent,
    MemotestComponent,
    EncuestasSupervisorComponent,
    MayormenorComponent,
    HomeComponent,
    ListaEncuestasComponent,
    ListadoProductosComponent,
    AltaClienteComponent,
    AltaProductosComponent,
    MemotestComponent,
    AhorcadoComponent,
    AltaEmpleadosComponent,
    GraficoClientesComponent,
    AltaClienteAnonimoComponent,
    RegistroClienteComponent,
    AltaMesaComponent,
    HomeEmpleadoComponent,
    ListadoMesasComponent,
    ClientesPendientesComponent,
    HomeClienteComponent,
    ChatMozoComponent,
    DateFormatPipe,
    ListadoPedidosComponent,
    ListadoChatsComponent,
    EncuestaSupervisorComponent,
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
