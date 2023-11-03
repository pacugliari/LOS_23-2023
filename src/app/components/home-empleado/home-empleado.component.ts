import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home-empleado',
  templateUrl: './home-empleado.component.html',
  styleUrls: ['./home-empleado.component.scss'],
})
export class HomeEmpleadoComponent implements OnInit {
  private tipo: string = '';
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private pushNotService: PushNotificationService
  ) {}

  async ngOnInit() {
    const usuario = this.usuarioService.getUsuarioLogueado();
    if (usuario.tipo == 'metre') {
      console.log('el metre esta escuchando');
      await this.pushNotService.escucharNotificaciones('anonimo-pendientes');
    }
  }

  verProductos() {
    this.router.navigate(['listado/productos'], { replaceUrl: true });
  }
  altaProductos() {
    this.router.navigate(['alta-productos'], { replaceUrl: true });
  }

  salir() {
    this.usuarioService.salir();
  }
}
