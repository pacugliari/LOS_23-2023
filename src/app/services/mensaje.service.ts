import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private vibracion : Vibration) { }

  mostrar(titulo:any,mensaje:any,icono:any){
    if(icono === 'error'){
      this.vibracion.vibrate(1000);
    }
    return Swal.fire({
      icon: icono,
      title: titulo,
      text: mensaje,
      heightAuto: false
    })
  }
}
