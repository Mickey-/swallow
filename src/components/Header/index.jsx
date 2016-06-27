import React, { Component } from 'react'
import { Icon } from 'antd'
import { Link } from 'react-router'
import style from './style.scss'

export default class Header extends Component {

    render() {

        let pageData = this.props.pageData
        let editorState = this.props.editorState

        return (
            <header className={style.appHeader}>
                <img className={style.logo} src="./assets/swallow.png"/>
                <div className={style.headerBtns}>
                    <button className={style.btnClear} onClick={() => this.__clear()}><Icon type="reload" /> 清空</button>
                    <button className={style.btnSave}><Icon type="save" /> 保存</button>
                    <button className={style.btnPreview}><Icon type="eye-o" /> 预览</button>
                    <button className={style.btnPublish}><Icon type="check" /> 发布</button>
                </div>
                <div className={style.caption}>
                    <h5>{(pageData.title ? pageData.title : '未命名项目') + (editorState.unsave ? '*' : '')}</h5>
                    <h6>{pageData.lastSaveTime ? '上次保存于16:23:43' : '当前项目未保存'}</h6>
                </div>
            </header>
        )

    }

    __clear() {

        if (confirm('确认清空画布么?')) {
            this.props.actions.clearPageData()
        }

    }

}