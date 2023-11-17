import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private firestoreService: FirestoreService,
    private route: ActivatedRoute
  ) {}

  scannedBarCode: any;
  mesas: any;
  usuario: any;
  cargando: boolean = false;
  estado = '';
  habilitarJuegosEncuesta: boolean = false;
  pedidos: any;
  miPedido: any;
  indice = 0;
  titulo = 'Home Clientes';
  detalles: any[] = [];
  descuento = 0;
  propina = 0;
  total = 0;

  async ngOnInit() {
    await this.actualizarUsuario();

    this.route.url.subscribe(async () => {
      this.cargando = true;
      this.mesas = await this.firestoreService.obtener('mesas');

      await this.actualizarUsuario();

      this.pedidos = this.firestoreService.escucharCambios(
        'pedidos',
        async (data) => {
          this.pedidos = data;
          for (let pedido of this.pedidos) {
            if (
              pedido.data.cliente.id === this.usuario.id &&
              pedido.data.estado === 'Entregado'
            ) {
              this.miPedido = pedido;
              if (!pedido.data.entregado) {
                Swal.fire({
                  title: 'Su pedido ya esta listo',
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Confirmar',
                  heightAuto: false,
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    pedido.data.entregado = true;
                    await this.firestoreService.modificar(pedido, 'pedidos');
                  }
                });
              }
            }
          }
        }
      );

      setTimeout(() => {
        this.cargando = false;
      }, 500);
    });

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
  chatMozo() {
    let usuarioLog = this.usuarioService.getUsuarioLogueado();
    
    this.router.navigate(['chatMozo', usuarioLog.id], { replaceUrl: true });
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

  pedirCuenta() {
    this.detalles = [];
    this.indice = 1;
    this.titulo = 'Pedir cuenta';
    this.total = 0;
    this.miPedido.data.pedido.forEach((detalle: any) => {
      let nuevoDetalle = {
        cantidad: detalle.cantidad,
        producto: detalle.producto.descripcion,
        precio: detalle.producto.precio,
        subtotal: detalle.cantidad * detalle.producto.precio,
      };
      this.detalles.push(nuevoDetalle);
      this.total += detalle.cantidad * detalle.producto.precio;
    });
  }
  actualizarTotal() {
    this.total = this.total + this.propina - this.descuento;
  }
  atras() {
    this.indice = 0;
    this.titulo = 'Home Clientes';
  }
  cargarPropina() {
    this.actualizarTotal();
  }
  private buscarMesa(pedido: any) {
    for (let mesa of this.mesas) {
      if (pedido.data.cliente.id === mesa.data.cliente.id) {
        return mesa;
      }
    }
  }
  async pagar() {
    this.cargando = true;
    let pago = {
      detalle: this.detalles,
      descuento: this.descuento,
      propina: this.propina,
      total: this.total,
      cliente: this.usuario,
      confirmado: false,
      mozo: this.miPedido.data.mozo,
      pedido: this.miPedido,
      mesa: this.buscarMesa(this.miPedido),
    };
    this.miPedido.data.pagado = true;
    await this.firestoreService.modificar(this.miPedido, 'pedidos');
    await this.firestoreService.guardar(pago, 'pagos');
    this.cargando = false;
    this.mensajesService.mostrar(
      'OK',
      'Su pago se realizo de manera correcta',
      'success'
    );
    this.atras();
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

    let nuevoUser: any = await this.firestoreService.obtenrUno(
      'usuarios',
      this.usuario.id
    );

    if (
      userQR === QRs.IngresoLocal &&
      nuevoUser?.data?.enListaEspera !== 'Espera'
    ) {
      this.mensajesService.mostrar(
        'OK',
        'Ingresaste a la lista de espera, debes esperar que un metre te asigne una mesa',
        'success'
      );
      await this.mandarNotificacionPush();
      nuevoUser.data.enListaEspera = 'Espera';
      this.usuario.data.estadoMesa = EstadoMesa.NoVinculada;
      await this.firestoreService.modificar(this.usuario, 'usuarios');
    } else if (
      parametros[0] === QRs.Mesa &&
      nuevoUser?.data?.enListaEspera === 'Asignada'
    ) {
      let idMesa = parametros[1];
      this.mesas = await this.firestoreService.obtener('mesas');
      let aux = this.mesas.filter(
        (mesa: any) => mesa.data.cliente.id === nuevoUser.id
      )[0];

      if (
        aux.id === idMesa &&
        nuevoUser?.data?.estadoMesa === EstadoMesa.NoVinculada
      ) {
        nuevoUser.dataestadoMesa = EstadoMesa.Vinculada;
        await this.firestoreService.modificar(nuevoUser, 'usuarios');
        this.mensajesService.mostrar(
          'OK',
          'Mesa vinculada de manera correcta',
          'success'
        );
      } else if (
        aux.id === idMesa &&
        nuevoUser?.data?.estadoMesa === EstadoMesa.Vinculada
      ) {
        let pedidos = await this.firestoreService.obtener('pedidos');
        let pedidoBuscado: any = null;
        pedidos.forEach((pedido: any) => {
          if (pedido.data.cliente.id === nuevoUser?.id) {
            pedidoBuscado = pedido;
          }
        });

        if (pedidoBuscado !== null) {
          nuevoUser.data.habilitarCarta = false;
          await this.firestoreService.modificar(nuevoUser, 'usuarios');
        }

        if (pedidoBuscado.data.estado === 'NoConfirmado') {
          this.mensajesService.mostrar(
            'OK',
            `Su pedido esta siendo confirmado por un mozo`,
            'success'
          );
        } else if (
          pedidoBuscado.data.estado === 'Confirmado' ||
          pedidoBuscado.data.estado === 'EnPreparacion'
        ) {
          this.mensajesService.mostrar(
            'OK',
            `Su pedido esta siendo preparado`,
            'success'
          );
        } else if (pedidoBuscado.data.estado === 'ListoEntrega') {
          this.mensajesService.mostrar(
            'OK',
            `Su pedido esta listo,el mozo se lo llevara a la mesa en un momento`,
            'success'
          );
        } else if (pedidoBuscado.data.estado === 'Entregado') {
          this.mensajesService.mostrar(
            'OK',
            `Su pedido fue entregado`,
            'success'
          );
        } else {
          nuevoUser.data.habilitarCarta = true;
          await this.firestoreService.modificar(nuevoUser, 'usuarios');

          this.mensajesService.mostrar(
            'OK',
            `Ya puede realizar su pedido`,
            'success'
          );
        }
      } else {
        this.mensajesService.mostrar(
          'ERROR',
          'Error la mesa escaneada no es la suya,el numero de mesa de usted es: ' +
            aux.data.numeroMesa,
          'error'
        );
      }
    } else if (nuevoUser?.data?.enListaEspera === 'Espera') {
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
