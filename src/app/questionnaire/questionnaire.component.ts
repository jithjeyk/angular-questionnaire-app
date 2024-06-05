import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Quiz } from '../shared/models/quiz.interface';
import { selectAllQuizzes } from '../states/quiz/quiz.selector';
import { Store } from '@ngrx/store';
import { AppState } from '../states/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, ReactiveFormsModule],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit {
  questionnaireForm: FormGroup;
  score: number = 0;
  submitted: boolean = false;
  validationMessage: string = '';
  quizzes$: Observable<Quiz[]>;
  quizArray: Quiz[] = [];
  passMark: number = 60;
  currentQuestionIndex: number = 0;
  answersArray: number[] = [];

  constructor(private fb: FormBuilder, private store: Store<AppState>, private router: Router) {
    this.quizzes$ = this.store.select(selectAllQuizzes);
    this.questionnaireForm = this.fb.group({
      answers: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    try {
      this.quizzes$.subscribe(quizzes => {
        if (quizzes) {
          this.quizArray = quizzes;
          this.initializeForm(quizzes);
        }
      });
    } catch (e) {
      console.log('error', e)
    }
  }

  initializeForm(quizzes: Quiz[]): void {
    const answersArray = this.fb.array([]);
    quizzes.forEach(() => {
      answersArray.push(this.fb.control(''));
    });
    this.questionnaireForm.setControl('answers', answersArray);
  }

  nextQuestion() {
    const currentAnswer = this.questionnaireForm.controls['answers'].value[this.currentQuestionIndex];
    // this.answersArray.push(currentAnswer);
    console.log('answer-array', this.questionnaireForm.controls['answers'].value[this.currentQuestionIndex]);
    console.log('currentIndex', this.currentQuestionIndex);
    
    if (currentAnswer !== '') {
      if (this.currentQuestionIndex < this.quizArray.length - 1) {
        this.questionnaireForm.reset();
        this.currentQuestionIndex++;
      }
      console.log('after-increment', this.currentQuestionIndex);
      console.log('answersArray', this.answersArray);
      
    } else {
      alert('Please select one answer!');
    }

  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  getTotalScore(): number {
    return this.quizArray.length * 10;
  }

  onSubmit(): void {
    const answers = this.questionnaireForm.value.answers;
    if (this.validateAnswers(answers)) {
      this.submitted = true;
      this.calculateScore(answers);
      const totalScore = this.getTotalScore();
      if (this.score >= this.passMark) {
        this.validationMessage = `Congratulations! You passed with a score of ${this.score} out of ${totalScore}.`;
      } else {
        this.validationMessage = `You scored ${this.score} out of ${totalScore}. Please retake the assessment.`;
      }
    } else {
      alert('Please answer all questions!');
      // this.validationMessage = 'Please answer all questions!';
    }
  }

  validateAnswers(answers: string[]): boolean {
    return answers.every(answer => answer !== '');
  }

  calculateScore(answers: string[]): void {
    this.score = this.quizArray.reduce((total, quiz, index) => {
      return total + (quiz.answer === +answers[index] ? 10 : 0);
    }, 0);
  }

  createNewQuestionnaire(): void {
    this.retakeAssessment();
    this.router.navigate(['/create']);
  }

  retakeAssessment(): void {
    this.initializeForm(this.quizArray);
    this.currentQuestionIndex = 0;
    this.questionnaireForm.reset();
    this.submitted = false;
    this.validationMessage = '';
    this.score = 0;
  }

}
