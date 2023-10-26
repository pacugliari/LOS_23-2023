import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss'],
})
export class RegistroClienteComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}

  registroCliente() {
    this.router.navigate(['alta/cliente'], { replaceUrl: true });
  }
  accesoAnonimo() {
    this.router.navigate(['alta/clienteAnonimo'], { replaceUrl: true });
  }
}
