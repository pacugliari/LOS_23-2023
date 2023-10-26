import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-listado-mesas',
  templateUrl: './listado-mesas.component.html',
  styleUrls: ['./listado-mesas.component.scss'],
})
export class ListadoMesasComponent implements OnInit {
  mesas: any[] = [];
  public cargando: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,private mensajesService:MensajeService
  ) {}

  ngOnInit() {
    this.cargando = true;
    this.cargar();
  }
  async cargar() {
    try {
      console.log('aaaaaaaaaa');
      this.mesas = await this.firestoreService.traerActoresBd();
      console.log(this.mesas);

      await this.mensajesService.mostrar(
        '',
        this.mesas,
        'success'
      );

      console.log('bbbbbb');
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    } finally {
      this.cargando = false;
    }
  }
}
