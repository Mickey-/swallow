import React from 'react'
import { Icon } from 'antd'
import style from '../../RightSidebar/style.scss'
import listStyle from './style.scss'

export default class LinkOption extends React.Component{

    constructor(props) {

        super(props)
        this.state = {
            'show': true
        }

    }

    render () {

        let currentType = this.props.editorState.currentElement.type
        let currentIndex = this.props.editorState.currentElement.index
        let elements = this.props.pageData.elements

        let toggleIcon = !this.state.show ? <Icon type="up" /> : <Icon type="down" />
        let widgetClassNames = [style.widget]
        !this.state.show && widgetClassNames.push(style.hideWidget)

        const renderList = (type) => {

            let list = elements[type]

            return list.map((item, index) => {

                let key = type + '-' + index
                let itemClassName = ''
                if (type === currentType && index === currentIndex) {
                    itemClassName = listStyle.activeItem
                }

                return (
                    <li key={key} onMouseDown={() => this.__selectElement(type, index)} onMouseUp={() => this.__selectElement(type, index)} className={itemClassName}>
                        <Icon type="link" />
                        <span className={listStyle.linkUrl}>{item.url || '未设置链接'}</span>
                        <button onClick={() => this.__deleteElement(type, index)} className={listStyle.btnRemoveElement}><Icon type="delete"/></button>
                    </li>
                )

            })

        }

        return (
            <div className={widgetClassNames.join(' ')}>
                <h5 onClick={() => this.__toggleWidget()} className={style.widgetCaption}>元素列表<span className={style.toggleWidget}>{toggleIcon}</span></h5>
                <div className={style.widgetBody}>
                    <div>
                        <ul className={listStyle.elementList}>
                            {renderList('links')}
                        </ul>
                    </div>
                </div>
            </div>
        )

    }

    __toggleWidget() {

        this.setState({
            show: !this.state.show
        })

    }

    __selectElement(type, index) {
        this.props.actions.selectElement({ type, index })
        return false
    }

    __deleteElement(type, index) {
        this.props.actions.deleteElement({ type, index })
        return false
    }

}