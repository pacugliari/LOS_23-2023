import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-grafico-empleados',
  templateUrl: './grafico-empleados.component.html',
  styleUrls: ['./grafico-empleados.component.scss'],
})
export class GraficoEmpleadosComponent  implements OnInit {

  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef;
  @ViewChild('nivelSatisfaccion') graficoCanvasLineal!: ElementRef;

  @ViewChild('graficoCanvasTorta') graficoCanvasTorta!: ElementRef;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {}

  ngAfterViewInit() {

    this.obtenerDatosEncuestasYDibujarGraficoTorta();
   
  }


  private async obtenerDatosEncuestasYDibujarGraficoTorta() {
    try {
      // Obtén los datos de las encuestas desde Firestore
      const encuestas = await this.firestoreService.obtenerEncuestasempleados();
  
      // Extrae los datos relevantes para construir el gráfico de torta
      const respuestasTorta = encuestas.map((encuesta: any) => encuesta.data.valoracion);
      const conteoRespuestasTorta = this.contarRespuestas(respuestasTorta);
  
      // Obtén el contexto del lienzo del elemento ElementRef para el gráfico de torta
      const ctxTorta = (this.graficoCanvasTorta.nativeElement as HTMLCanvasElement).getContext('2d');
  
      // Comprueba si el contexto no es nulo antes de crear el gráfico de torta
      if (ctxTorta) {
        // Destruye el gráfico de torta existente si ya existe
        Chart.getChart(ctxTorta.canvas.id)?.destroy();
  
        // Crea el gráfico de torta
       const tortaChart = new Chart(ctxTorta, {
  type: 'doughnut',
  data: {
    labels: Object.keys(conteoRespuestasTorta),
    datasets: [
      {
        data: Object.values(conteoRespuestasTorta),
        backgroundColor: this.generarColores(Object.keys(conteoRespuestasTorta).length),
        label: 'valoracion', // Puedes ajustar el texto del label según tus necesidades
      },
    ],
  },
          options: {
            // Configuración de opciones del gráfico de torta
          },
        });
      } else {
        console.error('No se pudo obtener el contexto del lienzo para el gráfico de torta.');
      }
    } catch (error) {
      console.error('Error al obtener datos de encuestas:', error);
    }
  }

  private contarRespuestas(respuestas: string[]) {
    const conteo: { [key: string]: number } = {};
  
    respuestas.forEach((respuesta) => {
      if (conteo[respuesta]) {
        conteo[respuesta]++;
      } else {
        conteo[respuesta] = 1;
      }
    });
  
    console.log('Conteo de respuestas:', conteo);  // Agrega este log para verificar el conteo
  
    return conteo;
  }

  private generarColores(cantidad: number): string[] {
    // Genera colores aleatorios usando valores hexadecimales
    const colores = [];
    for (let i = 0; i < cantidad; i++) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colores.push(color);
    }
    return colores;
  }
}
