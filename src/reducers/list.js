import { handleActions } from 'redux-actions'

const initialState = {
	lists: [],
	filter: {
		shareTitle: '',
        title: '',
        layout: ''
	}
}

export default handleActions({
	'editTodo' (state, action){
		let list = action.payload

		return state.map( todo => {
			todo.id === list.id ? list : todo
		})
	},

	'deleteTodo' (state, action){
		let id = action.payload
		let lists = state.lists.filter( todo => 
			todo.id != id
		)
		return Object.assign( {}, state, {lists} )
	},

	'initialTodo' (state, action){
		return Object.assign({}, state, {lists: action.payload} )
	},

	'filterTodo' (state, action){
		let filter = Object.assign({}, state.filter, action.payload );

		return Object.assign({}, state, {filter})
	}

}, initialState)