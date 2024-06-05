import { Routes } from '@angular/router';
import { CreateQuestionnaireComponent } from './create-questionnaire/create-questionnaire.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: 'create', component: CreateQuestionnaireComponent },
    { path: 'quiz', component: QuestionnaireComponent },
    { path: '' || '**', redirectTo: '/home', pathMatch: 'full' }
];
