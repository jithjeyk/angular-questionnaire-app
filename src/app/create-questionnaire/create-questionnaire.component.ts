import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
// import { QuestionnaireStateService } from '../questionnaire-state.service';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { CounterComponent } from '../counter/counter.component';
import { increment, decrement, counterReset } from '../states/counter/counter.actions';
import { AppState } from '../states/app.state';
import { insert, remove, reset } from '../states/quiz/quiz.actions';
import { selectCount } from '../states/counter/counter.selector';
import { Quiz } from '../shared/models/quiz.interface';
import { selectAllQuizzes } from '../states/quiz/quiz.selector';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-questionnaire',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, FormsModule, ReactiveFormsModule, CounterComponent],
  templateUrl: './create-questionnaire.component.html',
  styleUrl: './create-questionnaire.component.scss'
})
export class CreateQuestionnaireComponent implements OnInit {
  questionnaireForm: FormGroup = this.fb.group({}); // Initialize the form group directly;
  questionnaireCount: number = 0;
  questionnaireId: number = 0;
  count$: Observable<number>;
  quizzes$: Observable<Quiz[]>;
  minimumQuestionCount: number = 10;

  // Define the hardcoded quiz array
  // hardcodedQuizzes: Quiz[] = [
  //   { id: 1, question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 2 },
  //   { id: 2, question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
  //   { id: 3, question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: 3 },
  //   { id: 4, question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Jane Austen", "J.K. Rowling"], answer: 0 },
  //   { id: 5, question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: 2 },
  //   { id: 6, question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Osmium", "Oganesson", "Oxide"], answer: 0 },
  //   { id: 7, question: "What is the largest continent by area?", options: ["Africa", "Asia", "Europe", "North America"], answer: 1 },
  //   { id: 8, question: "In what year did the Titanic sink?", options: ["1912", "1913", "1914", "1915"], answer: 0 },
  //   { id: 9, question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"], answer: 1 },
  //   { id: 10, question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: 2 }
  // ];

  constructor(private fb: FormBuilder, private store: Store<AppState>, private router: Router) {
    this.count$ = this.store.select(selectCount);
    this.quizzes$ = this.store.select(selectAllQuizzes);
  }

  ngOnInit(): void {
    this.questionnaireForm = this.fb.group({
      questions: this.fb.array([this.createQuestion()])
    });
    this.count$.subscribe(count => this.questionnaireCount = count);

    // Dispatch the hardcoded quizzes to the store
    // this.hardcodedQuizzes.forEach(quiz => {
    //   this.store.dispatch(insert({ quiz }));
    //   this.store.dispatch(increment());
    // });
  }
  createQuestion(): FormGroup {
    return this.fb.group({
      id: null,
      question: ['', Validators.required],
      options: this.fb.array([
        this.createOption(),
        this.createOption(),
        this.createOption(),
        this.createOption()
      ]),
      answer: [null, Validators.required]
    });
  }

  createOption(): FormGroup {
    return this.fb.group({
      optionText: ['', Validators.required]
    });
  }

  get questions(): FormArray {
    return this.questionnaireForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    if (this.questionnaireForm.valid) {
      this.questionnaireId += 1;
      const questionsArray = this.questionnaireForm.get('questions') as FormArray;
      const questionnaire = questionsArray.at(0) as FormGroup;
      questionnaire.patchValue({ id: this.questionnaireId });
      const formValue: Quiz = {
        id: questionnaire.value.id,
        question: questionnaire.value.question,
        options: questionnaire.value.options.map((option: { optionText: string }) => option.optionText),
        answer: questionnaire.value.answer
      }
      this.store.dispatch(increment());
      this.store.dispatch(insert({ quiz: formValue }));
      this.questionnaireForm.reset();

    }
    else { alert('All Fiedls are mandatory!'); }
  }

  removeQuestion(id: number): void {
    this.store.dispatch(decrement());
    this.store.dispatch(remove({ id }));
  }

  getOptionControls(question: AbstractControl): FormArray {
    return question.get('options') as FormArray;
  }

  onSubmit(): void {
    this.router.navigate(['/quiz']);
  }

  resetQuestionnaire(): void {
    this.store.dispatch(counterReset());
    this.store.dispatch(reset());
    this.questionnaireCount = 1;
    this.questionnaireId = 0;
  }

}
