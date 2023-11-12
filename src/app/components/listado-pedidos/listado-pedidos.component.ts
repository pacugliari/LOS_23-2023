import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.scss'],
})
export class ListadoPedidosComponent  implements OnInit {

  constructor(private firestore:FirestoreService,private usuarioService:UsuarioService) { }

  pedidos:any;
  mesas:any;
  cargando : boolean = false;
  comidas : any[] = [];
  usuario:any;
  async ngOnInit() {
    this.mesas = await this.firestore.obtener("mesas");
    this.usuario = this.usuarioService.getUsuarioLogueado();

    this.pedidos = this.firestore.escucharCambios("pedidos", async (data) => {
      this.pedidos = data;
      for (let pedido of this.pedidos) {
        pedido.mesa = await this.buscarMesa(pedido)

        /*pedido.data.pedido.forEach((pedido:any) => {
          if(pedido.producto.tipo === "comida"){
            this.comidas.push(pedido);
          }
        });*/
      }
    });
    //console.log(JSON.stringify(this.comidas))
    
  }

  async buscarMesa(pedido:any){
    
    for (let mesa of this.mesas) {
      if(pedido.data.cliente.id === mesa.data.cliente.id){
        return mesa;
      }
    }
  }

  async confirmar(pedido:any){
    this.cargando = true;
    pedido.data.estado = "Confirmado";
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
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }

  
  async entregarPedido(pedido:any){
    this.cargando = true;
    pedido.data.estado = "Entregado";
    await this.firestore.modificar(pedido,"pedidos");
    this.cargando = false;
  }
}
