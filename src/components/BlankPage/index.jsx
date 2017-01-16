import React from 'react'
import style from './style.scss'

export default class BlankPage extends React.Component {

    render() {

        let type = this.props.type || 'tip'
        let message = this.props.message

        return (
            <div className={style.blankPage}>
                <div className={style.content}>
                    <span data-type={type} className={style.icon}></span>
                    <h5 className={style.message}>{message}</h5>
                </div>
            </div>
        )

    }

}