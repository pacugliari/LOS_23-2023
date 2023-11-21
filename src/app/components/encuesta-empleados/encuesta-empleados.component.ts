import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.component.html',
  styleUrls: ['./encuesta-empleados.component.scss'],
})
export class EncuestaEmpleadosComponent implements OnInit {
  encuesta: any = {
    nombre: '',
    clienteoempleado: '',
    valoracion: 0, // Valoración por defecto
    nivelSatisfaccion: 5, // Nivel de satisfacción por defecto
    recomendar: false,
    imagen: '', // Propiedad para almacenar la URL de la imagen
  };

  constructor(
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {}

  async enviarEncuesta() {
    try {
      // Usar el servicio Firestore para guardar la encuesta
      await this.firestoreService.guardar(this.encuesta, 'encuestasEmpleados');
      console.log('Encuesta enviada correctamente a Firestore a través de FirestoreService');
      this.mostrarMensaje();
      this.resetearEncuesta(); // Restablecer los valores de la encuesta después de enviarla
      // Aquí puedes realizar acciones adicionales después de enviar la encuesta
    } catch (error) {
      console.error('Error al enviar la encuesta a Firestore:', error);
      // Manejar el error, como mostrar un mensaje de error al usuario
    }
  }

  async mostrarMensaje() {
    await this.mensajesService.mostrar('Perfecto!', '¡Enviaste correctamente!', 'success');
  }

  // Función para manejar el cambio de la imagen
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        // Asignar la URL de la imagen a la propiedad 'imagen' de la encuesta
        this.encuesta.imagen = reader.result as string;
      };
    }
  }

  // Función para omitir la carga de la imagen
  omitirCargaImagen() {
    // Asignar un valor predeterminado o dejarlo vacío según tus necesidades
    this.encuesta.imagen = '';
  }

  // Función para restablecer los valores de la encuesta
  resetearEncuesta() {
    this.encuesta = {
      nombre: '',
      clienteoempleado: '',
      valoracion: 5,
      nivelSatisfaccion: 5,
      recomendar: false,
      imagen: '',
    };
  }
}
