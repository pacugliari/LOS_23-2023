import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from 'src/app/services/storage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-productos',
  templateUrl: './alta-productos.component.html',
  styleUrls: ['./alta-productos.component.scss'],
})
export class AltaProductosComponent {
  form: FormGroup;
  public cargando: boolean = false;
  imageElements: (string | undefined)[] = [undefined, undefined, undefined];


  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tiempo: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }

  async tomarFoto(index: number) {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      webUseInput: true,
    });
    this.imageElements[index] = image.dataUrl; // Almacena la imagen en el array
  }

  async registrarProducto() {
    this.cargando = true;

    if (this.form.valid && this.imageElements.every(img => img !== '')) {
      const data = {
        nombre: this.form.value.nombre,
        descripcion: 'De carne', // Agrega la descripción deseada
        tiempo: 45, // Agrega el tiempo deseado
        precio: 3000, // Agrega el precio deseado
        fotos: this.imageElements, // Almacena las URLs de las fotos en un array
      };

      try {
        await this.firestoreService.guardar(data, 'productos');
        this.cargando = false;
        this.router.navigate(['inicio'], { replaceUrl: true });
      } catch (error) {
        console.error(error);
        this.cargando = false;
      }
    } else {
      this.cargando = false;
      console.error('Verifique que todos los campos estén completos y que haya tomado las tres fotos.');
    }
  }
}
