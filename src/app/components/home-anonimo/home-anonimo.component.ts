import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/services/storage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home-anonimo',
  templateUrl: './home-anonimo.component.html',
  styleUrls: ['./home-anonimo.component.scss'],
})
export class HomeAnonimoComponent  implements OnInit {
  navController: any;
  scannedBarCode: any;


  constructor(private usuarioService: UsuarioService,  formBuilder:FormBuilder,private barcodeScanner: BarcodeScanner,
    private mensajesService:MensajeService,private storageService:StorageService,
    private firestoreService:FirestoreService,
    private router: Router){ }

    leerDocumento() {
      this.barcodeScanner
        .scan({ formats: 'QR_CODE' })
        .then((res) => {
          this.scannedBarCode = res;
          let userQR = this.scannedBarCode['text'];
    
          if (userQR === 'Estasenlistadeespera') {
            // Redirigir a la página 'anonimo-pendientes' después de leer con éxito el QR
            this.router.navigate(['anonimo/pendientes']);
          } else {
            // Realizar alguna acción si el código QR no contiene 'Estasenlistadeespera'
          }
        })
        .catch((err) => {
          this.mensajesService.mostrar('ERROR', 'Error al leer el QR del documento', 'error');
        });
    }
  
  salir() {
    this.usuarioService.salir();
  }
  ngOnInit() {}

}
