import React from 'react'
import { Icon, Select } from 'antd'
import style from '../../RightSidebar/style.scss'

const Option = Select.Option

export default class LinkOption extends React.Component{

    constructor(props) {

        super(props)
        this.state = {
            'type': null,
            'index': null,
            'show': true
        }

    }

    componentWillReceiveProps() {

        let { type, index } = this.props.editorState.currentElement
        this.setState({ type, index })

    }

    render () {

        let { type, index, show } = this.state

        if (type !== 'links' || type === null || index === null) {
            return null
        }

        let element = this.props.pageData.elements[type][index]

        if (typeof element === 'undefined') {
            return null
        }

        let toggleIcon = !show ? <Icon type="up" /> : <Icon type="down" />
        let widgetClassNames = [style.widget]
        !this.state.show && widgetClassNames.push(style.hideWidget)

        let appInnerLinks = ['优惠券页面', '订单列表页面', '信用钱包页面', '花不完页面']
        const getAPPInnerLink = (link) => {

            if (appInnerLinks.some((item) => {
                return item === link
            })) {
                return link
            } else {
                return 'null'
            }

        }

        let appInnerLinksSelector = null
        if (this.props.pageData.layout === 'mobile') {
            appInnerLinksSelector = (
                <Select className={style.selectOption} size="large" onChange={(value) => this.__updateElementData('url', value)} defaultValue="null" value={getAPPInnerLink(element.url)}>
                    <Option key="0" value="null">无</Option>
                    {appInnerLinks.map((item) => {
                        return (
                            <Option key={index + 1} value={item}>{item}</Option>
                        )
                    })}
                </Select>
            )
        }

        return (
            <div className={widgetClassNames.join(' ')}>
                <h5 className={style.widgetCaption}>链接属性<span onClick={() => this.__toggleWidget('element')} className={style.toggleWidget}>{toggleIcon}</span></h5>
                <div className={style.widgetBody}>
                    <div>
                        <label className={style.opitonLabel}>链接地址</label>
                        <input type="text" onChange={(e) => this.__updateElementData('url', e.currentTarget.value)} defalutValue="" value={element.url !== 'null' ? element.url : ''} className={style.textOption}/>
                        <label data-if-layout="mobile" className={style.opitonLabel}>链接到APP页面</label>
                        {appInnerLinksSelector}
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>打开方式</label>
                        <Select className={style.selectOption} size="large" onChange={(value) => this.__updateElementData('target', value)} defaultValue="_self" value={element.target}>
                            <Option key="0" value="_self">当前窗口</Option>
                            <Option key="1" value="_blank">新建窗口</Option>
                        </Select>
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

    __updateElementData (name, value) {

        let data = {}; data[name] = value
        this.props.actions.updateElement({ 'element_type': this.state.type, index: this.state.index, data})

    }

}