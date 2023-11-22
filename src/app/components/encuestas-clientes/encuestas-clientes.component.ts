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
import { GraficoClientesService } from 'src/app/services/grafico-clientes.service';


@Component({
  selector: 'app-encuestas-clientes',
  templateUrl: './encuestas-clientes.component.html',
  styleUrls: ['./encuestas-clientes.component.scss'],
})
export class EncuestasClientesComponent {
  encuesta: any = {
    nombre: '',
    
    valoracion: 5, // Valoración por defecto
    fotos: [], // Para almacenar las fotos seleccionadas
    nivelSatisfaccion: 5, // Nivel de satisfacción por defecto
    ofertasCorreo: false,
    primeraVisita: 'si'
  };
  formularioEnviado = false;
<<<<<<< Updated upstream
=======
  cargando : boolean = false;
  
>>>>>>> Stashed changes

  constructor( private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private graficoClientesService: GraficoClientesService,
    private firestoreService: FirestoreService,
<<<<<<< Updated upstream
    private router: Router) {}
=======
    private router: Router,
    private usuarioService: UsuarioService) { this.formularioEnviado = false;}
>>>>>>> Stashed changes

  
    async enviarEncuesta() {
      try {
        // Verificar si el formulario ya ha sido enviado
        if (this.formularioEnviado) {
          // Mostrar un mensaje indicando que el formulario ya se envió
          this.mostrarMensajeFormularioEnviado();
          this.router.navigate(["homeCliente"])
          return;
        }
  
        // Verificar si el formulario está completo antes de enviar la encuesta
        if (this.formularioCompleto()) {
          // Usar el servicio Firestore para guardar la encuesta
          await this.firestoreService.guardar(this.encuesta, 'encuestas');
          this.mostrarMensaje();
  
          // Marcar el formulario como enviado
          this.formularioEnviado = true;
  
          // Aquí puedes realizar acciones adicionales después de enviar la encuesta
        } else {
          this.mostrarMensajes();
        }
      } catch (error) {
        console.error('Error al enviar la encuesta a Firestore:', error);
        // Manejar el error, como mostrar un mensaje de error al usuario
      }
    }
  
    mostrarMensajeFormularioEnviado() {
      this.mensajesService.mostrar(
        'Atención',
        'El formulario ya ha sido enviado anteriormente.',
        'warning'
      );
    }
    formularioCompleto(): boolean {
      
      return this.encuesta.nombre  && this.encuesta.valoracion  && this.encuesta.fotos  && this.encuesta.nivelSatisfaccion  && this.encuesta.ofertasCorreo  
    }
    

    async mostrarMensajes() {
      await this.mensajesService.mostrar(
        'Error!',
        'Debe completar todo',
        'error'
      );
    }
    async mostrarMensaje() {
      await this.mensajesService.mostrar(
        'Perfecto!',
        '¡Enviaste correctamente!',
        'success'
      );
    }
  
    async tomarFoto() {
      // Verificar el límite de fotos antes de tomar una nueva foto
      if (this.encuesta.fotos.length < 3) {
        try {
          const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera
          });
    
          // Agregar la foto a la lista de fotos en la encuesta
          this.encuesta.fotos.push(`data:image/jpeg;base64,${image.base64String}`);
        } catch (error) {
          console.error('Error al tomar la foto:', error);
          // Manejar el error, como mostrar un mensaje al usuario
        }
      } else {
        this.mostrarMensajeFoto();
      }
    }
    async mostrarMensajeFoto() {
      await this.mensajesService.mostrar(
        'Error!',
        '¡Se alcanzó el límite máximo de 3 fotos por encuesta!',
        'error'
      );
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