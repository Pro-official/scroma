'use client'

import { Draft } from 'immer'

// Type for creating slices with immer support
export type SliceCreator<TStore, TSlice> = (
  set: (fn: (state: Draft<TStore>) => void) => void,
  get: () => TStore,
  api: {
    setState: (state: TStore | ((state: TStore) => TStore)) => void
    getState: () => TStore
    subscribe: (listener: (state: TStore, prevState: TStore) => void) => () => void
    getInitialState: () => TStore
  }
) => TSlice