import { createFeatureSelector, createSelector } from "@ngrx/store";
import { QuizState } from "./quiz.reducer";

export const selectQuizState = createFeatureSelector<QuizState>('quiz');

export const selectAllQuizzes = createSelector(
    selectQuizState, (state: QuizState) => state.quiz
)