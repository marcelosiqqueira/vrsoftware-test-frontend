export interface NotificacaoRequest {
  mensagemId: string;
  conteudoMensagem: string;
}

export type StatusMensagem =
  | 'AGUARDANDO_PROCESSAMENTO'
  | 'PROCESSADO_SUCESSO'
  | 'FALHA_PROCESSAMENTO'
  | 'DESCONHECIDO';

export interface NotificacaoItem {
  mensagemId: string;
  conteudoMensagem: string;
  status: StatusMensagem;
  createdAt: number;
}
