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

export const JSON2URL = (json) => {

    var return_url = ''

    for (var item in json) {
        if (json.hasOwnProperty(item)) {
            return_url += ('&' + item + '=' + json[item])
        }
    }

    return return_url

}

export const buildTemplate = (data, type = 'mobile') => {

    if (type === 'mobile') {

        data.parseStyle = parseRemStyle
        data.parseAppInnerLink = parseAppInnerLink

        return MobileTpl(data)

    } else {

        data.parseStyle = parsePxStyle
        data.getTop = getBackgroundImageTop
        return PCTpl(data)

    }

}