import React from 'react'
import ReactDOM from 'react-dom'
import { Base64 } from 'js-base64'
import { Icon } from 'antd'
import style from './style.scss'

export default class Previewer extends React.Component {

    render() {

        let src = 'data:text/html;base64,' + Base64.encode(this.props.html)

        return (
            <div className={style.previewWrap}>
                <div className={style.mask}></div>
                <button onClick={() => this.__exitPreview()} className={style.btnExit}><Icon type="cross-circle" /></button>
                <div className={style.iframWrap}>
                    <iframe src={src} className={style.previewIframe} />
                </div>
            </div>
        )

    }

    __exitPreview() {
        ReactDOM.unmountComponentAtNode(document.getElementById('mobilePreview'))
    }

}