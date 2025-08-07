import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificacaoService } from './notificacao.service';

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notificacao.html',
  styleUrls: ['./notificacao.scss'],
})
export class NotificacaoComponent {
  private readonly notificacaoService = inject(NotificacaoService);

  readonly conteudo = signal('');
  readonly loading = signal(false);
  readonly notificacoes = this.notificacaoService.notificacoes;

  async onSubmit(e: Event) {
    e.preventDefault();
    const texto = this.conteudo().trim();
    if (!texto || this.loading()) return;

    this.loading.set(true);
    const mensagemId = this.gerarUUID();

    try {
      await this.notificacaoService.notificar({
        mensagemId,
        conteudoMensagem: texto,
      });
      this.conteudo.set('');
    } finally {
      this.loading.set(false);
    }
  }

  labelDeStatus(status: string): string {
    switch (status) {
      case 'PROCESSADO_SUCESSO':
        return 'Processado com sucesso';
      case 'FALHA_PROCESSAMENTO':
        return 'Falha no processamento';
      default:
        return 'Aguardando processamento';
    }
  }

  iconeDeStatus(status: string): string {
    switch (status) {
      case 'PROCESSADO_SUCESSO':
        return '✅';
      case 'FALHA_PROCESSAMENTO':
        return '❌';
      default:
        return '⏳';
    }
  }

  private gerarUUID(): string {
    return globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
  }
}
