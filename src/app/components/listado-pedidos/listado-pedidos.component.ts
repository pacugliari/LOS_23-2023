import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.scss'],
})
export class ListadoPedidosComponent  implements OnInit {

  constructor(private firestore:FirestoreService) { }

  pedidos:any;
  mesas:any;
  cargando : boolean = false;

  async ngOnInit() {
    this.mesas = await this.firestore.obtener("mesas");
    
    this.pedidos = this.firestore.escucharCambios("pedidos", async (data) => {
      this.pedidos = data;
      for (let pedido of this.pedidos) {
        pedido.mesa = await this.buscarMesa(pedido)
      }
    });

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

}
