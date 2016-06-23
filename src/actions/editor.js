
import { createAction } from 'redux-actions'

export const updatePageData = createAction('updatePageData')
export const updateEditorState = createAction('updateEditorState')
export const clearPageData = createAction('clearPageData')
export const addElement = createAction('addElement')
export const updateElement = createAction('updateElement')
export const removeElement = createAction('removeElement')