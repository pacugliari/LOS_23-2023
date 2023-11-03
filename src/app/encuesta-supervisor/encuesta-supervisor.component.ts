import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-encuesta-supervisor',
  templateUrl: './encuesta-supervisor.component.html',
  styleUrls: ['./encuesta-supervisor.component.scss'],
})
export class EncuestaSupervisorComponent implements OnInit {
  formulario!: FormGroup;
  nombre: string = '';
  edad: number = 18;
  genero: string = 'masculino';
  selectedType: string = '';
  preferencia: boolean = false;
  puesto: string = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      nombre: [this.nombre, Validators.required],
      edad: [this.edad, Validators.min(18)],
      genero: [this.genero],
      // Agregar otros campos y sus validaciones si es necesario
    });
  }



  cargarDatos() {
    if (this.selectedType === 'empleado') {
      // Lógica para cargar campos específicos para empleado
    } else if (this.selectedType === 'cliente') {
      // Lógica para cargar campos específicos para cliente
    }
  }

  enviarFormulario() {
    // Lógica para enviar y guardar los datos del formulario
    // Puedes acceder a los valores del formulario con this.formulario.value
    // y realizar las operaciones necesarias, como enviar los datos a través de un servicio, etc.
  }
}
