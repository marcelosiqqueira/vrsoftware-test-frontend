import { Injectable, DestroyRef, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, forkJoin, interval, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NotificacaoItem,
  NotificacaoRequest,
  StatusMensagem,
} from '../../shared/models/notificacao';
import { environment } from '../../../environments/environments';

type StatusResponse = { mensagemId: string; status: StatusMensagem };

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  readonly notificacoes = signal<NotificacaoItem[]>([]);

  constructor(private http: HttpClient, destroyRef: DestroyRef) {
    interval(environment.pollingMs)
      .pipe(
        switchMap(() => {
          const pendentes = this.notificacoes()
            .filter((n) => n.status === 'AGUARDANDO_PROCESSAMENTO')
            .slice(0, 10);

          if (!pendentes.length) return of<StatusResponse[]>([]);

          return forkJoin(
            pendentes.map((p) =>
              this.http
                .get<StatusResponse>(
                  `${environment.apiBaseUrl}/notificacao/status/${p.mensagemId}`
                )
                .pipe(
                  // Se uma consulta falhar, não derruba tudo
                  catchError(() =>
                    of<StatusResponse>({
                      mensagemId: p.mensagemId,
                      status: 'DESCONHECIDO',
                    })
                  )
                )
            )
          );
        }),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe((updates) => this.atualizarStatus(updates));
  }

  async notificar(req: NotificacaoRequest): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${environment.apiBaseUrl}/notificar`, req)
    );

    this.notificacoes.update((list) => [
      {
        mensagemId: req.mensagemId,
        conteudoMensagem: req.conteudoMensagem,
        status: 'AGUARDANDO_PROCESSAMENTO',
        createdAt: Date.now(),
      },
      ...list,
    ]);
  }

  private atualizarStatus(updates: StatusResponse[]) {
    if (!updates.length) return;

    const mapa = new Map(updates.map((u) => [u.mensagemId, u.status]));
    this.notificacoes.update((list) =>
      list.map((item) =>
        mapa.has(item.mensagemId)
          ? { ...item, status: mapa.get(item.mensagemId)! }
          : item
      )
    );
  }
}
