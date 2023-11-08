import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  indice = 0 ;
  titulo = "Home"
  salaEspera:any;
  clienteSeleccionado:any;
  cargando : boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private pushNotService: PushNotificationService,
    private firestore: FirestoreService,
    private mensajes :MensajeService
  ) {}

  async ngOnInit() {
    const usuario = this.usuarioService.getUsuarioLogueado();
    if (usuario.data.tipo == 'metre') {
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

  async verListaEspera(){
    this.cargando = true;
    this.titulo = "Lista de espera";
    this.indice = 1;
    this.salaEspera = (await this.firestore.obtener("usuarios")).filter((usuario:any)=> usuario.data.enListaEspera === "Espera");
    this.cargando = false;
  }

  atras(){
    this.titulo = "Home"
    this.indice = 0;

  }

  salir() {
    this.usuarioService.salir();
  }

  async asignarMesa(cliente:any){
    Swal.fire({
      title: 'Asignar mesa al cliente ? ',
      html:
        'Usuario:' +
        cliente.data.usuario +
        '<br>Nombre:' +
        cliente.data.nombre +
        '<br>Apellido:' +
        cliente.data.apellido +
        '<br>DNI:' +
        cliente.data.dni,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      imageUrl: cliente.data.foto,
      imageWidth: 300,
      imageHeight: 200,
      showDenyButton: true,
      denyButtonText: `Atras`,
      confirmButtonText: 'Asignar',
      heightAuto: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.indice = 3;
        this.clienteSeleccionado = cliente;
      }
    });

  }

  async mesaSeleccionada(mesa:any){
    if(mesa !== null){
      //console.log(JSON.stringify(mesa))
      this.clienteSeleccionado.data.enListaEspera = "Asignada"
      await this.firestore.modificar(this.clienteSeleccionado,"usuarios")
      mesa.cliente = this.clienteSeleccionado;
      mesa.estado = "Ocupado"
      await this.firestore.modificar({id:mesa.id,data:mesa},"mesas")
      this.mensajes.mostrar("OK","Mesa asignada al cliente de manera exitosa","success")
    }

    this.indice = 0;
  }
}
