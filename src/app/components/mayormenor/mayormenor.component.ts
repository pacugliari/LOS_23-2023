import { Component } from '@angular/core';

import { MensajeService } from 'src/app/services/mensaje.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mayormenor',
  templateUrl: './mayormenor.component.html',
  styleUrls: ['./mayormenor.component.scss'],
})
export class MayormenorComponent {
  cartas: string[] = [];

  constructor( private mensajesService:MensajeService) {
    for (let numero = 1; numero <= 12; numero++) {
      for (const palo of ['basto', 'copa', 'espada', 'oro']) {
        this.cartas.push(this.getCardPath(numero, palo));
      }
    }
  }

  cartaAnterior: string = '';
  cartaNueva: string = '';
  puntaje: number = 0;
  mayor: boolean = false;
  mazo: string[] = [...this.cartas];

  getCardPath(numero: number, palo: string): string {
    var path = `assets/Cartas/${numero}de${palo}.png`;
    //console.log(path);
    return path;
  }

  async ngOnInit() {
    await this.mostrarMensajeInicio();
    this.mazo = [...this.cartas];
    this.elegirCarta();
  }
  async mostrarMensajeInicio() {
    await this.mensajesService.mostrar(
      '¡Bienvenido!',
      'Debes ganar el juego con un 5 de puntuacion para obtener un 20% de descuento.',
      'info'
    );
  }

  comprobar(mayor: boolean) {
    this.cartaAnterior = this.cartaNueva;
  
    this.elegirCarta();
    let valorAnterior = this.obtenerValorNumerico(this.cartaAnterior);
    let valorNueva = this.obtenerValorNumerico(this.cartaNueva);
  
    if (
      (mayor && valorNueva! > valorAnterior!) ||
      (!mayor && valorNueva! < valorAnterior!) ||
      valorNueva == valorAnterior
    ) {
      if (this.puntaje < this.cartas.length) {
        this.puntaje++;
        if (this.puntaje === 2) {
          this.mostrarMensajeFelicitacion();
        }
      }
  
      if (this.puntaje === this.cartas.length) {
        this.mostrarMensajeFelicitacion();
      }
    } else {
      this.mostrarAlertaPerdedor();
    }
  }

  elegirCarta() {
    const index = Math.floor(Math.random() * this.mazo.length);
    this.cartaNueva = this.mazo[index];
    //  console.log(this.mazo);
    this.mazo.splice(index, 1);
  }

  obtenerValorNumerico(cartaNombre: string): number | null {
    console.log(cartaNombre);
    const numeroCarta = cartaNombre.match(/\d+/);
    return numeroCarta ? parseInt(numeroCarta[0]) : null;
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.mazo = [...this.cartas];
    this.elegirCarta();
    this.cartaAnterior = '';
  }

  async mostrarMensajeFelicitacion() {
    await this.mensajesService.mostrar(
      '¡Felicidades!',
      '¡Ganaste un 20%!',
      'success'
    );

    this.reiniciarJuego();
  }
  async mostrarAlertaPerdedor() {
    await this.mensajesService.mostrar(
      'Perdiste',
      `Tu puntaje es: ${this.puntaje}`,
      'error'
    );

    this.reiniciarJuego();
  }


  obtenerFecha(): string {
    let ahora = new Date();
    let dia = ahora.getDate();
    let mes = ahora.getMonth() + 1;
    let año = ahora.getFullYear();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let segundos = ahora.getSeconds();
    let diaStr = dia < 10 ? '0' + dia.toString() : dia.toString();
    let mesStr = mes < 10 ? '0' + mes.toString() : mes.toString();
    let segSrt =
      segundos < 10 ? '0' + segundos.toString() : segundos.toString();
    let minStr = minutos < 10 ? '0' + minutos.toString() : minutos.toString();
    let fechaFormateada = `${diaStr}/${mesStr}/${año} ${horas}:${minStr}:${segSrt}`;

    return fechaFormateada;
  }
}