import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacaoComponent } from './features/notificacao/notificacao';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificacaoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('vrsoftware-test-frontend');
}
