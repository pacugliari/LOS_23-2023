import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private usuarioService: UsuarioService, private router: Router,
    private pushNotService:PushNotificationService) {}

  async ngOnInit() {
    await this.pushNotService.escucharNotificaciones('clientes-pendientes');
  }

  clientesPendientes() {
    this.router.navigate(['clientes-pendientes'], { replaceUrl: true });
  }

  altaSupervisor() {
    this.router.navigate(['alta/dueño'], { replaceUrl: true });
  }
  altaMesa() {
    this.router.navigate(['alta/mesa'], { replaceUrl: true });
  }
  altaEmpleados() {
    this.router.navigate(['alta-empleados'], { replaceUrl: true });
  }
  verMesas() {
    this.router.navigate(['lista/mesas'], { replaceUrl: true });
  }

  async salir() {
    await this.pushNotService.silenciarNotificaciones();
    this.usuarioService.salir();

  }
}
