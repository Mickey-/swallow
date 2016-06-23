import React from 'react'
import { Icon } from 'antd'
import style from './style.scss'

export default class LeftSidebar extends React.Component{

    render() {

        return (
            <div className={style.leftSidebar}>
                <button onClick={() => this.__setCurrentTool('link')} className={style.toolButton}><Icon type="link" /></button>
            </div>
        )

    }

    __setCurrentTool() {
        this.props.actions.updateEditorState({
            currentTool: 'links'
        })
    }

}