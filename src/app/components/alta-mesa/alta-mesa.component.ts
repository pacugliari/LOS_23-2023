import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent implements OnInit {
  scannedBarCode: any;
  imageElement: any = '../../../assets/mesa.jpg';
  foto: boolean = false;
  public cargando: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private mensajesService: MensajeService,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  form = this.formBuilder.group({
    comensalesMesa: ['', [Validators.required]],
    tipoMesa: ['', [Validators.required]],
    numeroMesa: ['', [Validators.required]],
  });

  ngOnInit() {}

  async registrar() {
    this.cargando = true;
    let registroCorrecto = false;
    console.log(this.form);
    if (this.form.valid && this.foto) {
      let fotoUrl = await this.storageService.guardarFoto(
        this.imageElement,
        'mesas'
      );
      let data = {
        comensalesMesa: this.form.value.comensalesMesa,
        tipoMesa: this.form.value.tipoMesa,
        numeroMesa: this.form.value.numeroMesa,
        foto: fotoUrl,
      };

      await this.firestoreService.guardar(data, 'mesas');
      await this.mensajesService.mostrar(
        '',
        'Mesa creada correctamente',
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
      this.router.navigate(['home'], { replaceUrl: true });
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

  isValidField(field: string): string {
    const validateField = this.form?.get(field);
    return !validateField?.valid && validateField?.touched
      ? 'is-invalid'
      : validateField?.touched
      ? 'is-valid'
      : '';
  }
}
