import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

import { FirestoreService } from 'src/app/services/firestore.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anonimo-pendientes',
  templateUrl: './anonimo-pendientes.component.html',
  styleUrls: ['./anonimo-pendientes.component.scss'],
})
export class AnonimoPendientesComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private emailService: EmailService,
    private firestoreService: FirestoreService,
    private pushNotService: PushNotificationService,
    private router: Router
  ) {}

  AnonimosPendientes: any[] = [];
  cargando: boolean = false;

  async ngOnInit() {
    await this.actualizarLista();
  }

  async actualizarLista() {
    await this.firestoreService.obtener('usuarios').then((resultado) => {
      this.AnonimosPendientes = resultado.filter(
        (element) =>
          element.data.clientePendiente &&
          element.data.tipo === 'anonimo' &&
          !element.data.clienteRechazado
      );
      console.log(this.AnonimosPendientes); // Agregar esta línea para visualizar los datos
    });
  }

  verCliente(anonimo: any) {
    Swal.fire({
      title: 'Asignar mesa al cliente?',
      html:
        'Usuario:' + anonimo.data.usuario + '<br>Nombre:' + anonimo.data.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      imageUrl: anonimo.data.foto,
      imageWidth: 300,
      imageHeight: 200,
      showDenyButton: true,
      confirmButtonText: 'Asignar Mesa',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
    }).then(async (result) => {
      this.cargando = true;

      if (result.isConfirmed) {
        
      console.log('MESA ASGINADADADADSA');
        await this.mandarNotificacionPush();
        await Swal.fire({
          title: 'Mesa asignada',
          icon: 'success',
          heightAuto: false,
        });
      } 

      await this.actualizarLista();     

    });
  }

  async atras() {
    this.router.navigate(['home'], { replaceUrl: true });
  }

  async mandarNotificacionPush() {
    const mesas = await this.firestoreService.obtener('mesas');

    const mesasDisponibles = mesas.filter(
      (mesa) => mesa.data.estado === 'disponible'
    );

    if (mesasDisponibles.length > 0) {
      for (const cliente of this.AnonimosPendientes) {
        // asignacion a la primera disponible
        const mesaAsignada = mesasDisponibles.pop(); 

        if (mesaAsignada) {

          mesaAsignada.data.estado = 'ocupada';
          mesaAsignada.data.clienteId = cliente.id;

          await this.firestoreService.modificar(mesaAsignada, 'mesas');

          this.pushNotService
            .sendPushNotification({
              registration_ids: [cliente.data.tokenPush],
              notification: {
                title: 'Mesa asignada',
                body: `Se te ha asignado la mesa ${mesaAsignada.data.numero}.`,
              },
            })
            .subscribe((data) => {
              console.log(data);
            });
        }
      }
      console.log('Asignación de mesas completada.');
    } else {
      console.log('No hay mesas disponibles para asignar.');
    }
  }
}
