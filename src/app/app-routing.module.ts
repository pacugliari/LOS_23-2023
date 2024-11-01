import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { AltaDuenioComponent } from './components/alta-duenio/alta-duenio.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AltaClienteComponent } from './components/alta-cliente/alta-cliente.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { AltaClienteAnonimoComponent } from './components/alta-cliente-anonimo/alta-cliente-anonimo.component';
import { AltaMesaComponent } from './components/alta-mesa/alta-mesa.component';
import { ListadoMesasComponent } from './components/listado-mesas/listado-mesas.component';
import { AltaEmpleadosComponent } from './components/alta-empleados/alta-empleados.component';
import { AltaProductosComponent } from './components/alta-productos/alta-productos.component';
import { ListadoProductosComponent } from './components/listado-productos/listado-productos.component';
import { HomeEmpleadoComponent } from './components/home-empleado/home-empleado.component';
import { ClientesPendientesComponent } from './components/clientes-pendientes/clientes-pendientes.component';
import { ListaEncuestasComponent } from './components/lista-encuestas/lista-encuestas.component';
import { ChatMozoComponent } from './components/chat-mozo/chat-mozo.component';
import { ListadoChatsComponent } from './components/listado-chats/listado-chats.component';
import { HomeClienteComponent } from './components/home-cliente/home-cliente.component';
import { EncuestaSupervisorComponent } from './components/encuesta-supervisor/encuesta-supervisor.component';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MemotestComponent } from './components/memotest/memotest.component';
import { GraficoClientesComponent } from './components/grafico-clientes/grafico-clientes.component';
import { EncuestasClientesComponent } from './components/encuestas-clientes/encuestas-clientes.component';
import { MayormenorComponent } from './components/mayormenor/mayormenor.component';
import { ListadoPedidosComponent } from './components/listado-pedidos/listado-pedidos.component';
import { EncuestasSupervisorComponent } from './components/encuestas-supervisor/encuestas-supervisor.component';
import { JuegosComponent } from './components/juegos/juegos.component';
import { EncuestaEmpleadosComponent } from './components/encuesta-empleados/encuesta-empleados.component';
import { GraficoEmpleadosComponent } from './components/grafico-empleados/grafico-empleados.component';
import { GraficoSupervisorComponent } from './components/grafico-supervisor/grafico-supervisor.component';


const routes: Routes = [
  { path: 'splash-animado', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'alta/dueño',component: AltaDuenioComponent},
  { path: 'spinner', component: SpinnerComponent },
  { path: 'clientes-pendientes', component: ClientesPendientesComponent },
  { path: 'listadoEncuestas', component: ListaEncuestasComponent },
  { path: 'alta/cliente', component: AltaClienteComponent },
  { path: 'encuesta/supervisor', component: EncuestaSupervisorComponent },
  { path: 'encuenstaS', component: EncuestasSupervisorComponent },
  { path: 'juegos', component: JuegosComponent },
  { path: 'mayormenor', component: MayormenorComponent },
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'memotest', component: MemotestComponent },
  { path: 'graficoSupervisor', component: GraficoSupervisorComponent },
  { path: 'graficoEmpleados', component: GraficoEmpleadosComponent },
  { path: 'grafico/clientes', component: GraficoClientesComponent },
  { path: 'encuestas/clientes', component: EncuestasClientesComponent },
  { path: 'alta/clienteAnonimo', component: AltaClienteAnonimoComponent },
  { path: 'alta/mesa', component: AltaMesaComponent },
  { path: 'registroCliente', component: RegistroClienteComponent },
  { path: 'lista/mesas', component: ListadoMesasComponent },
  { path: 'listado/productos', component: ListadoProductosComponent },
  { path: 'chatMozo/:chatID', component: ChatMozoComponent },
  { path: 'homeEmpleado/:indice', component: HomeEmpleadoComponent },
  { path: 'alta-empleados',component:AltaEmpleadosComponent},
  { path: 'chats', component: ListadoChatsComponent },
  { path: 'encuestaEmpleado', component:   EncuestaEmpleadosComponent },
  { path: 'alta-productos',component:AltaProductosComponent},
  { path: 'homeCliente', component: HomeClienteComponent },
  { path: '', redirectTo: 'splash-animado', pathMatch: 'full'},
  { path: '**',redirectTo: 'splash-animado',pathMatch: 'full',},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
