import { TestBed } from '@angular/core/testing';

import { GraficoClientesService } from './grafico-clientes.service';

describe('GraficoClientesService', () => {
  let service: GraficoClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficoClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
