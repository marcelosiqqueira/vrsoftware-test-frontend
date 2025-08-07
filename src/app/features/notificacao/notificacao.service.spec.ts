import {
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { NotificacaoService } from './notificacao.service';

import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from '../../../environments/environments';

describe('NotificacaoService (polling)', () => {
  const POLLING = 3000;

  beforeEach(async () => {
    (environment as any).pollingMs = POLLING;

    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('deve atualizar status via polling quando backend retornar PROCESSADO_SUCESSO', fakeAsync(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    const service = TestBed.inject(NotificacaoService);

    const mensagemId = '11111111-1111-4111-8111-111111111111';

    service.notificacoes.update((list) => [
      {
        mensagemId,
        conteudoMensagem: 'Olá mundo',
        status: 'AGUARDANDO_PROCESSAMENTO',
        createdAt: Date.now(),
      },
      ...list,
    ]);

    tick(POLLING + 1);
    tick(0);

    const reqs = httpMock.match(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.apiBaseUrl}/notificacao/status/${mensagemId}`
    );
    expect(reqs.length).toBe(1);
    reqs[0].flush({ mensagemId, status: 'PROCESSADO_SUCESSO' });

    tick(0);

    const item = service
      .notificacoes()
      .find((n) => n.mensagemId === mensagemId)!;
    expect(item.status).toBe('PROCESSADO_SUCESSO');

    httpMock.verify();
    discardPeriodicTasks();
  }));

  it('deve marcar como DESCONHECIDO quando o GET falhar (sem quebrar)', fakeAsync(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    const service = TestBed.inject(NotificacaoService);

    const mensagemId = '22222222-2222-4222-8222-222222222222';

    service.notificacoes.update((list) => [
      {
        mensagemId,
        conteudoMensagem: 'Teste erro',
        status: 'AGUARDANDO_PROCESSAMENTO',
        createdAt: Date.now(),
      },
      ...list,
    ]);

    tick(POLLING + 1);
    tick(0);

    const reqs = httpMock.match(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.apiBaseUrl}/notificacao/status/${mensagemId}`
    );
    expect(reqs.length).toBe(1);

    reqs[0].flush('erro', { status: 500, statusText: 'Server Error' });
    tick(0);

    const item = service
      .notificacoes()
      .find((n) => n.mensagemId === mensagemId)!;
    expect(item.status).toBe('DESCONHECIDO');

    httpMock.verify();
    discardPeriodicTasks();
  }));

  it('não deve fazer GET quando não há pendentes', fakeAsync(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    TestBed.inject(NotificacaoService);

    tick(POLLING + 1);
    tick(0);

    const reqs = httpMock.match((r) => r.url.includes('/notificacao/status/'));
    expect(reqs.length).toBe(0);

    httpMock.verify();
    discardPeriodicTasks();
  }));
});
