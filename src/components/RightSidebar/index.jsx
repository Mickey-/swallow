import React from 'react'
import classNames from 'classnames'
import style from './style.scss'

export default class RightSidebar extends React.Component{

    constructor(props) {

        super(props)

        this.state = {
            pageBackgroundImage: null
        }

    }

    render() {

        return (
            <div className={style.rightSidebar}>
                <div className={style.optionGroup}>
                    <h5 className={style.optionCaption}>全局参数</h5>
                    <div className={style.optionBody}>
                        <label className={style.opitonLabel}>页面类型</label>
                        <div className={style.optionPageType}>
                            <button><i className="fa fa-tablet"></i> 移动端</button>
                            <button><i className="fa fa-television"></i> 桌面端</button>
                        </div>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>页面标题</label>
                        <input type="text" className={style.textOption}/>
                        <label className={style.opitonLabel}>页面别名(英文和数字的组合)</label>
                        <input type="text" className={style.textOption}/>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>背景图片</label>
                        <div className={style.fileOptionWrap}>
                            <button className={style.clearFile}><i className="fa fa-trash-o"></i></button>
                            <span className={style.selectedFileName}><i className="fa fa-file-o"></i> 选择图片</span>
                            <input onChange={(e) => this.__convertImage(e)} type="file"/>
                        </div>
                        <label className={style.opitonLabel}>背景颜色</label>
                        <input type="color" className={style.textOption}/>
                        <div className={style.groupLine}></div>
                        <label className={style.opitonLabel}>微信分享图标</label>
                        <input type="text" className={style.textOption}/>
                        <label className={style.opitonLabel}>微信分享标题</label>
                        <input type="text" className={style.textOption}/>
                        <label className={style.opitonLabel}>微信分享描述</label>
                        <textarea className={classNames(style.textOption, style.textarea)}></textarea>
                        <label className={style.opitonLabel}>百度统计代码</label>
                        <textarea className={classNames(style.textOption, style.textarea)}></textarea>
                    </div>
                </div>
            </div>
        )

    }

    __convertImage(e) {

        var file = e.currentTarget.files[0];
        var imageType = /image.*/;

        console.log(file)

        if (file.type.match(imageType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                document.getElementById('appCanvas').style.backgroundImage = 'url(' + reader.result + ')'
            }

            reader.readAsDataURL(file); 

        } else {
            console.log('文件格式不支持')
        }

    } 

}