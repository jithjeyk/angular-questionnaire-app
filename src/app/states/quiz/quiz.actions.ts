import { createAction, props } from "@ngrx/store";
import { Quiz } from "../../shared/models/quiz.interface";

export const insert = createAction('[Quiz Component] Insert', props<{quiz: Quiz}>());
export const remove = createAction('[Quiz Component] Remove', props<{id: number}>());
export const reset = createAction('[Quiz Component] Reset');