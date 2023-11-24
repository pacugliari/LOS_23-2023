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
import { UsuarioService } from 'src/app/services/usuario.service';
import { computeStackId } from '@ionic/angular/common/directives/navigation/stack-utils';

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
    primeraVisita: 'si',
  };
  formularioEnviado = false;
  cargando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private graficoClientesService: GraficoClientesService,
    private firestoreService: FirestoreService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  atras() {
    this.router.navigate(['homeCliente']);
  }

  async enviarEncuesta() {
    console.log(this.encuesta.ofertasCorreo);
    this.cargando = true;
    try {
      // Verificar si el formulario ya ha sido enviado
      if (this.formularioEnviado) {
        // Mostrar un mensaje indicando que el formulario ya se envió
        this.mostrarMensajeFormularioEnviado();
        return;
      }

      // Verificar si el formulario está completo antes de enviar la encuesta
      if (this.formularioCompleto()) {
        // Usar el servicio Firestore para guardar la encuesta

        if(this.encuesta.ofertasCorreo){
          this.encuesta.ofertasCorreo = 'si';
        }else{          
          this.encuesta.ofertasCorreo = 'no';
        }

        console.log(this.encuesta);

        await this.firestoreService.guardar(this.encuesta, 'encuestas');
        await this.mostrarMensaje();

        // Marcar el formulario como enviado
        //this.formularioEnviado = true;

        let usuarios = await this.firestoreService.obtener('usuarios');
        let usuarioLog = this.usuarioService.getUsuarioLogueado();

        let usuarioBuscado = usuarios.filter(
          (usuario: any) => usuario.id === usuarioLog.id
        )[0];
        usuarioBuscado.data.completoEncuesta = true;
        await this.firestoreService.modificar(usuarioBuscado, 'usuarios');

        // Aquí puedes realizar acciones adicionales después de enviar la encuesta
      } else {
        this.mostrarMensajes();
      }
    } catch (error) {
      console.error('Error al enviar la encuesta a Firestore:', error);
      // Manejar el error, como mostrar un mensaje de error al usuario
    }
    this.router.navigate(['homeCliente']);
    this.cargando = false;
  }

  mostrarMensajeFormularioEnviado() {
    this.mensajesService.mostrar(
      'Atención',
      'El formulario ya ha sido enviado anteriormente.',
      'warning'
    );
  }
  formularioCompleto(): boolean {
    return (
      this.encuesta.nombre &&
      this.encuesta.valoracion &&
      this.encuesta.fotos &&
      this.encuesta.nivelSatisfaccion
    );
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
    console.log(this.encuesta.fotos.length);
    if (this.encuesta.fotos.length < 2) {
      console.log('cargue foto');
      try {
        const image = await Camera.getPhoto({
          quality: 50,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          webUseInput: true,
        });
        let foto: any = image.dataUrl;
        let url = await this.storageService.guardarFoto(foto, 'encuestas');
        this.encuesta.fotos.push(url);
      } catch (error) {
        console.error('Error al tomar la foto:', error);
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
}
