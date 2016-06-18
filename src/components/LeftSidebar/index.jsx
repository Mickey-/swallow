import React from 'react'
import { Icon } from 'antd'
import style from './style.scss'

export default class LeftSidebar extends React.Component{

    render() {

        return (
            <div className={style.leftSidebar}>
                <button onClick={() => this.__addLinkElement()} className={style.toolButton}><Icon type="link" /></button>
            </div>
        )

    }

    __addLinkElement() {
        this.props.actions.addElement({
            element_type: 'links',
            element: {
                'left': 0, //left位置 int
                'top': 0, //top位置 int
                'width': 30, //宽度 int
                'height': 30, //高度 int
                'target': '_self', //打开方式 varchar
                'protocol': 'http', //协议 varchar
                'url': '' //地址 varchar
            }
        })
    }

}