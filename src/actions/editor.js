
import { createAction } from 'redux-actions'

export const updatePageData = createAction('updatePageData')
export const updateEditorState = createAction('updateEditorState')

export const updateBackground = createAction('updateBackground')
export const removeBackground = createAction('removeBackground')
export const addBackground = createAction('addBackground')

export const clearPageData = createAction('clearPageData')
export const addElement = createAction('addElement')
export const selectElement = createAction('selectElement')
export const updateElement = createAction('updateElement')
export const deleteElement = createAction('deleteElement')
export const toggleError = createAction('toggleError')
export const fillHTML = createAction('fillHTML')

export const addTempFile = createAction('addTempFile')