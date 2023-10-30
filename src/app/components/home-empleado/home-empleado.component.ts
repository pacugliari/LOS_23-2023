import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home-empleado',
  templateUrl: './home-empleado.component.html',
  styleUrls: ['./home-empleado.component.scss'],
})
export class HomeEmpleadoComponent  implements OnInit {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {}

  verProductos() {
    this.router.navigate(['listado/productos'], { replaceUrl: true });
  }
  altaProductos() {
    this.router.navigate(['alta-productos'], { replaceUrl: true });
  }

  salir() {
    this.usuarioService.salir();
  }
}
