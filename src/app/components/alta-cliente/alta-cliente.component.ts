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
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.component.html',
  styleUrls: ['./alta-cliente.component.scss'],
})
export class AltaClienteComponent {
  scannedBarCode: any;
  imageElement: any = '../../../assets/usuario.png';
  foto: boolean = false;
  public cargando: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  form = this.formBuilder.group({
    usuario: ['', [Validators.required]],
    clave: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    dni: ['', [Validators.required]],
  });

  ngOnInit() {}

  async registrar() {
    this.cargando = true;
    let registroCorrecto = false;

    if (this.form.valid && this.foto) {
      let fotoUrl = await this.storageService.guardarFoto(
        this.imageElement,
        'clientes'
      );
      let data = {
        usuario: this.form.value.usuario,
        clave: this.form.value.clave,
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        dni: this.form.value.dni,
        foto: fotoUrl,
      };

      await this.firestoreService.guardar(data, 'clientes');
      await this.mensajesService.mostrar(
        '',
        'El cliente fue creado correctamente',
        'success'
      );
      registroCorrecto = true;
    } else if (!this.foto && this.form.valid) {
      await this.mensajesService.mostrar(
        'ERROR',
        'Falta tomar la foto',
        'error'
      );
    } else {
      await this.mensajesService.mostrar(
        'ERROR',
        'Verifique que esten todos los campos completos',
        'error'
      );
    }
    this.cargando = false;
    if (registroCorrecto) {
      this.router.navigate(['login'], { replaceUrl: true });
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

  isValidField(field: string): string {
    const validateField = this.form?.get(field);
    return !validateField?.valid && validateField?.touched
      ? 'is-invalid'
      : validateField?.touched
      ? 'is-valid'
      : '';
  }
}
