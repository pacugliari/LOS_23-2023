import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getDocs, query, collection, orderBy, limit } from 'firebase/firestore';
import { Card } from './card.interface';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MensajeService } from 'src/app/services/mensaje.service';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-memotest',
  templateUrl: './memotest.component.html',
  styleUrls: ['./memotest.component.scss'],
})
export class MemotestComponent implements OnInit {
  userId: string | undefined;
  cardRows: Card[][] = [];
  mejoresRegistros: any[] = [];
  selectedCards: Card[] = [];
  animalImages: string[] = [
    'assets/memotest/hamburguesa.jpg',
    'assets/memotest/papas.jpg',
    'assets/memotest/pizza.jpg',
  ];
  timer: number = 0;
  gameInterval: any;
  gameStarted: boolean = false;
<<<<<<< HEAD
  userName: string | undefined; // Agrega esta propiedad
  constructor(private router: Router,private navCtrl: NavController,   private mensajesService:MensajeService,
    private firestoreService:FirestoreService,
    private usuarioService : UsuarioService) {}

=======
  userName: string | undefined; 
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private mensajesService: MensajeService
  ) {}
>>>>>>> 8039755b364888e060dc6c24217d633c38545315

  async ngOnInit() {
    await this.mostrarMensajeInicio();
    this.initializeGame();
  }

  async mostrarMensajeInicio() {
    await this.mensajesService.mostrar(
      '¡Bienvenido!',
      'Debes ganar el juego antes de los 30 segundos para obtener un 10% de descuento.',
      'info'
    );
  }

  atras() {
    this.router.navigate(['homeCliente'], { replaceUrl: true });
  }

  async initializeGame() {
    this.timer = 0;
    const pairs = this.animalImages.concat(this.animalImages);
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    this.cardRows = [];
    const rowSize = 4;
    for (let i = 0; i < pairs.length; i += rowSize) {
      this.cardRows.push(
        pairs.slice(i, i + rowSize).map(
          (image) =>
            ({
              image,
              flipped: false,
              matched: false,
            } as Card)
        )
      );
    }

    // Inicia el temporizador después de cerrar el mensaje
    this.startTimer();
  }

  flipCard(card: Card) {
    if (this.gameStarted && !card.flipped && this.selectedCards.length < 2) {
      card.flipped = true;
      this.selectedCards.push(card);
      if (this.selectedCards.length === 2) {
        setTimeout(() => {
          this.selectedCards.forEach((selectedCard) => {
            selectedCard.flipped = false;
          });
          this.checkMatch();
          this.selectedCards = [];
        }, 1000);
      }
    }
  }

  checkMatch() {
    if (this.selectedCards[0].image === this.selectedCards[1].image) {
      this.selectedCards[0].matched = true;
      this.selectedCards[1].matched = true;
    }
  }

  startTimer() {
    this.gameStarted = true;
    this.gameInterval = setInterval(() => {
      this.timer++;
      if (this.isGameFinished()) {
        this.endGame();
      }
    }, 1000);
  }

  async endGame() {
    clearInterval(this.gameInterval);

    if (this.timer < 30 && this.isGameFinished()) {
      // Muestra mensaje de felicitación con el descuento

      let usuarios = await this.firestoreService.obtener("usuarios");
      let usuarioLog = this.usuarioService.getUsuarioLogueado();
  
      let usuarioBuscado = usuarios.filter(
        (usuario: any) => usuario.id === usuarioLog.id
      )[0];
  
      if(usuarioBuscado.data.descuento !== null && usuarioBuscado.data.descuento !== undefined){
        this.mensajesService.mostrar("INFO","Usted ya tiene un descuento aplicado","info")
      }else{
        await this.mensajesService.mostrar(
          '¡Felicidades!',
          '¡Ganaste un 10%!',
          'success'
        );
        
        usuarioBuscado.data.descuento = 10;
        await this.firestoreService.modificar(usuarioBuscado,"usuarios");
      }
    } else {
      // Muestra mensaje de pérdida
      const resultadoPerdida = await this.mensajesService.mostrar(
        '¡Perdiste!',
        'Inténtalo de nuevo',
        'error'
      );

      // Reinicia el juego después de cerrar el mensaje de pérdida
      if (resultadoPerdida.value) {
        this.initializeGame();
      }
    }
  }

  isGameFinished(): boolean {
    return this.cardRows.every((row) => row.every((card) => card.matched));
  }
}
