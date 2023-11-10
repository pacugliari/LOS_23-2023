import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-listado-productos', // Cambia el nombre del selector
  templateUrl: './listado-productos.component.html', // Cambia la plantilla HTML
  styleUrls: ['./listado-productos.component.scss'], // Cambia los estilos si es necesario
})
export class ListadoProductosComponent implements OnInit {
  productos: any[] = []; // Cambia el nombre de la propiedad a 'productos'
  // Cambia el nombre del arreglo a 'productos'
  public cargando: boolean = false;
  qrCodes: string[] = []; // Declaración de la propiedad qrCodes

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private mensajesService: MensajeService
  ) {}  

  ngOnInit() {
    this.cargando = true;
    this.cargarProductos(); // Cambia el nombre de la función cargar
  }

  seleccionarProducto(){
   // asignacion de productos al pedido de la mesa PUNTO 7 JIRA
  }

  async cargarProductos() { // Cambia el nombre de la función cargar
    try {
      console.log('Cargando productos...'); // Cambia el mensaje de consola
      this.productos = await this.firestoreService.traerProductosBd(); // Cambia 'producto' a 'productos'

      console.log(this.productos);

      await this.mensajesService.mostrar(
        'Productos cargados exitosamente', // Cambia el mensaje de éxito
        'Los productos se han cargado con éxito.',
        'success'
      );

      console.log('Productos cargados.');
    } catch (error) {
      console.error('Error al cargar productos desde Firestore:', error); // Cambia el mensaje de error
    } finally {
      this.cargando = false;
    }
  }
}
