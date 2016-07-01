import React from 'react'
import { Icon, Select } from 'antd'
import style from '../../RightSidebar/style.scss'

const Option = Select.Option

export default class LinkOption extends React.Component{

    constructor(props) {

        super(props)
        this.state = {
            'show': true
        }

    }

    render() {

        let toggleIcon = !this.state.show ? <Icon type="up" /> : <Icon type="down" />
        let pageData = this.props.pageData
        let widgetClassNames = [style.widget]
        !this.state.show && widgetClassNames.push(style.hideWidget)

        return (
            <div className={widgetClassNames.join(' ')} data-show={this.state.show}>
                <h5 className={style.widgetCaption}>页面属性<span onClick={() => this.__toggleWidget('global')} className={style.toggleWidget}>{toggleIcon}</span></h5>
                <div className={style.widgetBody}>
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
                    <label data-if-layout="mobile" className={style.opitonLabel}>分享图标</label>
                    <input data-if-layout="mobile" type="text" defaultValue={pageData.shareImage} onChange={(e) => this.__updatePageData('shareImage', e.currentTarget.value)} className={style.textOption}/>
                    <label data-if-layout="mobile" className={style.opitonLabel}>分享标题</label>
                    <input data-if-layout="mobile" type="text" defaultValue={pageData.shareTitle} onChange={(e) => this.__updatePageData('shareTitle', e.currentTarget.value)} className={style.textOption}/>
                    <label data-if-layout="mobile" className={style.opitonLabel}>分享描述</label>
                    <textarea data-if-layout="mobile" defaultValue={pageData.shareDesc} onChange={(e) => this.__updatePageData('shareDesc', e.currentTarget.value)} className={[style.textOption, style.textarea].join(' ')}></textarea>
                    <label className={style.opitonLabel}>统计代码</label>
                    <textarea defaultValue={pageData.statistics} onChange={(e) => this.__updatePageData('statistics', e.currentTarget.value)} className={[style.textOption, style.textarea].join(' ')}></textarea>
                </div>
            </div>
        )

    }

    __toggleWidget() {

        this.setState({
            show: !this.state.show
        })

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