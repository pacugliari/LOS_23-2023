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
const routes: Routes = [
  {
    path: 'splash-animado',component:SplashComponent
  },
  {
    path: 'login',component:LoginComponent
  },
  {
    path: 'home',component:HomeComponent,canActivate: [AuthGuard]
  },
  {
    path: 'alta/dueño',component:AltaDuenioComponent,canActivate: [PerfilGuard]
  },
  {
    path: 'spinner',component:SpinnerComponent
  },
  { path: 'alta/cliente', component: AltaClienteComponent },
  {
    path: '',
    redirectTo: 'splash-animado',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'splash-animado',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
