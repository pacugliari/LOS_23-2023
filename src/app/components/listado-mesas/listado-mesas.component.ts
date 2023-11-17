import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() mostrarSeleccionar = false;
  @Output() mesaSeleccionada = new EventEmitter<any>();
  
  constructor(
    private firestoreService: FirestoreService,
    private router: Router,private mensajesService:MensajeService
  ) {}

  async ngOnInit() {
    this.cargando = true;
    await this.cargar();
  }
  async cargar() {
    try {
      let mesasBase  : any[];
      if(this.mostrarSeleccionar){
        mesasBase = (await this.firestoreService.obtener("mesas")).filter((mesa:any)=> mesa.data.estado === "disponible");
        if(mesasBase.length === 0){
          this.mensajesService.mostrar("ERROR","No hay mesas disponbiles","error")
          this.cancelar();
        } 
      }else{
        mesasBase= await this.firestoreService.obtener("mesas");
      }
      mesasBase.forEach((mesa:any) => {
        let aux = mesa.data
        aux.id = mesa.id;
        aux.qr = "MESA:"+mesa.id;
        this.mesas.push(aux);
      });

    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    } finally {
      this.cargando = false;
    }
  }

  seleccionarMesa(mesa:any){
    this.mesaSeleccionada.emit(mesa)
  }

  cancelar(){
    this.mesaSeleccionada.emit(null)
  }
}
