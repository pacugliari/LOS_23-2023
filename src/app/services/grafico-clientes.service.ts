import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraficoClientesService {

  private nivelSatisfaccionData = new Subject<number[]>();
  nivelSatisfaccionData$ = this.nivelSatisfaccionData.asObservable();

  actualizarNivelSatisfaccionData(data: number[]) {
    this.nivelSatisfaccionData.next(data);
  }
}
