import { Component, OnInit } from '@angular/core';
import { Reserva, ReservaService } from '../../services/reserva.service';
import { ToastController } from '@ionic/angular';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
})
export class ReservaComponent implements OnInit {
  usuario: string = '';
  fecha: Date = new Date();
  hora: string = '';
  reservas: Reserva[] = [];

  constructor(private usuarioService: UsuarioService, private reservaService: ReservaService, private toastController: ToastController) {}
 
  ngOnInit(): void {
    this.reservaService.reservas$.subscribe((reservas) => {
      this.reservas = reservas;
    });

    // Llamar al método para obtener las reservas pendientes
    this.reservaService.obtenerReservasPendientes();
  }
 async obtenerReservasPendientes(){
  
 }

 async realizarReserva() {
  try {
    // Llama al servicio de reserva para realizar la reserva
    const usuario = this.usuarioService.getUsuarioLogueado();

    // Antes de llamar a realizarReserva
    console.log('Usuario antes de realizar la reserva:', usuario);

    // Verifica si el usuario es cliente o dueño
    if (usuario.tipo === 'cliente' || usuario.tipo === 'duenio') {
      console.log('El usuario es cliente o dueño. Realizando reserva...');
      const exito = await this.reservaService.realizarReserva(usuario, this.fecha, this.hora);

      // Después de llamar a realizarReserva
      console.log('Éxito al realizar la reserva:', exito);

      // Puedes agregar más mensajes de registro si es necesario para depurar
      console.log('Fecha de reserva:', this.fecha);
      console.log('Hora de reserva:', this.hora);
    } else {
      console.log('El usuario no es cliente ni dueño. No se realizará la reserva.');
    }

    // Resto del código
  } catch (error) {
    console.error('Error al intentar realizar la reserva', error);
    this.mostrarMensaje('Error al intentar realizar la reserva. Consulta la consola para obtener más detalles.');
  }
}



  
  private formatearFecha(fecha: any): string | null {
    if (typeof fecha === 'string') {
      // Si ya es una cadena, devolverla
      return fecha;
    } else if (fecha instanceof Date) {
      // Si es un objeto Date, convertirlo a cadena legible
      return fecha.toISOString();
    } else {
      // Si no es ni cadena ni Date, devolver null
      return null;
    }
  }
  
  private validarCampos(): boolean {
    return this.usuario && this.fecha && this.hora ? true : false;
  }
  
  private async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // duración en milisegundos
    });
    toast.present();
  }
}
