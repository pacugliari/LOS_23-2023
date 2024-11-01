import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-pendientes',
  templateUrl: './clientes-pendientes.component.html',
  styleUrls: ['./clientes-pendientes.component.scss'],
})
export class ClientesPendientesComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private firestore: FirestoreService,
    private emailService: EmailService,
    private router: Router,
  ) {}
  clientesPendientes: any[] = [];
  cargando: boolean = false;

  async ngOnInit() {
    await this.actualizarLista();
  }

  async actualizarLista() {
    await this.firestore.obtener('usuarios').then((resultado) => {
      this.clientesPendientes = resultado.filter(
        (element) =>
          element.data.clientePendiente &&
          element.data.tipo === 'cliente' &&
          !element.data.clienteRechazado
      );
      //console.log(JSON.stringify(resultado))
    });
  }

  verCliente(cliente: any) {
    Swal.fire({
      title: 'Aceptar cliente?',
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
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      imageUrl: cliente.data.foto,
      imageWidth: 300,
      imageHeight: 200,
      showDenyButton: true,
      denyButtonText: `Rechazar`,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
    }).then(async (result) => {
      this.cargando = true;
      if (result.isConfirmed) {
        await this.aceptarCliente(cliente);
        await Swal.fire({
          title: 'Usuario aceptado!',
          icon: 'success',
          heightAuto: false,
        });
      } else if (result.isDenied) {
        await this.rechazarCliente(cliente);
        await Swal.fire({
          title: 'Usuario rechazado!',
          icon: 'info',
          heightAuto: false,
        });
      }
      await this.actualizarLista();
      this.cargando = false;
      let tituloMail = result.isConfirmed
        ? 'Felicitaciones su cuenta fue aceptada'
        : 'Disculpe pero hemos bloqueado su cuenta';
        let mensajeMail = `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .header {
              background-color: #D0A933;
              padding: 20px;
              text-align: center;
            }
            .content {
              margin: 20px;
              background-color: #FAEDCD;
            }
          </style>
        </head>
        <body class="content">
          <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/los-23-2023.appspot.com/o/assets%2Flogo.png?alt=media&token=9181d878-15d4-4010-b202-260b3f562d30" alt="Logo" width="100">  
            <h1>${result.isConfirmed ? 'Felicitaciones ' : 'Disculpe '} ${cliente.data.nombre}</h1>
          </div>
          <div class="content">
            <p>Su cuenta fue ${result.isConfirmed ? 'aceptada' : 'rechazada'}</p>
            <p>Saludos LOS 23 - RESTO BAR</p>
          </div>
        </body>
        </html>
        `;
      this.emailService
        .enviarMail(cliente.data.correo, tituloMail, mensajeMail)
        .subscribe((resultado) => console.log(resultado));
    });
  }

  private async rechazarCliente(cliente: any) {
    cliente.data.clientePendiente = false;
    cliente.data.clienteRechazado = true;
    await this.firestore.modificar(cliente, 'usuarios');
  }

  private async aceptarCliente(cliente: any) {
    cliente.data.clientePendiente = false;
    await this.firestore.modificar(cliente, 'usuarios');
  }

  

  async atras() {
    this.router.navigate(['home'], { replaceUrl: true });
  }
}
