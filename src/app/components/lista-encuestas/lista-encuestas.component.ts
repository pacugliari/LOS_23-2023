import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-lista-encuestas',
  templateUrl: './lista-encuestas.component.html',
  styleUrls: ['./lista-encuestas.component.scss'],
})
export class ListaEncuestasComponent  implements OnInit {

  navController: any;
  scannedBarCode: any;
  encuestas: any[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private firestoreService: FirestoreService,
    private router:Router
  ) {}
  async ngOnInit() {
    await this.cargarEncuestas();
  }
  
  async cargarEncuestas() {
    this.encuestas = await this.firestoreService.obtener('encuestas');
    console.log(this.encuestas);
    console.log(this.encuestas);
  }


  atras() {
    this.router.navigate(['homeCliente'], { replaceUrl: true });
  }

}
