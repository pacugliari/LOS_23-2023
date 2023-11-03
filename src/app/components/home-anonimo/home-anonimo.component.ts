import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/services/storage.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-anonimo',
  templateUrl: './home-anonimo.component.html',
  styleUrls: ['./home-anonimo.component.scss'],
})
export class HomeAnonimoComponent implements OnInit {
  navController: any;
  scannedBarCode: any;
  encuestas: any[] = [];
  constructor(
    private usuarioService: UsuarioService,
    formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private pushNotService: PushNotificationService,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}
  async ngOnInit() {
    await this.cargarEncuestas();
  }
  async leerDocumento() {
    this.barcodeScanner
      .scan({ formats: 'QR_CODE' })
      .then(async (res) => {
        this.scannedBarCode = res;
        let userQR = this.scannedBarCode['text'];

        if (userQR === 'Estasenlistadeespera') {
          await this.mandarNotificacionPush();
        } else {
          this.mensajesService.mostrar(
            'NO VALIDO',
            'Primero debe estar en la lista de espera, escanee el qr del local',
            'error'
          );
        }
      })
      .catch((err) => {
        this.mensajesService.mostrar(
          'ERROR',
          'Error al leer el QR del documento',
          'error'
        );
      });
  }
  async cargarEncuestas() {
    this.encuestas = await this.firestoreService.obtener('encuestas');
    console.log(this.encuestas);
    console.log(this.encuestas);
  }
  async mandarNotificacionPush() {
    let metres = await this.firestoreService.obtener('usuarios');
    metres = metres.filter((element) => {
      return element.data.tipo === 'metre';
    });
    if (metres.length > 0) {
      this.pushNotService
        .sendPushNotification({
          registration_ids: metres.map((element) => element.data.tokenPush),
          notification: {
            title: 'Registro de nuevo cliente anonimo',
            body: 'El cliente anónimo está esperando una mesa en la lista de espera.',
          },
        })
        .subscribe((data) => {
          console.log(data);
        });
    } else {
      console.log('No se encontraron metres para enviar notificaciones.');
    }
  }

  salir() {
    this.usuarioService.salir();
  }
}
