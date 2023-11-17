import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-grafico-clientes',
  templateUrl: './grafico-clientes.component.html',
  styleUrls: ['./grafico-clientes.component.scss'],
})
export class GraficoClientesComponent implements OnInit, AfterViewInit {
  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef;

  encuestas: any[] = []; // Suponiendo que guardas las respuestas de encuestas aquí

  constructor() { }

  ngOnInit() {
    this.encuestas = [
      {
        nombre: 'Milagros',
        opinion: 'muy bueno',
        nivelSatisfaccion: 5,
        ofertasCorreo: true,
        primeraVisita: 'no',
        valoracionAtencion: 9 // Supongamos que este campo representa la valoración de atención
        // ... otros campos de la encuesta
      },
      {
        nombre: 'Milagros',
        opinion: 'Podría mejorar',
        nivelSatisfaccion: 5,
        ofertasCorreo: false,
        primeraVisita: 'si',
        valoracionAtencion: 9 // Supongamos que este campo representa la valoración de atención
        // ... otros campos de la encuesta
      },
       {
        nombre: 'Anaa',
        opinion: 'Podría mejorar',
        nivelSatisfaccion: 4,
        ofertasCorreo: true,
        primeraVisita: 'no',
        valoracionAtencion: 7 // Supongamos que este campo representa la valoración de atención
        // ... otros campos de la encuesta
      },
      // Puedes agregar más respuestas de encuestas aquí
    ];
  }

  ngAfterViewInit() {
    // Procesar los datos de las encuestas para el gráfico
    const nivelSatisfaccionData = this.encuestas.map(encuesta => encuesta.nivelSatisfaccion);
    const personasRegresarianData = this.encuestas.filter(encuesta => encuesta.ofertasCorreo).length;
    const primeraVisitaSi = this.encuestas.filter(encuesta => encuesta.primeraVisita === 'si').length;
    const primeraVisitaNo = this.encuestas.filter(encuesta => encuesta.primeraVisita === 'no').length;
    const primeraVisitaData = [primeraVisitaSi, primeraVisitaNo];
    const valoracionAtencionData = this.encuestas.map(encuesta => encuesta.valoracionAtencion);

    // Crear el gráfico
    const ctx = this.graficoCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Nivel de Satisfacción', 'Personas que regresarían', 'Primera Visita (Sí/No)', 'Volverias a visitarnos?', 'Valoración de atención'],
          datasets: [{
            label: 'Respuestas de Encuestas',
            data: [
              nivelSatisfaccionData.reduce((a, b) => a + b, 0), // Suma de los niveles de satisfacción
              personasRegresarianData, // Cantidad de personas que regresarían
              ...primeraVisitaData, // Datos de primera visita (Sí/No)
              valoracionAtencionData.reduce((a, b) => a + b, 0) // Suma de la valoración de atención
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)' // Color agregado para la valoración de atención
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)' // Color agregado para la valoración de atención
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
