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
        nombre: 'Cliente 1',
        opinion: 'Buena experiencia',
        nivelSatisfaccion: 5,
        ofertasCorreo: true,
        primeraVisita: 'no'
        // ... otros campos de la encuesta
      },
      {
        nombre: 'Cliente 2',
        opinion: 'Podría mejorar',
        nivelSatisfaccion: 3,
        ofertasCorreo: false,
        primeraVisita: 'si'
        // ... otros campos de la encuesta
      },
      // Puedes agregar más respuestas de encuestas aquí
    ];
  }

  ngAfterViewInit() {
    // Procesar los datos de las encuestas para el gráfico
    const nivelSatisfaccionData = this.encuestas.map(encuesta => encuesta.nivelSatisfaccion);
    const personasRegresarianData = this.encuestas.filter(encuesta => encuesta.ofertasCorreo).length;
    const primeraVisitaData = [
      this.encuestas.filter(encuesta => encuesta.primeraVisita === 'si').length,
      this.encuestas.filter(encuesta => encuesta.primeraVisita === 'no').length
    ];

    // Crear el gráfico
    const ctx = this.graficoCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Nivel de Satisfacción', 'Personas que regresarían', 'Primera Visita (Sí/No)'],
          datasets: [{
            label: 'Respuestas de Encuestas',
            data: [nivelSatisfaccionData, personasRegresarianData, primeraVisitaData],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
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