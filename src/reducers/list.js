import { handleActions } from 'redux-actions'

const initialState = {

	'posters': {
    items: [],
    page: 1,
    pagesize: 10
  }
}

export default handleActions({


  'cacheListData' (state, action) {

    let posters = { ...state.posters }
    posters.items = action.payload.items

    return { ...state, posters }

  },

	'appendPosters' (state, action) {

    let posters = { ...state.posters }
    posters.items = action.payload.items

		return { ...state, posters }

	},

  'updatePoster' (state, action) {

    let items = [ ...state.posters.items ].map( item => {
      if( item.id == action.payload.id){
        return { ...item, ...action.payload.item }
      } else {
        return item
      }
    })
    let posters = { ...state.posters, items }

    return { ...state, posters }

  },

	'deletePoster' (state, action) {

    let index = state.posters.items.findIndex( item => {
      return item.id == action.payload.id
    })

    let items = [...state.posters.items]
    items.splice(index, 1)

    let posters = { ...state.posters, items }

		return { ...state, posters }

	}

}, initialState)
