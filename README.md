# 💻 Notification Service - Frontend

Aplicação **Angular 20** para envio e acompanhamento do status de notificações processadas pelo backend.  
Comunica-se via API com o serviço NestJS e atualiza os status usando polling.

---

## 🚀 Tecnologias

- Angular 20 (Standalone Components)
- TypeScript
- Karma + Jasmine (testes unitários)
- HttpClient (Angular)

---

## ⚙️ Configuração

### Pré-requisitos

- Node.js 22+
- Backend rodando em `http://localhost:3000`

---

## ▶️ Execução

```bash
npm install
npm start
```

Aplicação disponível em: http://localhost:4200

## 📡 Funcionalidades

- Formulário para envio de notificações (POST /api/notificar)

- Exibição em lista com status atualizado por polling (GET /api/notificacao/status/:id)

- Interface responsiva e otimizada para experiência do usuário

## 🖼️ Interface

- Campo de texto para digitar a mensagem

- Botão de envio

- Lista de notificações com ícones e cores indicando o status

- Layout centralizado e estilizado seguindo a identidade visual definida

## 🧪 Testes

```
ng test
```

Cobrem:

- Geração de mensagemId

- Envio de requisição POST

- Adição inicial na lista com status AGUARDANDO_PROCESSAMENTO

- Atualização de status simulada (polling)
