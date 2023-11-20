import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Input() pagoRecibido : any = null;
  @Input() indice : any  = -1;

  constructor(private firestore:FirestoreService,private usuarioService:UsuarioService,private pushService : PushNotificationService,
    private mensajes:MensajeService) { }

  pedidos: any[] = [];
  mesas: any[] = [];
  cargando : boolean = false;
  comidas : any[] = [];
  usuario:any;
  

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

  async enviarPushCocina(pedido:any){
    let usuarios = await this.firestore.obtener('usuarios');
    let genteCocina :any[] = [];
    
    if(pedido.data.estadoBebidas !== "No hubo pedido" && pedido.data.estadoComidas !== "No hubo pedido"){
      genteCocina  = usuarios.filter((element) => {
        return element.data.tipo === 'cocinero' || element.data.tipo === 'bartender';
      });
    }else if (pedido.data.estadoBebidas !== "No hubo pedido"){
      genteCocina  = usuarios.filter((element) => {
        return element.data.tipo === 'bartender';
      });
    }else if (pedido.data.estadoComidas !== "No hubo pedido"){
      genteCocina  = usuarios.filter((element) => {
        return element.data.tipo === 'cocinero';
      });
    }

    if (genteCocina.length > 0) {
      genteCocina.forEach(element => {
        let titulo = element.data.tipo === 'cocinero' ? `Hay un nuevo pedido en la cocina` : `Hay un nuevo pedido en el bar`;
        let tipo =  element.data.tipo === 'cocinero' ? "cocinero" :  "bartender" 
        this.pushService
        .sendPushNotification({
          registration_ids: [element.data.tokenPush],
          notification: {
            title:  titulo ,
            body: 'Click para acceder a la lista de pedidos',
          },
          data: {
            ruta: "homeEmpleado",
          },
        })
        .subscribe((data) => {
          console.log(data);
        });
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
        notification,
        data: {
          ruta: "homeEmpleado",
        },
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
    await this.enviarPushCocina(pedido)
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
    if(pedido.data.estadoBebidas === "Entregado" && pedido.data.estadoComidas === "Entregado" ||
      pedido.data.estadoBebidas === "No hubo pedido" && pedido.data.estadoComidas === "Entregado" || 
      pedido.data.estadoBebidas === "Entregado" && pedido.data.estadoComidas === "No hubo pedido" 
    ){
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
    if(pedido.data.estadoBebidas === "Entregado" && pedido.data.estadoComidas === "Entregado" ||
      pedido.data.estadoBebidas === "No hubo pedido" && pedido.data.estadoComidas === "Entregado" || 
      pedido.data.estadoBebidas === "Entregado" && pedido.data.estadoComidas === "No hubo pedido" 
    ){
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

  async aceptarPago(pedido:any){
    let pago = this.pagoRecibido;
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

  async liberarMesa(mesa: any) {
    mesa.data.cliente = null;
    mesa.data.estado = 'disponible';
    await this.firestore.modificar(mesa, 'mesas');
  }

}
