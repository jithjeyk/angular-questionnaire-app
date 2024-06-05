import { createReducer, on } from "@ngrx/store";
import { insert, remove, reset } from "./quiz.actions";
import { Quiz } from "../../shared/models/quiz.interface";
  
export interface QuizState {
    quiz: Quiz[];
}

export const initialQuizState: QuizState = {
    quiz: []
}

export const quizReducer = createReducer(
    initialQuizState,
    on(insert, (state, { quiz }) => {
        return ({ ...state, quiz: [...state.quiz, quiz] })
    })
    ,
    on(remove, (state, { id }) => {
        return ({ ...state, quiz: state.quiz.filter(quiz => quiz.id !== id) })
    }),
    on(reset, state => ({ ...state, quiz: [] }))
)