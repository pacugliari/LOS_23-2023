import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { AltaDuenioComponent } from './components/alta-duenio/alta-duenio.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './components/home/home.component';
import { PerfilGuard } from './guards/perfil.guard';
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
import { EncuestaSupervisorComponent } from './encuesta-supervisor/encuesta-supervisor.component';
import { GraficosSupervisorComponent } from './graficos-supervisor/graficos-supervisor.component';
import { HomeAnonimoComponent } from './components/home-anonimo/home-anonimo.component';
const routes: Routes = [
  {
    path: 'splash-animado',
    component: SplashComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'alta/dueño',
    component: AltaDuenioComponent,
    canActivate: [PerfilGuard],
  },
  
  {
    path: 'spinner',
    component: SpinnerComponent,
  },
  

  { path: 'home/anonimo', component: HomeAnonimoComponent },
  { path: 'alta/cliente', component: AltaClienteComponent },
  { path: 'graficos/supervisor', component:   GraficosSupervisorComponent },
  { path: 'encuesta/supervisor', component: EncuestaSupervisorComponent },
  { path: 'alta/clienteAnonimo', component: AltaClienteAnonimoComponent },
  { path: 'alta/mesa', component: AltaMesaComponent },
  { path: 'registroCliente', component: RegistroClienteComponent },
  { path: 'lista/mesas', component: ListadoMesasComponent },
  { path: 'listado/productos', component: ListadoProductosComponent },
  { path: 'homeEmpleado', component: HomeEmpleadoComponent },
  
  {
    path: 'alta-empleados',component:AltaEmpleadosComponent
  },
  {
    path: 'alta-productos',component:AltaProductosComponent
  },
  {
    path: '',
    redirectTo: 'splash-animado',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'splash-animado',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
