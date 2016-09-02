import React from 'react'
import { bindActionCreators } from 'redux'
import * as listActions from '../../actions/list'
import { connect } from 'react-redux'
import classNames from 'classnames'
import style from './style.scss'
import Header from '../../components/Header'
import { Table, Icon, Modal, Pagination, message } from 'antd'
import { deletePoster, getPosters } from '../../io'


class List extends React.Component{

    constructor(props) {

        super(props)

    }

    render() {

        let page = this.props.location.query.page || 1
        let type = this.props.location.query.type || 'all'

        return (
            <div className={style.listPage}>
                <Header type="list"/>
                <div className={style.pageContainer}>
                    <div className={style.listTypes}>
                        <a className={type === 'all' && style.active} href={'#/list?type=all&page=' + page}>全部</a>
                        <a className={type === 'mobile' && style.active} href={'#/list?type=mobile&page=' + page}>移动端</a>
                        <a className={type === 'pc' && style.active} href={'#/list?type=pc&page=' + page}>桌面端</a>
                    </div>
                </div>
            </div>
        )

    }

}

 const mapStateToProps = (state) => {
    return {posters: state.posters}
 }

 const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(listActions, dispatch)}
 }

 export default connect(mapStateToProps, mapDispatchToProps)(List)
