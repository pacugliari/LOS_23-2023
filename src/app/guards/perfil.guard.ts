import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import Swal from 'sweetalert2';
import { MensajeService } from '../services/mensaje.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilGuard implements CanActivate {
  constructor(private router: Router,private mensajesService: MensajeService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const user = localStorage.getItem('usuario');

    if (user) {

      let usuario = JSON.parse(user);

      if(usuario.tipo === 'duenio'){
        return true;
      }  
      else{
        this.mensajesService.mostrar("","Usuario no autorizado","error")
        this.router.navigate(['/home'], { replaceUrl: true });
        return false;
      }
        

    } else {
      this.mensajesService.mostrar("","Usuario no autorizado","error")
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }
}