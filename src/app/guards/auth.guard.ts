import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajeService } from '../services/mensaje.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private mensajesService:MensajeService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const usuario  = localStorage.getItem('usuario');

    if (usuario) {
      return true;
    } else {
      this.mensajesService.mostrar("","Usuario no autorizado","error")
      this.router.navigate(['login'], { replaceUrl: true });
      return false;
    }
  }
}

