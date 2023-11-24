import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-grafico-clientes',
  templateUrl: './grafico-clientes.component.html',
  styleUrls: ['./grafico-clientes.component.scss'],
})
export class GraficoClientesComponent implements OnInit, AfterViewInit {
  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef;
  @ViewChild('nivelSatisfaccion') graficoCanvasLineal!: ElementRef;
  cargando: boolean = false;
  encuestas: any[] = [];
  @ViewChild('graficoCanvasTorta') graficoCanvasTorta!: ElementRef;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {}

  async ngAfterViewInit() {
    this.cargando = true;
    this.encuestas = await this.firestoreService.obtenerEncuestas();

    this.encuestas = this.encuestas.sort((a, b) => {
      return parseInt(b.data.fecha) - parseInt(a.data.fecha);
    });

    this.obtenerDatosEncuestasYDibujarGraficoBarras();
    this.obtenerDatosEncuestasYDibujarGraficoTorta();
    this.obtenerDatosEncuestasYDibujarGraficoLineal();
    setTimeout(() => {
      this.cargando = false;
    }, 500);
  }

  atras() {
    this.router.navigate(['homeCliente']);
  }

  adelante() {
    this.router.navigate(['listadoEncuestas']);
  }

  private async obtenerDatosEncuestasYDibujarGraficoBarras() {
    try {
      // Obtén los datos de las encuestas desde Firestore

      // Extrae los datos relevantes para construir el gráfico de barras
      const labelsBarra = this.encuestas.map(
        (encuesta: any) => encuesta.data.nombre
      );
      const dataBarra = this.encuestas.map(
        (encuesta: any) => encuesta.data.valoracion
      );

      // Obtén el contexto del lienzo del elemento ElementRef
      const ctx = (
        this.graficoCanvas.nativeElement as HTMLCanvasElement
      ).getContext('2d');

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
        console.error(
          'No se pudo obtener el contexto del lienzo para el gráfico de barras.'
        );
      }
    } catch (error) {
      console.error('Error al obtener datos de encuestas:', error);
    }
  }

  private async obtenerDatosEncuestasYDibujarGraficoLineal() {
    try {
      // Obtén los datos de las encuestas desde Firestore

      // Extrae los datos relevantes para construir el gráfico lineal
      const labelsLineal = this.encuestas.map(
        (encuesta: any) => encuesta.data.nombre
      );
      const dataLineal = this.encuestas.map((encuesta: any) =>
        Math.round(encuesta.data.nivelSatisfaccion)
      );

      // Obtén el contexto del lienzo del elemento ElementRef para el gráfico lineal
      const ctxLineal = (
        this.graficoCanvasLineal.nativeElement as HTMLCanvasElement
      ).getContext('2d');

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
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1, // Incremento entre los valores en el eje Y
                },
                min: 1, // Valor mínimo en el eje Y
                max: 5, // Valor máximo en el eje Y
              },
            },
          },
        });
      } else {
        console.error(
          'No se pudo obtener el contexto del lienzo para el gráfico lineal.'
        );
      }
    } catch (error) {
      console.error('Error al obtener datos de encuestas:', error);
    }
  }

  private async obtenerDatosEncuestasYDibujarGraficoTorta() {
    try {
      // Obtén los datos de las encuestas desde Firestore

      // Extrae los datos relevantes para construir el gráfico de torta
      const respuestasTorta = this.encuestas.map(
        (encuesta: any) => encuesta.data.primeraVisita
      );
      const conteoRespuestasTorta = this.contarRespuestas(respuestasTorta);

      // Obtén el contexto del lienzo del elemento ElementRef para el gráfico de torta
      const ctxTorta = (
        this.graficoCanvasTorta.nativeElement as HTMLCanvasElement
      ).getContext('2d');

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
                backgroundColor: this.generarColores(
                  Object.keys(conteoRespuestasTorta).length
                ),
                label: 'Primera vez que vino', // Puedes ajustar el texto del label según tus necesidades
              },
            ],
          },
          options: {
            // Configuración de opciones del gráfico de torta
          },
        });
      } else {
        console.error(
          'No se pudo obtener el contexto del lienzo para el gráfico de torta.'
        );
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

    console.log('Conteo de respuestas:', conteo); // Agrega este log para verificar el conteo

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
