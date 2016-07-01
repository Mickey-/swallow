import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Icon } from 'antd'
import { Link } from 'react-router'
import Previewer from '../Previewer'
import { buildTemplate } from '../../functions' 
import style from './style.scss'

export default class Header extends Component {

    render() {

        let pageData = this.props.pageData
        let editorState = this.props.editorState

        return (
            <header className={style.appHeader}>
                <div className={style.logo}></div>
                <div className={style.headerBtns}>
                    <button className={style.btnClear} onClick={() => this.__clear()}><Icon type="reload" /> 清空</button>
                    <button className={style.btnSave}><Icon type="save" /> 保存</button>
                    <button className={style.btnPreview} onClick={() => this.__preview()}><Icon type="eye-o" /> 预览</button>
                    <button className={style.btnPublish}><Icon type="check" /> 发布</button>
                </div>
                <div className={style.caption}>
                    <h5>{(pageData.title ? pageData.title : '未命名项目') + (editorState.unsave ? '*' : '')}</h5>
                    <h6>{pageData.lastSaveTime ? '上次保存于16:23:43' : '当前项目未保存'}</h6>
                </div>
            </header>
        )

    }

    __preview() {

        let deviceTtype = this.props.pageData.layout
        let html = buildTemplate(this.props.pageData, deviceTtype)
        this.props.actions.fillHTML(html)

        if (deviceTtype === 'mobile') {
            ReactDOM.render(<Previewer html={html}/>, document.getElementById('mobilePreview'))
        } else {

            if (!window.__previewWindow__ || window.__previewWindow__.closed) {
                window.__previewWindow__ = window.open()
            }

            window.__previewWindow__.focus()
            window.__previewWindow__.document.write(html)

        }

    }

    __clear() {

        if (confirm('确认清空画布么?')) {
            this.props.actions.clearPageData()
        }

    }

}