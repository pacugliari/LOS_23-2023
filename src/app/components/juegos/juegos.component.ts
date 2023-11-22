import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QRs } from 'src/app/models/QR';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.scss'],
})
export class JuegosComponent  implements OnInit {

  constructor(private usuarioService: UsuarioService, private router: Router,
    private pushNotService:PushNotificationService) { }

  ngOnInit() {}
  memotest() {
    this.router.navigate(['memotest'], { replaceUrl: true });
  }

  mayormenor() {
    this.router.navigate(['mayormenor'], { replaceUrl: true });
  }
  ahorcado() {
    this.router.navigate(['ahorcado'], { replaceUrl: true });
  }

  atras(){
    this.router.navigate(['homeCliente'], { replaceUrl: true });
  }

  async salir() {
    this.usuarioService.salir();

  }

}
