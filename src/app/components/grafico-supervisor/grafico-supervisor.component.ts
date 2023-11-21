import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { FirestoreService } from 'src/app/services/firestore.service';



@Component({
  selector: 'app-grafico-supervisor',
  templateUrl: './grafico-supervisor.component.html',
  styleUrls: ['./grafico-supervisor.component.scss'],
})
export class GraficoSupervisorComponent  implements OnInit {

  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef;
  @ViewChild('nivelSatisfaccion') graficoCanvasLineal!: ElementRef;
  @ViewChild('graficoCanvasBurbujas') graficoCanvasBurbujas!: ElementRef;


  @ViewChild('graficoCanvasTorta') graficoCanvasTorta!: ElementRef;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.obtenerDatosEncuestasYDibujarGraficoBarrass();
    this.obtenerDatosEncuestasYDibujarGraficoTorta();
    this.obtenerDatosEncuestasYDibujarGraficoBurbujas();
    this.obtenerDatosEncuestasYDibujarGraficoLineal();
  
   
  }

  private async obtenerDatosEncuestasYDibujarGraficoLineal() {
    try {
      // Obtén los datos de las encuestas desde Firestore
      const encuestas = await this.firestoreService.obtenerEncuestasSupervisor();
  
      // Extrae los datos relevantes para construir el gráfico lineal
      const labelsLineal = encuestas.map((encuesta: any) => encuesta.data.nombre);
      const dataLineal = encuestas.map((encuesta: any) => encuesta.data.valoracion);
  
      // Obtén el contexto del lienzo del elemento ElementRef para el gráfico lineal
      const ctxLineal = (this.graficoCanvasLineal.nativeElement as HTMLCanvasElement).getContext('2d');
  
      // Comprueba si el contexto no es nulo antes de crear el gráfico lineal
      if (ctxLineal) {
        // Destruye el gráfico lineal existente si ya existe
        Chart.getChart(ctxLineal.canvas.id)?.destroy();
  
        // Crea el gráfico lineal
        const linealChart = new Chart(ctxLineal, {
          type: 'line',
          data: {
            labels: labelsLineal,
            datasets: [
              {
                label: 'Nivel Satisfaccion',
                data: dataLineal,
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
              },
            ],
          },
          options: {
            // Configuración de opciones del gráfico lineal
          },
        });
      } else {
        console.error('No se pudo obtener el contexto del lienzo para el gráfico lineal.');
      }
    } catch (error) {
      console.error('Error al obtener datos de encuestas:', error);
    }
  }

  private async obtenerDatosEncuestasYDibujarGraficoTorta() {
    try {
      // Obtén los datos de las encuestas desde Firestore
      const encuestas = await this.firestoreService.obtenerEncuestasSupervisor();
  
      // Extrae los datos relevantes para construir el gráfico de torta
      const respuestasTorta = encuestas.map((encuesta: any) => encuesta.data.
      clienteoempleado);
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
        label: 'Cliente o empleado', // Puedes ajustar el texto del label según tus necesidades
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
  private async obtenerDatosEncuestasYDibujarGraficoBarrass() {
    try {
      // Obtén los datos de las encuestas desde Firestore
      const encuestass = await this.firestoreService.obtenerEncuestasSupervisor();
  
      // Extrae los datos relevantes para construir el gráfico de barras
      const labelsBarra = encuestass.map((encuesta: any) => encuesta.data.nombre);
      const dataBarra = encuestass.map((encuesta: any) => encuesta.data.recomendar);
  
      // Obtén el contexto del lienzo del elemento ElementRef
      const ctx = (this.graficoCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
  
      // Comprueba si el contexto no es nulo antes de crear el gráfico de barras
      if (ctx) {
        // Destruye el gráfico existente si ya existe
        Chart.getChart(ctx.canvas.id)?.destroy();
  
        // Crea el gráfico de barras
        const barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labelsBarra,
            datasets: [
              {
                label: 'Valoración de atencion',
                data: dataBarra,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            // Configuración de opciones del gráfico de barras
          },
        });
      } else {
        console.error('No se pudo obtener el contexto del lienzo para el gráfico de barras.');
      }
    } catch (error) {
      console.error('Error al obtener datos de encuestas:', error);
    }
  }
  private async obtenerDatosEncuestasYDibujarGraficoBurbujas() {
    try {
      // Obtén los datos de las encuestas desde Firestore
      const encuestass = await this.firestoreService.obtenerEncuestasSupervisor();
      // Extrae los datos relevantes para construir el gráfico de burbujas
      const dataBurbujas = encuestass.map((encuesta: any) => encuesta.data.recomendar);
  
      // Obtén el contexto del lienzo del elemento ElementRef para el gráfico de burbujas
      const ctxBurbujas = (this.graficoCanvasBurbujas.nativeElement as HTMLCanvasElement).getContext('2d');
  
      // Comprueba si el contexto no es nulo antes de crear el gráfico de burbujas
      if (ctxBurbujas) {
        // Destruye el gráfico de burbujas existente si ya existe
        Chart.getChart(ctxBurbujas.canvas.id)?.destroy();
  
        // Crea el gráfico de burbujas
        const burbujasChart = new Chart(ctxBurbujas, {
          type: 'bubble',
          data: {
            datasets: [
              {
                label: 'Burbujas',
                data: dataBurbujas,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            // Configuración de opciones del gráfico de burbujas
          },
        });
      } else {
        console.error('No se pudo obtener el contexto del lienzo para el gráfico de burbujas.');
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
