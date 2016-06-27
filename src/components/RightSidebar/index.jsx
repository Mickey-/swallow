import React from 'react'
import { Icon, Select } from 'antd'
import classNames from 'classnames'
import style from './style.scss'

const Option = Select.Option

export default class RightSidebar extends React.Component{

    constructor(props) {

        super(props)

        this.state = {
            showGlobalOptions: true,
            showElementOptions: true,
            pageBackgroundImage: null
        }

    }

    render() {

        let pageData = this.props.pageData
        let editorState = this.props.editorState
        let globalOptionsIcon = this.state.showGlobalOptions ? <Icon type="up" /> : <Icon type="down" />

        return (
            <div className={style.rightSidebar}>
                <div className={style.optionGroup}>
                    <h5 className={style.optionCaption}>页面属性<span onClick={() => this.__toggleOptionsGroup('global')} className={style.toggleGroup}>{globalOptionsIcon}</span></h5>
                    <div className={style.optionBody} style={{
                        display: this.state.showGlobalOptions ? 'block' : 'none'
                    }}>
                        <label className={style.opitonLabel}>页面类型</label>
                        <Select className={style.selectOption} size="large" onChange={(value) => this.__updatePageData('layout', value)} defaultValue="mobile" value={pageData.layout}>
                            <Option key="0" value="mobile"><Icon type="mobile" /> 移动端</Option>
                            <Option key="1" value="pc"><Icon type="laptop" /> 桌面端</Option>
                        </Select>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}><span className={style.bgRed}>*</span>页面标题</label>
                        <input type="text" onChange={(e) => this.__updatePageData('title', e.currentTarget.value)} defaultValue={pageData.title} className={style.textOption}/>
                        <label className={style.opitonLabel}><span className={style.bgRed}>*</span>访问路径(英文和数字的组合)</label>
                        <input type="text" onChange={(e) => this.__updatePageData('pathname', e.currentTarget.value)} defaultValue={pageData.pathname} className={style.textOption}/>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>背景图片</label>
                        <div className={style.fileOptionWrap}>
                            <button onClick={() => this.__clearBackgroundImage()} className={style.clearFile}><Icon type="delete" /></button>
                            <input onChange={(e) => this.__convertImage(e)} type="file"/>
                            <span className={style.selectedFileName}><Icon type="picture" /> {pageData.backgroundImageName || '选择图片'}</span>
                        </div>
                        <label className={style.opitonLabel}>背景颜色</label>
                        <input type="text" value={pageData.backgroundColor} onChange={(e) => this.__updatePageData('backgroundColor', e.currentTarget.value)} style={{fontWeight: 'bold'}} className={style.textOption}/>
                        <input type="color" value={pageData.backgroundColor} onChange={(e) => this.__updatePageData('backgroundColor', e.currentTarget.value)} className={style.textOption}/>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>分享图标</label>
                        <input type="text" defaultValue={pageData.wxImage} onChange={(e) => this.__updatePageData('wxImage', e.currentTarget.value)} className={style.textOption}/>
                        <label className={style.opitonLabel}>分享标题</label>
                        <input type="text" defaultValue={pageData.wxTitle} onChange={(e) => this.__updatePageData('wxTitle', e.currentTarget.value)} className={style.textOption}/>
                        <label className={style.opitonLabel}>分享描述</label>
                        <textarea defaultValue={pageData.wxDesc} onChange={(e) => this.__updatePageData('wxDesc', e.currentTarget.value)} className={classNames(style.textOption, style.textarea)}></textarea>
                        <label className={style.opitonLabel}>统计代码</label>
                        <textarea defaultValue={pageData.baiduStatistics} onChange={(e) => this.__updatePageData('baiduStatistics', e.currentTarget.value)} className={classNames(style.textOption, style.textarea)}></textarea>
                    </div>
                </div>
                {this.__createElementOptionsGroup()}
            </div>
        )

    }

    __createElementOptionsGroup() {

        let { type, index } = this.props.editorState.currentElement

        if (type === null || index === null) {
            return null
        }

        let elementCaptions = {
            'links': '超链接'
        }
        let element = this.props.pageData.elements[type][index]
        let elementOptionsIcon = this.state.showElementOptions ? <Icon type="up" /> : <Icon type="down" />
        let elementHTML

        const hxlinks = ['优惠券页面', '订单列表页面', '信用钱包页面', '花不完页面']
        const getHXLink= (link) => {

            if (hxlinks.some((item) => {
                return item === link
            })) {
                return link
            } else {
                return 'null'
            }

        }

        const updateElementData = (name, value) => {

            let data = {}; data[name] = value
            this.props.actions.updateElement({ 'element_type': type, index, data})

        }

        if (type === 'links') {

            elementHTML = (
                <div>
                    <label className={style.opitonLabel}>链接地址</label>
                    <input type="text" onChange={(e) => updateElementData('url', e.currentTarget.value)} defalutValue="" value={element.url !== 'null' ? element.url : ''} className={style.textOption}/>
                    <label className={style.opitonLabel}>链接到APP页面</label>
                    <Select className={style.selectOption} size="large" onChange={(value) => updateElementData('url', value)} defaultValue="null" value={getHXLink(element.url)}>
                        <Option key="0" value="null">无</Option>
                        {hxlinks.map((item) => {
                            return (
                                <Option key={index + 1} value={item}>{item}</Option>
                            )
                        })}
                    </Select>
                    <div className={style.groupLine}></div>
                    <label className={style.opitonLabel}>打开方式</label>
                    <Select className={style.selectOption} size="large" onChange={(value) => updateElementData('target', value)} defaultValue="_self" value={element.target}>
                        <Option key="0" value="_self">当前窗口</Option>
                        <Option key="1" value="_blank">新建窗口</Option>
                    </Select>
                </div>
            )
        }

        return (
            <div className={style.optionGroup}>
                <h5 className={style.optionCaption}>{elementCaptions[type]}<span onClick={() => this.__toggleOptionsGroup('element')} className={style.toggleGroup}>{elementOptionsIcon}</span></h5>
                <div className={style.optionBody} style={{
                    display: this.state.showElementOptions ? 'block' : 'none'
                }}>
                    {elementHTML}
                </div>
            </div>
        )

    }

    __toggleOptionsGroup(type) {

        switch (type){
            case 'global':
                this.setState({
                    showGlobalOptions: !this.state.showGlobalOptions
                })
            break
            case 'element':
                this.setState({
                    showElementOptions: !this.state.showElementOptions
                })
            break
        }

    }

    __updatePageData(name, value) {

        var tempData = {}
        tempData[name] = value
        this.props.actions.updatePageData(tempData)

    }

    __clearBackgroundImage() {

        this.__updatePageData('backgroundImageData', '')
        this.__updatePageData('backgroundImageName', '')

    }

    __convertImage(e) {

        var file = e.currentTarget.files[0];
        var imageType = /image.*/;

        if (file && file.type.match(imageType)) {
            var reader = new FileReader();
            reader.onload = (e) => {
                this.__updatePageData('backgroundImageData', reader.result)
            }
            this.__updatePageData('backgroundImageName', '[' + Math.round(file.size/1024) + 'KB]' + file.name)
            reader.readAsDataURL(file); 

        } else {
            console.log('文件格式不支持')
        }

    }

}