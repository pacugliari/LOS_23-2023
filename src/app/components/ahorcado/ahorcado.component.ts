import { Component } from '@angular/core';

import { MensajeService } from 'src/app/services/mensaje.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
})
export class AhorcadoComponent {
  public palabras: string[] = [
    'pizza',
    'hamburgesa',
    'helado',
    'bebida',
    'pastas',
    'cocinero',
    'metre',
    'cliente',
    'milanesa',
    'restaurantes',
    'carne',
    'comida',
    'reserva',
    'mesa',
    'chef',
    'propina',
    'carta',
    'mantel',
    'volcan',
    'churrasco',
    'pure',
   
  ];

  public abecedario: string[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  constructor(private mensajesService:MensajeService) {
    this.palabraJuego = '_ '.repeat(this.palabra.length);
  }

  public palabraJuego: string = '';
  public palabra: string =
    this.palabras[Math.floor(Math.random() * this.palabras.length)];
  public intentos: number = 0;
  public puntaje: number = 0;
  public partida: boolean | undefined = undefined;
  public botonClick: { [letra: string]: boolean } = {};

  comprobarClick(letra: string) {
    if (!this.botonClick[letra]) {
      this.comprobarLetra(letra);

      const arrPalabra = this.palabraJuego.split(' ');

      for (let i = 0; i <= this.palabra.length; i++) {
        if (this.palabra[i] === letra) {
          arrPalabra[i] = letra;
        }
      }
      this.palabraJuego = arrPalabra.join(' ');
      this.botonClick[letra] = true;
      //console.log(this.palabraJuego);
      //  console.log(this.palabra);
      this.verificarEstado();
    }
  }

  comprobarLetra(letra: string) {
    if (this.palabra.indexOf(letra) == -1) {
      this.intentos++;
    }
  }

  public verificarEstado() {
    const palabraArr = this.palabraJuego.split(' ');
    const palabraChekear = palabraArr.join('');

    if (palabraChekear === this.palabra) {
      this.partida = true;
      this.alertaGanador();
    } else if (this.intentos === 6) {
      this.partida = false;
      this.alertaPerdedor();
    }
  }

  async alertaGanador() {
    await this.mensajesService.mostrar(
      '¡Felicidades!',
      '¡Ganaste un 15%!',
      'success'
    );
  }

  public async alertaPerdedor() {
    await this.mensajesService.mostrar(
      'Perdiste',
      `Volve a intentar!`,
      'error'
    );


  }

  reiniciar() {
    window.location.reload();
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