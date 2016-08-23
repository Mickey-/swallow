import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Icon, message } from 'antd'
import { Link } from 'react-router'
import { validatePageData, buildTemplate, formatTime } from '../../functions' 
import * as IO from '../../io'
import Previewer from '../Previewer'
import style from './style.scss'

const showError = (error) => {
    message.error(error)
}

export default class Header extends Component {

    render() {

        let pageData = this.props.pageData
        let editorState = this.props.editorState

        return (
            <header className={style.appHeader}>
                <div className={style.logo}></div>
                <div className={style.headerBtns}>
                    <button className={style.btnClear} onClick={() => this.__clear()}><Icon type="reload" /> 清空</button>
                    <button className={style.btnSave} onClick={() => this.__save()}><Icon type="save" /> 保存</button>
                    <button className={style.btnPreview} onClick={() => this.__preview()}><Icon type="eye-o" /> 预览</button>
                    <button className={style.btnPublish} onClick={() => this.__publish()}><Icon type="check" /> 发布</button>
                </div>
                <div className={style.caption}>
                    <h5>{(pageData.title ? pageData.title : '未命名项目')}</h5>
                    <h6>{pageData.lastSaveTime ? '上次保存于' + formatTime(pageData.lastSaveTime, 'hh:mm:ss') : '当前项目未保存'}</h6>
                </div>
            </header>
        )

    }

    __save() {

        let actions = this.props.actions

        let data = JSON.parse(JSON.stringify(this.props.pageData))
        let result = validatePageData(data)

        data.html = buildTemplate(data, data.layout, true)

        if (result === true) {

            let now = new Date().getTime()

            if (data.id) {

                console.log('更新海报')

                data = { ...data }

                data.elements = JSON.stringify(data.elements)
                data.background = JSON.stringify(data.background)

                IO.updatePoster(data.id, data).then((res) => {
                    console.log(res)
                    actions.updatePageData({
                        lastSaveTime: now
                    })
                })

            } else {

                console.log('保存海报')

                data = { ...data }

                data.elements = JSON.stringify(data.elements)
                data.background = JSON.stringify(data.background)

                IO.savePoster(data).then((res) => {
                    actions.updatePageData({
                        id: res.id,
                        lastSaveTime: now
                    })
                })

            }

            actions.toggleError(false)

        } else {
            showError('请完善必填字段')
            actions.toggleError(result)
        }

    }

    __publish() {

        let actions = this.props.actions

        let data = JSON.parse(JSON.stringify(this.props.pageData))
        let result = validatePageData(data)

        data.html = buildTemplate(data, data.layout, true)

        if (!data.id) {
            showError('发布前请先保存！')
            return false
        }

        if (result !== true) {
            showError('请完善必填字段')
            actions.toggleError(result)
            return false
        }

        actions.toggleError(false)

        data = { ...data }

        data.elements = JSON.stringify(data.elements)
        data.background = JSON.stringify(data.background)

        IO.publishPoster(data.id, data).then((data) => {
            console.log(data)
        }).catch((e) => {
            console.error(e)
        })

    }

    __preview() {

        let deviceTtype = this.props.pageData.layout
        let html = buildTemplate(this.props.pageData, deviceTtype)
        //this.props.actions.fillHTML(html)

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