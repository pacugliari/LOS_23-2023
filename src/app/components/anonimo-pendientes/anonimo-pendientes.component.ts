import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirestoreService } from 'src/app/services/firestore.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anonimo-pendientes',
  templateUrl: './anonimo-pendientes.component.html',
  styleUrls: ['./anonimo-pendientes.component.scss'],
})
export class AnonimoPendientesComponent  implements OnInit {

  constructor(private usuarioService: UsuarioService,private firestore:FirestoreService,

    private router: Router) {
    }

  clientesPendientes : any[] = [];
  cargando : boolean = false;

  async ngOnInit() {
    await this.actualizarLista();
  }

  async actualizarLista(){

    
    
  }

  verCliente(cliente:any){

    
    
  }

  private async rechazarCliente(cliente:any){
   
  }

  private async aceptarCliente(cliente:any){
   
  }

  async atras() {
    this.router.navigate(['home'], { replaceUrl: true });
  }


}
