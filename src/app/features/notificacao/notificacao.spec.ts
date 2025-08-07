import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { NotificacaoComponent } from './notificacao';
import { environment } from '../../../environments/environments';

describe('NotificacaoComponent', () => {
  let fixture: any;
  let component: NotificacaoComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacaoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (httpMock) httpMock.verify();
  });

  it('deve gerar mensagemId e enviar POST, adicionando AGUARDANDO_PROCESSAMENTO', fakeAsync(() => {
    spyOn(globalThis.crypto, 'randomUUID').and.returnValue(
      '00000000-0000-4000-8000-000000000000'
    );

    component.conteudo.set('Minha mensagem de teste');
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/notificar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      mensagemId: '00000000-0000-4000-8000-000000000000',
      conteudoMensagem: 'Minha mensagem de teste',
    });

    req.flush(null);

    flushMicrotasks();
    fixture.detectChanges();

    const lista = component.notificacoes();
    expect(lista.length).toBeGreaterThan(0);
    expect(lista[0].mensagemId).toBe('00000000-0000-4000-8000-000000000000');
    expect(lista[0].conteudoMensagem).toBe('Minha mensagem de teste');
    expect(lista[0].status).toBe('AGUARDANDO_PROCESSAMENTO');
  }));
});
