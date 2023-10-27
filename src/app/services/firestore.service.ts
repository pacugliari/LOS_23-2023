import { Injectable } from '@angular/core';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from 'src/main';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor() {}

  guardar(data: any, ruta: string) {
    const colRef = collection(firestore, ruta);
    return addDoc(colRef, data);
  }

  async obtener(ruta: string) {
    let array: any[] = [];
    const querySnapshot = await getDocs(collection(firestore, ruta));
    querySnapshot.forEach((doc) => {
      let data = {
        id: doc.id,
        data: doc.data(),
      };
      array.push(data);
    });
    return array;
  }

  public async traerActoresBd() {
    const actoresCollection = collection(firestore, 'mesas');
    const query = await getDocs(actoresCollection);
    const actores = query.docs.map((doc) => {
      return {
        id: doc.id, 
        ...doc.data(), 
      };
    });
    return actores;
  }
}
