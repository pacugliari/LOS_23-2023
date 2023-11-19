import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-listado-mesas',
  templateUrl: './listado-mesas.component.html',
  styleUrls: ['./listado-mesas.component.scss'],
})
export class ListadoMesasComponent implements OnInit {
  mesas: any[] = [];
  listaMesas: any[] = [];
  public cargando: boolean = false;
  @Input() mostrarSeleccionar = false;
  @Output() mesaSeleccionada = new EventEmitter<any>();
  
  constructor(
    private firestoreService: FirestoreService,
    private router: Router,private mensajesService:MensajeService,
    private usuarioService:UsuarioService
  ) {}

  async ngOnInit() {
    this.cargando = true;
    await this.cargar();
  }
  async cargar() {
    try {

      this.mesas = await this.firestoreService.obtener("mesas");

      if(this.mostrarSeleccionar){
        this.mesas  = this.mesas.filter((mesa:any)=> mesa.data.estado === "disponible");
        if(this.mesas.length === 0){
          this.mensajesService.mostrar("ERROR","No hay mesas disponbiles","error")
          this.cancelar();
        } 
      }

      this.mesas.forEach((mesa:any) => {
        let aux = mesa.data
        aux.id = mesa.id;
        aux.qr = "MESA:"+mesa.id;
        this.listaMesas.push(aux);
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

  atras(){
    let usuario = this.usuarioService.getUsuarioLogueado();
    if(usuario.data.tipo === "metre"){
      this.router.navigate(['homeEmpleado',1], { replaceUrl: true });
    }else{
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }
}
