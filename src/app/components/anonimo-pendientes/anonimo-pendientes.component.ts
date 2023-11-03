import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

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
    private emailService:EmailService,
    private router: Router) {
    }

    AnonimosPendientes: any[] = [];
  cargando : boolean = false;

  async ngOnInit() {
    await this.actualizarLista();
  }

  async actualizarLista() {
    await this.firestore.obtener("usuarios").then((resultado) => {
      this.AnonimosPendientes = resultado.filter((element) => element.data.clientePendiente && element.data.tipo === "anonimo" && !element.data.clienteRechazado);
      console.log(this.AnonimosPendientes); // Agregar esta línea para visualizar los datos
    });
  }
  
  

  verCliente(anonimo:any){

    Swal.fire({
      title: 'Aceptar anonimo?',
      html: "Usuario:"+anonimo.data.usuario+"<br>Nombre:"+anonimo.data.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      imageUrl: anonimo.data.foto,
      imageWidth: 300,
      imageHeight: 200,
      showDenyButton: true,
      denyButtonText: `Rechazar`,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      heightAuto: false
    }).then(async(result) => {
      this.cargando = true;
      if (result.isConfirmed) {
        await this.aceptarCliente(anonimo);
        await Swal.fire({
          title:'Usuario aceptado!',
          icon:'success',
          heightAuto: false
        })
      } else if (result.isDenied) {
        await this.rechazarCliente(anonimo);
        await Swal.fire({
          title:'Usuario rechazado!',
          icon:'info',
          heightAuto: false
        })
      }
      await this.actualizarLista();
      this.cargando = false;
      let tituloMail = result.isConfirmed ? 'Felicitaciones su cuenta fue aceptada' : 'Disculpe pero hemos bloqueado su cuenta';
      let mensajeMail = `
      <h1>${result.isConfirmed ? 'Felicitaciones ' : 'Disculpe '} ${anonimo.data.nombre}</h1>
      <p>Su cuenta fue ${result.isConfirmed  ? 'aceptada' : 'rechazada'}</p>
      <p>Saludos LOS 23 - RESTO BAR</p>
      `
      this.emailService.enviarMail(anonimo.data.correo,tituloMail,mensajeMail).subscribe((resultado)=> console.log(resultado));
    })
  }

  private async rechazarCliente(anonimo:any){
    anonimo.data.AnonimosPendientes = false;
    anonimo.data.clienteRechazado = true;
    await this.firestore.modificar(anonimo,"usuarios")
  }

  private async aceptarCliente(anonimo:any){
    anonimo.data.AnonimosPendientes = false;
    await this.firestore.modificar(anonimo,"usuarios")
  }

  async atras() {
    this.router.navigate(['home'], { replaceUrl: true });
  }

}
