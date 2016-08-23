import MobileTpl from '../templates/mobile.tpl'
import PCTpl from '../templates/pc.tpl'

const px2rem = (px) => {
    return px * 2 / 46.875 + 'rem'
}

const parsePxStyle = (style) => {
    return [
        'width:' + style.width + 'px;',
        'height:' + style.height + 'px;',
        'top:' + style.top + 'px;',
        'margin-left:' + (style.left - 960) + 'px;'
    ].join('')
}

const parseRemStyle = (style) => {
    return [
        'width:' + px2rem(style.width) + ';',
        'height:' + px2rem(style.height) + ';',
        'top:' + px2rem(style.top) + ';',
        'left:' + px2rem(style.left) + ';'
    ].join('')
}

const parseAppInnerLink = (href) => {

    let appInnerLinks = ['优惠券页面', '订单列表页面', '信用钱包页面', '花不完页面']

    if (appInnerLinks.indexOf(href) !== -1) {
        return 'javascript:void(0);" data-app-link="' + href
    } else {
        return href
    }

}

const getBackgroundImageTop = (images, index) => {

    var top = 0
    var temp = images.slice(0, index)
    temp.forEach((item) => {
        top += item.height
    })

    return top

}

const getBackgroundImageUrl = (image, release) => {

    if (release) {
        return image.data || image.releaseUrl
    } else {
        return image.data || image.url
    }

}

export const validatePageData = (data) => {

        let errors = {
            title: false,
            pathname: false
        }

        let has_error = false

        if (data.title === null || data.title.trim().length === 0) {
            has_error = true
            errors.title =  '页面标题不能为空'
        }

        if (data.pathname === null || data.pathname.trim().length === 0) {
            has_error = true
            errors.pathname = '访问路径不能为空'
        }

        return has_error ? errors : true

}

export const JSON2URL = (json) => {

    var return_url = ''

    for (var item in json) {
        if (json.hasOwnProperty(item)) {
            return_url += ('&' + item + '=' + json[item])
        }
    }

    return return_url

}

export const findIndexById = (array, id) => {

    return array.findIndex((item) => {
        return item.id === id
    })

}

export const guid = () => {

    window.__SWALLOW_GUID__ = window.__SWALLOW_GUID__ || 0
    window.__SWALLOW_GUID__ += 1
    return window.__SWALLOW_GUID__

}

/**
 * 时间格式化
 */
export const formatTime = (timestamp, fmt = 'yyyy-MM-dd hh:mm:ss', ms = true) => {

    let data = new Date()
    data.setTime(ms ? timestamp : timestamp * 1000)

    var o = {
      "M+" : data.getMonth() + 1,
      "d+" : data.getDate(),
      "h+" : data.getHours(),
      "m+" : data.getMinutes(),
      "s+" : data.getSeconds(),
      "q+" : Math.floor((data.getMonth() + 3) / 3),
      "S" : data.getMilliseconds()
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
      }
    }

    return fmt;

}

export const buildTemplate = (data, type = 'mobile', release = false) => {

    if (type === 'mobile') {

        data.parseStyle = parseRemStyle
        data.parseAppInnerLink = parseAppInnerLink
        data.release = release
        data.getBackgroundImageUrl = getBackgroundImageUrl

        return MobileTpl(data)

    } else {

        data.parseStyle = parsePxStyle
        data.getTop = getBackgroundImageTop
        data.release = release
        data.getBackgroundImageUrl = getBackgroundImageUrl
        return PCTpl(data)

    }

}