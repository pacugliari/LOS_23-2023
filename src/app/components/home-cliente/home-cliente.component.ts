import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRs } from 'src/app/models/QR';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

enum EstadoMesa {
  NoVinculada = 'NoVinculada',
  Vinculada = 'Vinculada',
}

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
})
export class HomeClienteComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private pushNotService: PushNotificationService,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private router: Router,
    private firestoreService: FirestoreService
  ) {}

  scannedBarCode: any;
  mesas: any;
  usuario: any;

  async ngOnInit() {
    this.mesas = await this.firestoreService.obtener('mesas');
    await this.actualizarUsuario();
  }

  async salir() {
    this.usuarioService.salir();
  }

  irEncuestas() {
    this.router.navigate(['listadoEncuestas'], { replaceUrl: true });
  }

  verProductos() {
    this.router.navigate(['listado/productos'], { replaceUrl: true });
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
            title: 'Ingreso al local',
            body: 'Hay un cliente que está esperando una mesa en la lista de espera.',
          },
        })
        .subscribe((data) => {
          console.log(data);
        });
    } else {
      console.log('No se encontraron metres para enviar notificaciones.');
    }
  }

  async actualizarUsuario() {
    let usuarioLog = this.usuarioService.getUsuarioLogueado();
    let usuarios = await this.firestoreService.obtener('usuarios');
    this.usuario = usuarios.filter(
      (usuario: any) => usuario.id === usuarioLog.id
    )[0];
    console.log(JSON.stringify(this.usuario));
  }

  async leerDocumento() {
    await this.barcodeScanner
      .scan({ formats: 'QR_CODE' })
      .then(async (res) => {
        this.scannedBarCode = res;
      })
      .catch((err) => {
        this.mensajesService.mostrar(
          'ERROR',
          'Error al leer el QR del documento',
          'error'
        );
      });
    let userQR = this.scannedBarCode['text'];
    let parametros = userQR.split(':');

    let usuarioLog = this.usuarioService.getUsuarioLogueado();
    let usuarios = await this.firestoreService.obtener('usuarios');
    this.usuario = usuarios.filter(
      (usuario: any) => usuario.id === usuarioLog.id
    )[0];

    console.log(JSON.stringify(this.usuario));

    console.log(1);
    if (
      userQR === QRs.IngresoLocal &&
      this.usuario?.data?.enListaEspera !== 'Espera'
    ) {
      this.mensajesService.mostrar(
        'OK',
        'Ingresaste a la mesa de espera, debes esperar que un metre te asigne una mesa',
        'success'
      );
      await this.mandarNotificacionPush();
      this.usuario.data.enListaEspera = 'Espera';
      this.usuario.data.estadoMesa = EstadoMesa.NoVinculada;
      await this.firestoreService.modificar(this.usuario, 'usuarios');
      console.log(2);
    } else if (
      parametros[0] === QRs.Mesa &&
      this.usuario?.data?.enListaEspera === 'Asignada'
    ) {
      let idMesa = parametros[1];
      this.mesas = await this.firestoreService.obtener('mesas');
      let aux = this.mesas.filter(
        (mesa: any) => mesa.data.cliente.id === this.usuario.id
      )[0];
      console.log(3);
      if (
        aux.id === idMesa &&
        this.usuario.data.estadoMesa === EstadoMesa.NoVinculada
      ) {
        this.usuario.data.estadoMesa = EstadoMesa.Vinculada;
        await this.firestoreService.modificar(this.usuario, 'usuarios');

        console.log(4);
        this.mensajesService.mostrar(
          'OK',
          'Mesa vinculada de manera correcta',
          'success'
        );
      } else if (this.usuario.data.estadoMesa === EstadoMesa.Vinculada) {
        this.mensajesService.mostrar(
          'ERROR',
          'Usted ya vinculo la mesa',
          'error'
        );
      } else {
        this.mensajesService.mostrar(
          'ERROR',
          'Error la mesa escaneada no es la suya,el numero de mesa de usted es: ' +
            aux.data.numeroMesa,
          'error'
        );
      }
    } else if (this.usuario?.data?.enListaEspera === 'Espera') {
      this.mensajesService.mostrar(
        'ERROR',
        'Usted esta en lista de espera,debe esperar que un metre le asigne mesa',
        'error'
      );
    } else {
      this.mensajesService.mostrar(
        'NO VALIDO',
        'Primero debe estar en la lista de espera, escanee el QR de ingreso al local',
        'error'
      );
    }
  }
}
