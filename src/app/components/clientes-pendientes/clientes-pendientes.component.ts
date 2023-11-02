import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-pendientes',
  templateUrl: './clientes-pendientes.component.html',
  styleUrls: ['./clientes-pendientes.component.scss'],
})
export class ClientesPendientesComponent  implements OnInit {

  constructor(private usuarioService: UsuarioService,private firestore:FirestoreService) { }

  clientesPendientes : any[] = [];

  async ngOnInit() {
    await this.actualizarLista();
  }

  async actualizarLista(){
    await this.firestore.obtener("usuarios").then((resultado)=>{
      this.clientesPendientes = resultado.filter((element)=> element.data.clientePendiente && element.data.tipo === "cliente")
      //console.log(JSON.stringify(resultado))
    })
  }

  verCliente(cliente:any){
    Swal.fire({
      title: 'Aceptar cliente?',
      html: "Usuario:"+cliente.data.usuario+"<br>Nombre:"+cliente.data.nombre+"<br>Apellido:"+cliente.data.apellido+"<br>DNI:"+cliente.data.dni,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      imageUrl: cliente.data.foto,
      imageWidth: 300,
      imageHeight: 200,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      heightAuto: false
    }).then(async(result) => {
      if (result.isConfirmed) {
        await this.aceptarCliente(cliente);
        await Swal.fire({
          title:'Usuario aceptado!',
          icon:'success',
          heightAuto: false
        })
        await this.actualizarLista();
      }
    })
  }

  private async aceptarCliente(cliente:any){
    cliente.data.clientePendiente = false;
    await this.firestore.modificar(cliente,"usuarios")
  }

  async salir() {
    this.usuarioService.salir();

  }

}
