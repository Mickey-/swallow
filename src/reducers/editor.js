import { handleActions } from 'redux-actions'

const initialState = {
    'attr': {
        'layout': 'mobile', //页面布局类型 varchar
        'title': '', //页面标题 varchar
        'pathname': '', //页面路径名 varchar
        'backgroundImageName': '', //背景图名称 varchar
        'backgroundImageData': '', //背景图base64数据 long text
        'backgroundColor': '#ff6600', //背景颜色 varchar
        'wxImage': '', //微信分享图标地址 varchar
        'wxTitle': '', //微信分享标题 varchar
        'wxDesc': '', //微信分享描述 varchar
        'baiduStatistics': '', //百度统计代码 text
        'elements': { // 页面元素
            'links': []
        },
        'lastSaveTime': 0, //上次保存时间 （秒级时间戳）int
        'unsave': false,
    },
    'html': ''//渲染出来的HTML代码 long text
}

export default handleActions({

    'updatePageData' (state, action) {
        action.payload.unsave = true
        let attr = Object.assign({}, state.attr, action.payload)
        return Object.assign({}, state, { attr })
    },
    'addElement' (state, action) {
        let attr = Object.assign({}, state.attr)
        if (action.payload.element_type in attr.elements && attr.elements[action.payload.element_type].push) {
            attr.elements[action.payload.element_type].push(action.payload.element)
            attr.unsave = true
        }
        return Object.assign({}, state, { attr })
    },
    'clearPageData' (state) {
        return initialState
    }

}, initialState)