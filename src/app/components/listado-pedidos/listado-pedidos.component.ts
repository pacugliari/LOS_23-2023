import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.scss'],
})
export class ListadoPedidosComponent  implements OnInit {


  constructor(private firestore:FirestoreService,private usuarioService:UsuarioService,private pushService : PushNotificationService,
    private mensajes:MensajeService) { }

  pedidos: any[] = [];
  mesas: any[] = [];
  cargando : boolean = false;
  comidas : any[] = [];
  usuario:any;
  indice = -1;

  async ngOnInit() {
    this.cargando = true;
    this.mesas = await this.firestore.obtener("mesas");
    this.usuario = this.usuarioService.getUsuarioLogueado();

    this.pedidos = this.firestore.escucharCambios("pedidos", async (data) => {
      this.pedidos = data;
      for (let pedido of this.pedidos) {
        pedido.mesa = await this.buscarMesa(pedido)
      }
    });
    this.cargando = false;
  }

  verEstados(pedido:any){
    const html = `
    <h3>ESTADO PEDIDO:</h3>
    <h3>${ pedido.data.estado}</h3>
    <h3>ESTADO COMIDAS:</h3>
    <h3>${pedido.data.estadoComidas ? pedido.data.estadoComidas : "No definido"}</h3>
    <h3>ESTADO BEBIDAS:</h3>
    <h3>${pedido.data.estadoBebidas ? pedido.data.estadoBebidas : "No definido"}</h3>
    `
    this.mensajes.mostrarHtml("ESTADOS DEL PEDIDO",html,"info")
  }

  async buscarMesa(pedido:any){
    
    for (let mesa of this.mesas) {
      if(pedido.data.cliente.id === mesa.data.cliente.id){
        return mesa;
      }
    }
  }

  async enviarPushCocina(){
    let usuarios = await this.firestore.obtener('usuarios');
    let genteCocina  = usuarios.filter((element) => {
      return element.data.tipo === 'cocinero' || element.data.tipo === 'bartender';
    });

    if (genteCocina.length > 0) {
      this.pushService
        .sendPushNotification({
          registration_ids: genteCocina.map((element:any) => element.data.tokenPush),
          notification: {
            title: 'Hay un nuevo pedido',
            body: 'Click para acceder a la lista de pedidos',
          },
        })
        .subscribe((data) => {
          console.log(data);
        });
    } else {
      console.log('No se encontraron cocineros para enviar notificaciones.');
    }
  }

  async enviarPushMozo(notification:any,usuario:any){

    return new Promise<any>((resolve,reject)=>{
      this.pushService
      .sendPushNotification({
        registration_ids: [usuario.data.tokenPush],
        notification
      })
      .subscribe((data) => {
        console.log(data);
        resolve(data)
      });
    })
  }

  async confirmar(pedido:any){
    this.cargando = true;
    pedido.data.mozo = this.usuario
    pedido.data.estado = "Confirmado";
    await this.enviarPushCocina()
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }

  async confirmarComida(pedido:any){
    this.cargando = true;
    pedido.data.estado = "EnPreparacion";
    pedido.data.estadoComidas = "Confirmado";
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }

  async entregarComida(pedido:any){
    this.cargando = true;
    pedido.data.estadoComidas = "Entregado";
    if(pedido.data.estadoBebidas === "Entregado" && pedido.data.estadoComidas === "Entregado"){
      pedido.data.estado = "ListoEntrega";
    }
    let mesa = await this.buscarMesa(pedido)
    let notification =  {
      title: `Cocina tiene un pedido listo para entregar`,
      body: `El pedido de la mesa ${mesa.data.numeroMesa} por parte de la cocina esta listo`,
    }
    await this.enviarPushMozo(notification,pedido.data.mozo)
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }

  async confirmarBebida(pedido:any){
    this.cargando = true;
    pedido.data.estado = "EnPreparacion";
    pedido.data.estadoBebidas = "Confirmado";
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }

  async entregarBebida(pedido:any){
    this.cargando = true;
    pedido.data.estadoBebidas = "Entregado";
    if(pedido.data.estadoBebidas === "Entregado" && pedido.data.estadoComidas === "Entregado"){
      pedido.data.estado = "ListoEntrega";
    }
    let mesa = await this.buscarMesa(pedido)
    let notification =  {
      title: `Barra tiene un pedido listo para entregar`,
      body: `El pedido de la mesa ${mesa.data.numeroMesa} por parte de la barra esta listo`,
    }
    await this.enviarPushMozo(notification,pedido.data.mozo)
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }

  
  async entregarPedido(pedido:any){
    this.cargando = true;
    pedido.data.estado = "Entregado";
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }

  pendientes(){
    this.indice = 0;
  }
}
