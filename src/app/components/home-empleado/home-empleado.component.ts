import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-empleado',
  templateUrl: './home-empleado.component.html',
  styleUrls: ['./home-empleado.component.scss'],
})
export class HomeEmpleadoComponent implements OnInit {
  private tipo: string = '';
  indice = 0;
  titulo = 'Inicio';
  salaEspera: any;
  clienteSeleccionado: any;
  cargando: boolean = false;
  usuario: any;
  escuchando : boolean = false;
  pagoRecibido : any = null;
  indicePedidos = -1;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private pushNotService: PushNotificationService,
    private firestore: FirestoreService,
    private mensajes: MensajeService,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    this.route.url.subscribe(async () => {
      this.usuario = this.usuarioService.getUsuarioLogueado();

      if (this.usuario.data.tipo == 'metre') {
        this.titulo = 'Inicio Metre';
        this.indice = 6;

          await this.pushNotService.escucharNotificaciones((respuesta)=>{
            if(respuesta === 1){
              this.ngZone.run(() => {
                this.verListaEspera();
              });
            }
        });
      } else if (this.usuario.data.tipo == 'Mozo') {
        this.indice = 4;
        this.titulo = 'Inicio Mozo';
        ///this.usuario.data.enListaEspera = this.usuario.data.estadoMesa = null; HACERLO CUANDO EL CLIENTE CONFIRME EL PAGO
        this.firestore.escucharCambios('pagos', async (data) => {
          for (let pago of data) {
            if (
              pago.data.mozo.id === this.usuario.id &&
              pago.data.confirmado === false
            ) {
              this.pagoRecibido = pago;
              await Swal.fire({
                title: `Pago recibido`,
                text: `El cliente de la mesa ${pago.data.mesa.data.numeroMesa} realizo el pago`,
                icon: 'info',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                heightAuto: false,
              }).then(async (result) => {
                if (result.isConfirmed) {
                  pago.data.confirmado = true;
                  let cliente = pago.data.cliente;
                  cliente.data.habilitarPedirCuenta = false;
                  cliente.data.enListaEspera = cliente.data.estadoMesa = null;
                  await this.firestore.modificar(cliente, 'usuarios');
                  await this.firestore.modificar(pago, 'pagos');
                  await this.firestore.borrar(pago.data.pedido, 'pedidos');
                  await this.firestore.borrar(pago.data.cliente, 'chat');
                  this.liberarMesa(pago.data.mesa);
                }
              });
            }
          }
        });

          await this.pushNotService.escucharNotificaciones((respuesta)=>{
            if(respuesta === 5){
              this.ngZone.run(() => {
                this.administrarPedidos();
                this.indicePedidos = 0;
              });
            }
        });

      } else if (
        this.usuario.data.tipo == 'cocinero' ||
        this.usuario.data.tipo == 'bartender'
      ) {
        this.indice = 0;
        if (this.usuario.data.tipo == 'cocinero') this.titulo = 'Inicio Cocinero';
        else this.titulo = 'Inicio Bartender';

          await this.pushNotService.escucharNotificaciones((respuesta)=>{
            if(respuesta === 5){
              this.ngZone.run(() => {
                this.administrarPedidos();
              });
            }
        });
      }
      
      this.escuchando = true;
    })
    console.log(this.indice)
  }

  async liberarMesa(mesa: any) {
    mesa.data.cliente = null;
    mesa.data.estado = 'disponible';
    await this.firestore.modificar(mesa, 'mesas');
  }

  verProductos() {
    this.router.navigate(['listado/productos'], { replaceUrl: true });
  }
  altaProductos() {
    this.router.navigate(['alta-productos'], { replaceUrl: true });
  }

  async verListaEspera() {
    this.cargando = true;
    this.titulo = 'Lista de espera';
    this.indice = 1;
    this.salaEspera = (await this.firestore.obtener('usuarios')).filter(
      (usuario: any) => usuario.data.enListaEspera === 'Espera'
    );
    this.cargando = false;
  }

  atras() {
    this.titulo = 'Inicio';
    this.indice = 0;

    if (this.usuario.data.tipo == 'Mozo') {
      this.indice = 4;
      this.titulo = 'Inicio Mozo';
    }else if (this.usuario.data.tipo == 'metre') {
      this.titulo = 'Inicio Metre';
      this.indice = 6;
    }
  }

  salir() {
    this.usuarioService.salir();
  }

  async asignarMesa(cliente: any) {
    this.indice = 3;
    this.clienteSeleccionado = cliente;
  }

  async mesaSeleccionada(mesa: any) {
    if (mesa !== null) {
      this.cargando = true;
      //console.log(JSON.stringify(mesa))
      this.clienteSeleccionado.data.enListaEspera = 'Asignada';
      await this.firestore.modificar(this.clienteSeleccionado, 'usuarios');
      mesa.cliente = this.clienteSeleccionado;
      mesa.estado = 'Ocupado';
      await this.firestore.modificar({ id: mesa.id, data: mesa }, 'mesas');
      this.mensajes.mostrar(
        'OK',
        'Mesa asignada al cliente de manera exitosa',
        'success'
      );
      this.cargando = false;
    }

    this.indice = 6;
  }

  verMesas(){
    this.router.navigate(['lista/mesas'], { replaceUrl: true });
  }

  administrarPedidos() {
    this.indice = 5;
    this.titulo = 'Lista de pedidos';
  }
}
