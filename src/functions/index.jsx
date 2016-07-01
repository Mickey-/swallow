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

export const buildTemplate = (data, type = 'mobile') => {
console.log(data)
    data.parseStyle = type === 'mobile' ? parseRemStyle : parsePxStyle
    return type === 'mobile' ? MobileTpl(data) : PCTpl(data)

}