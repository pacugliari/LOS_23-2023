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
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-alta-cliente-anonimo',
  templateUrl: './alta-cliente-anonimo.component.html',
  styleUrls: ['./alta-cliente-anonimo.component.scss'],
})
export class AltaClienteAnonimoComponent {
  scannedBarCode: any;
  imageElement: any = '../../../assets/usuario.png';
  foto: boolean = false;
  public cargando: boolean = false;
  public registroAnonimo: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private pushNotService: PushNotificationService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  form = this.formBuilder.group({
    nombre: ['', [Validators.required]],
  });

  ngOnInit() {}
  toggleRegistroAnonimo() {
    this.registroAnonimo = !this.registroAnonimo;
  }
  async registrar() {
    this.cargando = true;
    let registroCorrecto = false;

    if (this.form.get('nombre')?.valid && this.foto) {
      let fotoUrl = await this.storageService.guardarFoto(
        this.imageElement,
        'usuarios'
      );
      //const token = await this.pushNotService.generarToken();

      let data = {
        usuario: 'anonimo',
        clave: 'anonimo',
        nombre: this.form.value.nombre,
        tipo: 'anonimo',
        foto: fotoUrl,
        clientePendiente: true,
        clienteRechazado: false,
        //tokenPush: token,
      };
      await this.firestoreService.guardar(data, 'usuarios');
      await this.mensajesService.mostrar(
        '',
        'Registro anónimo completado',
        'success'
      );
      registroCorrecto = true;

      let usuarios = await this.firestoreService.obtener("usuarios")
      let usuario = usuarios.filter((usuario:any)=> usuario.data.usuario === data.usuario && usuario.data.clave === data.clave)[0]
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else if (!this.foto && this.form.get('nombre')?.valid) {
      await this.mensajesService.mostrar(
        'ERROR',
        'Falta tomar la foto',
        'error'
      );
    } else {
      await this.mensajesService.mostrar(
        'ERROR',
        'Verifique que estén todos los campos completos',
        'error'
      );
    }

    this.cargando = false;
    if (registroCorrecto) {
      this.router.navigate(['homeCliente'], { replaceUrl: true });
      // CAMBIAR POR LUGAR DONDE HACE PEDIDOS
    }
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      webUseInput: true,
    });
    this.foto = true;
    this.imageElement = image.dataUrl;
  }

  leerDocumento() {
    this.barcodeScanner
      .scan({ formats: 'PDF_417' })
      .then((res) => {
        this.scannedBarCode = res;
        let userQR = this.scannedBarCode['text'];
        let data = userQR.split('@');
        if (!isNaN(Number(data[4]))) {
          this.form.get('nombre')?.setValue(data[2]);
        } else {
          this.form.get('nombre')?.setValue(data[5]);
        }
      })
      .catch((err) => {
        this.mensajesService.mostrar(
          'ERROR',
          'Error al leer el QR del documento',
          'error'
        );
      });
  }

  isValidField(field: string): string {
    const validateField = this.form?.get(field);
    return !validateField?.valid && validateField?.touched
      ? 'is-invalid'
      : validateField?.touched
      ? 'is-valid'
      : '';
  }

 
}
