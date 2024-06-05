import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './states/app.state';
import { selectCount } from './states/counter/counter.selector';
import { Quiz } from './shared/models/quiz.interface';
import { selectAllQuizzes } from './states/quiz/quiz.selector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-questionnaire-app';
  count$: Observable<number>;
  quizzes$: Observable<Quiz[]>;

  constructor(private store: Store<AppState>) {
    this.count$ = this.store.select(selectCount);
    this.quizzes$ = this.store.select(selectAllQuizzes);
  }
}
