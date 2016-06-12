import { handleActions } from 'redux-actions'

const initialState = {
    'layout': 'mobile',
    'title': '',
    'slug': '',
    'backgroundImageName': '',
    'backgroundImageData': '',
    'backgroundColor': '#fff',
    'wxImage': '',
    'wxTitle': '',
    'wxDesc': '',
    'baiduStatistics': '',
    'elements': {
        'links': []
    },
    'lastSaveTime': '',
    'unsave': false,
    'html': ''
}

export default handleActions({

    'updatePageData' (state, action) {
        action.payload.unsave = true
        return Object.assign({}, state, action.payload)
    },

    'clearPageData' (state) {
        return initialState
    }

}, initialState)