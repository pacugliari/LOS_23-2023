import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensaje } from 'src/app/models/mensaje';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-mozo',
  templateUrl: './chat-mozo.component.html',
  styleUrls: ['./chat-mozo.component.scss'],
})
export class ChatMozoComponent implements OnInit {
  cliente = '';
  usuarioActual: string = '';
  listaMensajes: Array<Mensaje> = [];
  mensaje: Mensaje = new Mensaje();
  primerMensaje: boolean = true;
  esMozo: boolean = false;

  constructor(
    private router: Router,
    public chatService: ChatService,
    private route: ActivatedRoute,
    private pushNotService: PushNotificationService,
    private firestoreService: FirestoreService,
    private usuarioService:UsuarioService
  ) {}

  async ngOnInit() {
    this.route.url.subscribe(async () => {
      let cliente: string | null = localStorage.getItem('usuario');
      if (cliente) {
        let parsed = JSON.parse(cliente);
        if (parsed.data.tipo == 'Mozo' || parsed.data.tipo == 'mozo') {
          this.route.params.subscribe(async (params) => {
            const chatId = params['chatID'];
            console.log(chatId);
            if (chatId) {
              const chatExists = await this.chatService.docExists(
                'chat',
                chatId
              );
              if (!chatExists) {
                await this.chatService.crearChat(chatId, chatId); // Puedes pasar el clienteId si es necesario
              }
              this.chatService.listenToChatChanges(chatId);
              this.cliente = chatId;
              this.mensaje.nombre = parsed.data.nombre;
              this.mensaje.tipo = parsed.data.tipo;
              this.usuarioActual = parsed.data.nombre;
              let mozoBD: any = await this.firestoreService.obtenrUno(
                'usuarios',
                parsed.id
              );
              if (!mozoBD.chatIds) {
                mozoBD.chatIds = [];
              }
              mozoBD.chatIds.push(chatId);
              await this.firestoreService.modificar(mozoBD, 'usuarios');
            }
          });
          this.esMozo = true;
        } else {
          this.esMozo = false;
          this.chatService.listenToChatChanges(parsed.id);
          this.cliente = parsed.id;
          this.mensaje.nombre = parsed.data.nombre;
          this.mensaje.tipo = parsed.data.tipo;
          this.usuarioActual = parsed.data.nombre;
        }
      }
    });
    this.chatService.mensajes.sort((a, b) => {
      return parseInt(b.fecha) - parseInt(a.fecha);
    });
  }

  volver() {
    let usuario = this.usuarioService.getUsuarioLogueado();
    if(usuario.data.tipo === "cliente" || usuario.data.tipo === "anonimo")
      this.router.navigate(['homeCliente'], { replaceUrl: true });
    else
    this.router.navigate(['homeEmpleado',1], { replaceUrl: true });
  }

  async EnviarMensaje() {
    if (this.esMozo == false) {
      if (this.primerMensaje) {
        this.primerMensaje = false;
        await this.mandarNotificacionPush();
      }
    }
    this.mensaje.fecha = new Date().getTime().toString();
    await this.chatService.enviarMensaje(this.cliente, this.mensaje);
    this.mensaje.mensaje = '';
  }

  async mandarNotificacionPush() {
    let mozos = await this.firestoreService.obtener('usuarios');
    mozos = mozos.filter((element) => {
      return element.data.tipo === 'Mozo';
    });

    if (mozos.length > 0) {
      this.pushNotService
        .sendPushNotification({
          registration_ids: mozos.map((element) => element.data.tokenPush),
          notification: {
            title: 'Consulta de cliente',
            body: 'Hay un cliente con una consulta atiende de inmediato.',
          },
          data: {
            chatId: this.cliente,
            ruta: "chatMozo"
          },
        })
        .subscribe((data) => {
          console.log(data);
        });
    } else {
      console.log('No se encontraron mozo para enviar notificaciones.');
    }
  }

  async onKey(event: any) {
    let contador = event.target.value.length;
    if (contador >= 80) {
      this.alertMensaje(
        'ERROR',
        'El mensaje no puede tener mas de 80 caracteres',
        'error'
      );
      this.mensaje.mensaje = '';
    }
  }

  alertMensaje(titulo: any, mensaje: any, icon: any) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icon,
      heightAuto: false,
    });
  }
}
