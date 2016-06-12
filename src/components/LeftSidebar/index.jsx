import React from 'react'
import style from './style.scss'

export default class LeftSidebar extends React.Component{

    render() {

        return (
            <div className={style.leftSidebar}>
                <button className={style.toolButton}>
                    <i className="fa fa-link"></i>
                </button>
            </div>
        )

    }

}