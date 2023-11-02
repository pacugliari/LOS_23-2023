import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
})
export class HomeClienteComponent  implements OnInit {

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {}


  async salir() {
    this.usuarioService.salir();

  }
}
