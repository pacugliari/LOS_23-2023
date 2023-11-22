import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensaje } from 'src/app/models/mensaje';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-listado-chats',
  templateUrl: './listado-chats.component.html',
  styleUrls: ['./listado-chats.component.scss'],
})
export class ListadoChatsComponent implements OnInit {
  cliente = '';
  usuarioActual: string = '';
  chatIds: any[] = [];

  constructor(
    private router: Router,
    public chatService: ChatService,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    let mozo: string | null = localStorage.getItem('usuario');
    if (mozo) {
      let parsed = JSON.parse(mozo);
      let mozoBD: any = await this.firestoreService.obtenrUno(
        'usuarios',
        parsed.id
      );
      console.log(mozoBD);
      if (mozoBD.data.chatIds) {
        for (let chatId of mozoBD.data.chatIds) {
          let mesas: any = await this.firestoreService.getWhere(
            'mesas',
            'cliente.id',
            chatId
          );
          if (mesas.length > 0) {
            let mesa = mesas[0];
            console.log(mesa);
            this.chatIds.push({ id: chatId, mesa: mesa.data.numeroMesa });
          }else{
            this.chatIds.push({ id: chatId, mesa: 'n°°°°' });
          }
        }
      }
      console.log(this.chatIds);
    }
  }

  navegarAChat(chatId: string) {
    this.router.navigate(['chatMozo', chatId]);
  }

  volver() {
    this.router.navigate(['homeEmpleado',1], { replaceUrl: true });
  }
}
