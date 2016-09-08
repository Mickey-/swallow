import React from 'react'
import { bindActionCreators } from 'redux'
import * as listActions from '../../actions/list'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Table, Icon, Modal, Pagination, message } from 'antd'
import style from './style.scss'
import Header from '../../components/Header'
import { formatTime, JSON2URL } from '../../functions'
import * as IO from '../../io'
import * as Config from '../../config.json'


class List extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            error: false,
            inited: false,
            total: 0,
            posters: [],
            filter: {
                page: 0,
                type: 'all',
                title: ''
            }
        }
    }

    componentWillMount() {
        this.loadPosters(this.props.location.query)
    }

    componentWillReceiveProps(props) {
        this.loadPosters(props.location.query)
    }

    loadPosters(props) {

        let page = props.page || 0
        let type = props.type || 'all'
        let title = props.title || ''
        let filter = { page, type, title }
        let inited = true
        let loading = false

        this.setState({
            loading: true
        })

        IO.getPosters({
            layout: type === 'all' ? '' : type,
            index: page,
            title: title
        }).then((data) => {
            let posters = data.list
            let total = data.total
            this.setState({ loading, filter, total, posters, inited })
        }).catch((error) => {
            this.setState({ loading, filter, error })
        })

    }

    changeFilter(propName, propValue) {

        let filter = { ...this.state.filter }
        filter[propName] = propValue
        this.setState({ filter })

    }

    applyFilter() {
        location.hash = 'list?' + JSON2URL(this.state.filter)
    }

    render() {

        let page = this.state.filter.page || 0
        let type = this.state.filter.type || 'all'
        let title = this.state.filter.title || ''
        let { posters, loading, error } = this.state

        if (error) {
            return (
                <div className={style.listPage}>
                    <Header type="list"/>
                    <div className={style.pageContainer}>
                        <div className={style.listError}></div>
                    </div>
                </div>
            )
        }

        if (loading) {
            return (
                <div className={style.listPage}>
                    <Header type="list"/>
                    <div className={style.pageContainer}>
                        <div className={style.listLoading}></div>
                    </div>
                </div>
            )
        }

        return (
            <div className={style.listPage}>
                <Header type="list"/>
                <div className={style.pageContainer}>
                    <div className={style.listFilter}>
                        <div className={style.listTypes}>
                            <a className={type === 'all' && style.active} href={'#/list?title=' + title + '&type=all&page=' + page}>全部</a>
                            <a className={type === 'mobile' && style.active} href={'#/list?title=' + title + '&type=mobile&page=' + page}>移动端</a>
                            <a className={type === 'pc' && style.active} href={'#/list?title=' + title + '&type=pc&page=' + page}>桌面端</a>
                        </div>
                        <div className={style.listSearcher}>
                            <button onClick={(e) => this.applyFilter()} className={style.listSearchBtn}><Icon type="search" /> 搜索</button>
                            <input
                                onChange={(e) => this.changeFilter('title', e.currentTarget.value)}
                                onKeyDown={(e) => {e.keyCode === 13 && this.applyFilter()}}
                                value={title} type="text" className={style.listSearchInput} placeholder="按标题搜索"/>
                            <span onClick={(e) => this.changeFilter('title','')} className={style.btnClearSearchInput}>清空输入框</span>
                        </div>
                    </div>
                    <ul className={style.listItems}>
                        <li className={style.listHead}>
                            <span className={style.itemTitle}>标题</span>
                            <span className={style.itemType}>类型</span>
                            <span className={style.itemDate}>修改时间</span>
                            <span className={style.itemOptBtns}>操作</span>
                        </li>
                        {posters.map((item, index) => {
                            return (
                                <li key={index + 1}>
                                    <div className={style.itemTitle} >
                                        <a href={Config.CDNURL  + '/' + item.pathname} target="_blank">{item.title}</a>
                                    </div>
                                    <span className={style.itemType}>{item.layout === 'mobile' ? '移动端' : '桌面端'}</span>
                                    <span className={style.itemDate}>{item.updateDate || item.createDate}</span>
                                    <div className={style.itemOptBtns}>
                                        <a href={'#/edit/' + item.id} target="_blank"><Icon type="edit" /> 修改</a>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
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
