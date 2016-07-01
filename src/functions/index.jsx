import MobileTpl from '../templates/mobile.tpl'
import PCTpl from '../templates/pc.tpl'

export const px2rem = (px) => {
    return px * 2 / 46.875 + 'rem'
}

export const parsePxStyle = (style) => {
    return [
        'width:' + style.width + 'px;',
        'height:' + style.height + 'px;',
        'top:' + style.top + 'px;',
        'margin-left:' + (style.left - 960) + 'px;'
    ].join('')
}

export const parseRemStyle = (style) => {
    return [
        'width:' + px2rem(style.width) + ';',
        'height:' + px2rem(style.height) + ';',
        'top:' + px2rem(style.top) + ';',
        'left:' + px2rem(style.left) + ';'
    ].join('')
}

export const parseAppInnerLink = (href) => {

    let appInnerLinks = ['优惠券页面', '订单列表页面', '信用钱包页面', '花不完页面']

    if (appInnerLinks.indexOf(href) !== -1) {
        return 'javascript:void(0);" data-app-link="' + href
    } else {
        return href
    }

}

export const buildTemplate = (data, type = 'mobile') => {

    if (type === 'mobile') {

        data.parseStyle = parseRemStyle
        data.parseAppInnerLink = parseAppInnerLink

        return MobileTpl(data)

    } else {

        data.parseStyle = parsePxStyle
        return PCTpl(data)

    }

}