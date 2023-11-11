import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from 'src/app/services/storage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { MensajeService } from 'src/app/services/mensaje.service';

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
    private router: Router,
    private mensajes : MensajeService
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tiempo: ['', Validators.required],
      precio: ['', Validators.required],
      tipo: ['', Validators.required],
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
    this.mensajes.mostrar("OK",`Foto ${index+1} tomada`,"success")
  }



  async registrarProducto() {
    this.cargando = true;
    let fotos : any[] = [];
    if (this.form.valid && this.imageElements.every(img => img !== '')) {

      for (let element of this.imageElements) {
        if(element)
          fotos.push(await this.storageService.guardarFoto(element, "productos"));
      }
      
      const data = {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion, // Agrega la descripción deseada
        tiempo: this.form.value.tiempo, // Agrega el tiempo deseado
        precio: this.form.value.precio, // Agrega el precio deseado
        tipo: this.form.value.tipo,
        fotos: fotos, // Almacena las URLs de las fotos en un array
      };
      
      await this.firestoreService.guardar(data, 'productos');
      this.mensajes.mostrar("OK","Producto registrado","success")
      this.cargando = false;
    } else {
      this.mensajes.mostrar("ERROR","Faltan datos para registrar el producto","error")
    }
    this.form.reset();

  }
}
