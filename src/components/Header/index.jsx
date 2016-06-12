import React, { Component } from 'react'
import { Link } from 'react-router'
import style from './style.scss'

export default class Header extends Component {

    render() {

        return (
            <header className={style.appHeader}>
                <img className={style.logo} src="assets/images/swallow.png"/>
                <div className={style.headerBtns}>
                    <button className={style.btnClear}><i className="fa fa-trash-o"></i> 清空</button>
                    <button className={style.btnSave}><i className="fa fa-save"></i> 保存</button>
                    <button className={style.btnPreview}><i className="fa fa-eye"></i> 预览</button>
                    <button className={style.btnPublish}><i className="fa fa-play"></i> 发布</button>
                </div>
                <div className={style.caption}>
                    <h5>未命名项目<b>*</b></h5>
                    <h6>上次保存于16:23:43</h6>
                </div>
            </header>
        )

    }

}