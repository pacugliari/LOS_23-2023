import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs, addDoc,doc, updateDoc, where, query } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
  usuario: string;
  clave: string;
  tipo: string;
  autenticado: boolean;
}

export interface Reserva {
  usuario: string;
  fecha: string;
  id: string;
  rol: string;
  autenticado: boolean;
  hora: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservaService {

  private reservasCollection = 'reservas';
  private reservasSubject: BehaviorSubject<Reserva[]> = new BehaviorSubject<Reserva[]>([]);

  public reservas$: Observable<Reserva[]> = this.reservasSubject.asObservable();

  constructor() {}

  private tienePropiedadesUsuario(obj: any): obj is Usuario {
    try {
      return obj && typeof obj === 'object' && 'tipo' in obj && 'autenticado' in obj;
    } catch (error) {
      console.error('Error al verificar propiedades del usuario', error);
      return false;
    }
  }

  async realizarReserva(usuario: Usuario, fecha: Date, hora: string): Promise<boolean> {
    try {
      console.log('Iniciando el proceso de reserva...');
  
      // Obtén el tiempo actual
      const tiempoActual = new Date();
  
      // Verifica si el usuario es cliente y está autenticado
      if (await this.existeNombreRegistrado(usuario.usuario)) {
        console.log('El usuario es cliente y está autenticado. Realizando reserva...');
  
        // Validar que la hora de la reserva sea al menos 40 minutos en el futuro
        const tiempoReserva = new Date(fecha);

        tiempoReserva.setHours(parseInt(hora.split(':')[0]), parseInt(hora.split(':')[1]));
  
        const tiempoLimite = new Date(tiempoActual.getTime() + 40 * 60000);
  
        console.log('Tiempo actual:', tiempoActual);
        console.log('Tiempo límite:', tiempoLimite);
        
        if (tiempoActual > tiempoLimite) {
          // La reserva no cumple con el requisito de tiempo
          console.log('La reserva no cumple con el requisito de tiempo.');
          return false;
        }
  
        // Guardar la reserva en la colección 'reservas'
        await this.guardarReserva(usuario.usuario, fecha, hora);
  
        console.log('Éxito al realizar la reserva.');
        return true;
      } else {
        console.log('El usuario no está autenticado como cliente o el nombre ya está registrado. No se realizará la reserva.');
        return false;
      }
    } catch (error) {
      console.error('Error al realizar la reserva', error);
      return false;
    }
  }
  
  async guardarReserva(usuario: string, fecha: Date, hora: string): Promise<void> {
    try {
      const db = getFirestore();
      const reservasCollection = collection(db, 'reservas');
      
      const nuevaReserva: Reserva = {
        usuario: usuario,
        fecha: fecha.toISOString(), // Convertir a formato ISO para asegurar la consistencia del formato de fecha
        id: '', // Puedes generar un ID único aquí o dejar que Firestore lo genere automáticamente
        rol: '', // Ajusta según sea necesario
        autenticado: true, // Ajusta según sea necesario
        hora: hora,
        estado: 'pendiente', // Puedes establecer el estado inicial aquí
      };
  
      await addDoc(reservasCollection, nuevaReserva);
    } catch (error) {
      console.error('Error al guardar la reserva', error);
    }
  }

  async existeNombreRegistrado(nombre: string): Promise<boolean> {
    try {
      const db = getFirestore();
      const q = query(collection(db, 'usuarios'), where('nombre', '==', nombre));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error al verificar la existencia del nombre', error);
      return false;
    }
  }

  async obtenerReservasPendientes(): Promise<Reserva[]> {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, this.reservasCollection));

      console.log('Documentos encontrados:', querySnapshot.docs);

      const reservas = querySnapshot.docs
        .filter((doc) => {
          const data = doc.data() as Reserva;
          console.log('Datos de la reserva:', data);

          // Verifica que la propiedad 'estado' esté definida y sea 'pendiente'
          return data.estado !== undefined && data.estado === 'pendiente';
        })
        .map((doc) => {
          const data = doc.data() as Reserva;
          return Object.assign({}, { id: doc.id }, data);
        });

      console.log('Reservas pendientes:', reservas);

      return reservas;
    } catch (error) {
      console.error('Error al obtener reservas pendientes', error);
      return [];
    }
  }

  async confirmarReserva(id: string): Promise<void> {
    try {
      const db = getFirestore();
      const reservaDoc = doc(db, this.reservasCollection, id);
      await updateDoc(reservaDoc, { estado: 'confirmada' });
    } catch (error) {
      console.error('Error al confirmar la reserva', error);
    }
  }

  async rechazarReserva(id: string): Promise<void> {
    try {
      const db = getFirestore();
      const reservaDoc = doc(db, this.reservasCollection, id);
      await updateDoc(reservaDoc, { estado: 'rechazada' });
    } catch (error) {
      console.error('Error al rechazar la reserva', error);
    }
  }
}
