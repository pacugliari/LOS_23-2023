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
  selector: 'app-encuestas-clientes',
  templateUrl: './encuestas-clientes.component.html',
  styleUrls: ['./encuestas-clientes.component.scss'],
})
export class EncuestasClientesComponent {
  encuesta: any = {
    nombre: '',
    opinion: '',
    valoracion: 5, // Valoración por defecto
    fotos: [], // Para almacenar las fotos seleccionadas
    nivelSatisfaccion: 5, // Nivel de satisfacción por defecto
    ofertasCorreo: false,
    primeraVisita: 'si'
  };

  constructor( private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router) {}

    async enviarEncuesta() {
      try {
        // Usar el servicio Firestore para guardar la encuesta
        await this.firestoreService.guardar(this.encuesta, 'encuestas');
        console.log('Encuesta enviada correctamente a Firestore a través de FirestoreService');
        // Aquí puedes realizar acciones adicionales después de enviar la encuesta
      } catch (error) {
        console.error('Error al enviar la encuesta a Firestore:', error);
        // Manejar el error, como mostrar un mensaje de error al usuario
      }
    }
  
    async tomarFoto() {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
  
      // Agregar la foto a la lista de fotos en la encuesta
      this.encuesta.fotos.push(`data:image/jpeg;base64,${image.base64String}`);
    }
  
    agregarFoto(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        for (let i = 0; i < input.files.length; i++) {
          const foto = input.files[i];
          this.encuesta.fotos.push(foto); // Agregar la foto a la lista de fotos en la encuesta
          console.log('Foto seleccionada:', foto);
        }
      }
    }
}