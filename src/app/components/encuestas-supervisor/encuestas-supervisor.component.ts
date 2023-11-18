import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-encuestas-supervisor',
  templateUrl: './encuestas-supervisor.component.html',
  styleUrls: ['./encuestas-supervisor.component.scss'],
})
export class EncuestasSupervisorComponent  implements OnInit {
encuesta: any = {
    nombre: '',
    clienteoempleado: '',
    valoracion: 0, // Valoración por defecto
    nivelSatisfaccion: 5, // Nivel de satisfacción por defecto
    recomendar: false,

  };

  constructor( private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router) {}
  ngOnInit(){

  }
  

    async enviarEncuesta() {
      try {
        // Usar el servicio Firestore para guardar la encuesta
        await this.firestoreService.guardar(this.encuesta, 'encuestasSuper');
        console.log('Encuesta enviada correctamente a Firestore a través de FirestoreService');
        this.mostrarMensaje();
        this.encuesta = {
          nombre: '',
          clienteoempleado: '',
          valoracion: 5,
          nivelSatisfaccion: 5,
          recomendar: false,
        };
        // Aquí puedes realizar acciones adicionales después de enviar la encuesta
      } catch (error) {
        console.error('Error al enviar la encuesta a Firestore:', error);
        // Manejar el error, como mostrar un mensaje de error al usuario
      }
    }
  
    
  async mostrarMensaje() {
    await this.mensajesService.mostrar(
      'Perfecto!',
      '¡Enviaste correctamente!',
      'success'
    );
  }
   
}