import {createReducer, on} from '@ngrx/store'
import { decrement, increment, counterReset } from './counter.actions'

export interface CounterState {
  count: number
}

export const initialCounterState: CounterState = {
  count: 1
}

export const counterReducer = createReducer(
  initialCounterState,
  on(increment, state=> ({...state, count: state.count + 1})),
  on(decrement, state => ({ ...state, count: state.count - 1 })),
  on(counterReset, state => ({ ...state, count: 1 }))
)
