import { handleActions } from 'redux-actions'

const initialState = {
    'pageData': {
        'layout': 'mobile', //页面布局类型 varchar
        'title': '', //页面标题 varchar
        'pathname': '', //页面路径名 varchar
        'backgroundImageName': '', //背景图名称 varchar
        'backgroundImageData': '', //背景图base64数据 long text
        'backgroundColor': '#ffffff', //背景颜色 varchar
        'shareImage': '', //微信分享图标地址 varchar
        'shareTitle': '', //微信分享标题 varchar
        'shareDesc': '', //微信分享描述 varchar
        'statistics': '', //百度统计代码 text
        'elements': { // 页面元素
            'links': []
        }
    },
    'editorState' : {
        'lastSaveTime': 0, //上次保存时间 （秒级时间戳）int
        'unsave': false,
        'currentTool': null,
        'currentElement': {
            'type': null,
            'index': null
        }
    },
    'html': ''//渲染出来的HTML代码 long text
}

export default handleActions({

    'updatePageData' (state, action) {

        let editorState = Object.assign({}, state.editorState, {unsave: true})
        let pageData = Object.assign({}, state.pageData, action.payload)

        return Object.assign({}, state, { pageData }, {editorState})

    },

    'updateEditorState' (state, action) {

        let editorState = Object.assign({}, state.editorState, action.payload)
        return Object.assign({}, state, { editorState })

    },

    'addElement' (state, action) {

        let pageData = Object.assign({}, state.pageData)
        let allElements = Object.assign({}, pageData.elements)
        let elements = [ ...allElements[action.payload.element_type] ]

        elements.push(action.payload.element)
        allElements[action.payload.element_type] = elements
        pageData.elements = allElements

        return Object.assign({}, state, { pageData })

    },

    'selectElement' (state, action) {

        let editorState = Object.assign({}, state.editorState)
        editorState.currentElement = action.payload

        return Object.assign({}, state, { editorState })

    },

    'updateElement' (state, action) {

        let pageData = Object.assign({}, state.pageData)
        let element = pageData.elements[action.payload.element_type][action.payload.index]
        let new_element = Object.assign({}, element, action.payload.data)
        pageData.elements[action.payload.element_type][action.payload.index] = new_element

        return Object.assign({}, state, { pageData })

    },

    'deleteElement' (state, action) {

        let { type, index } = action.payload

        if (type && index !== null) {

            let pageData = Object.assign({}, state.pageData)
            let editorState = Object.assign({}, state.editorState)
            let elements = pageData.elements[type]

            elements && elements.splice(index, 1)
            pageData.elements[type] = elements

            if (editorState.currentElement.type === type && editorState.currentElement.index === index) {
                editorState.currentElement = {
                    type: null,
                    index: null
                }
            }

            return Object.assign({}, state, { pageData, editorState })

        }

    },

    'clearPageData' (state) {

        let pageData = Object.assign({}, initialState.pageData)
        pageData.layout = state.pageData.layout

        return Object.assign({}, initialState, { pageData })

    }

}, initialState)