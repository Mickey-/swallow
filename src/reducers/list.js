import { handleActions } from 'redux-actions'

const initialState = {
	posters: [],
	page: 1
}

export default handleActions({

	'appendPosters' (state, action) {

		return [ ...state.posters, action.payload ]

	},

	'deletePoster' (state, action) {

		return [ ...state.posters ].splice(action.payload.index)

	}

}, initialState)