import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { MensajeService } from 'src/app/services/mensaje.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from 'src/app/services/storage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-alta-empleados',
  templateUrl: './alta-empleados.component.html',
  styleUrls: ['./alta-empleados.component.scss'],
})
export class AltaEmpleadosComponent implements OnInit {
  scannedBarCode: any;
  imageElement: any = '../../../assets/usuario.png';
  seTomoFoto: boolean = false;
  public cargando: boolean = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private mensajesService: MensajeService,
    private barcodeScanner: BarcodeScanner,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router,
    private pushNotService: PushNotificationService
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      cuil: ['', Validators.required],
      tipo: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Lógica de inicialización, si es necesaria.
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      webUseInput: true,
    });
    this.seTomoFoto = true;
    this.imageElement = image.dataUrl; //muestro la foto para que previsualize el cliente
  }

  async registrar() {
    this.cargando = true;
    let registroCorrecto = false;

    if (this.form.valid && this.seTomoFoto) {
      // Guardar la foto en la base de datos
      let fotoUrl = await this.storageService.guardarFoto(
        this.imageElement,
        'usuarios'
      );

      const token = await this.pushNotService.generarToken();

      // Obtener los datos del formulario
      let data = {
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        dni: this.form.value.dni,
        cuil: this.form.value.cuil,
        tipo: this.form.value.tipo,
        usuario: this.form.value.usuario,
        clave: this.form.value.clave,
        foto: fotoUrl,
        tokenPush: token,
      };

      // Realizar el registro en la base de datos
      await this.firestoreService.guardar(data, 'usuarios');

      // Mostrar un mensaje de éxito
      await this.mensajesService.mostrar(
        '',
        'El empleado fue registrado correctamente',
        'success'
      );

      registroCorrecto = true;
    } else if (!this.seTomoFoto && this.form.valid) {
      // Mostrar un mensaje de error si no se tomó la foto
      await this.mensajesService.mostrar(
        'ERROR',
        'Falta tomar la foto',
        'error'
      );
    } else {
      // Mostrar un mensaje de error si algún campo está incompleto
      await this.mensajesService.mostrar(
        'ERROR',
        'Verifique que esten todos los campos completos',
        'error'
      );
    }

    this.cargando = false;

    if (registroCorrecto) {
      // Redirigir a la página de inicio o a donde sea necesario después de un registro exitoso
      // Ejemplo:
      this.router.navigate(['inicio'], { replaceUrl: true });
    }
  }

  async leerDocumento() {
    this.barcodeScanner
      .scan({ formats: 'PDF_417' })
      .then((res) => {
        this.scannedBarCode = res;
        let userQR = this.scannedBarCode['text'];
        let data = userQR.split('@');
        if (!isNaN(Number(data[4]))) {
          this.form.get('nombre')?.setValue(data[2]);
          this.form.get('apellido')?.setValue(data[1]);
          this.form.get('dni')?.setValue(data[4]);
        } else {
          this.form.get('nombre')?.setValue(data[5]);
          this.form.get('apellido')?.setValue(data[4]);
          this.form.get('dni')?.setValue(data[1].trim());
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

  isValidField(field: string) {
    const control = this.form.get(field);
    return control && control.invalid && control.touched ? 'is-invalid' : '';
  }
}
