import React from 'react'
import { bindActionCreators } from 'redux'
import * as listActions from '../../actions/list'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Table, Icon, Modal, Pagination, message, Switch } from 'antd'
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
                title: '',
                attention:''
            }
        }
    }

    componentWillMount() {
        this.loadPosters(this.props.location.query)
    }

    componentWillReceiveProps(props) {
        // this.loadPosters(props.location.query)
    }

    loadPosters(props) {

        let page = props.page || 0
        let type = props.type || 'all'
        let title = props.title || ''
        let attention = props.attention || ''
        let filter = { page, type, title, attention }
        let inited = true
        let loading = false

        this.setState({
            loading: true
        })
        if(props.attention === '0'){
          attention = 0
        }
        IO.getPosters({
            layout: type === 'all' ? '' : type,
            index: page,
            title: title,
            attention: attention
        }).then((data) => {
            let posters = data.list
            let total = data.total
            if(props.attention == 0){
              attention = 0
            }
            this.setState({ loading, filter, total, posters, inited })
            this.props.actions.cacheListData({
              'items': posters
            })
        }).catch((error) => {
            this.setState({ loading, filter, error })
        })

    }

    changeFilter(propName, propValue) {

        let filter = { ...this.state.filter }
        filter[propName] = propValue
        this.setState({ filter })
        let obj
        if (propName == 'type') {
          obj = {
            title : '',
            type: propValue,
            page: 0,
            attention: this.state.filter.attention
          }
        }else if(propName == 'attention'){
          obj = {
            title : '',
            type: this.state.filter.type,
            page: 0,
            attention:propValue ? 1 : ''
          }
        }else{
          obj = {
            title : propValue,
            type: '',
            page: 0,
            attention:''
          }
        }
        this.loadPosters(obj)

    }

    applyFilter() {
        location.hash = 'list?' + JSON2URL(this.state.filter)
    }

    showConfirm(id) {

      console.log(this.props)
      let self = this

      Modal.confirm({
        title: '你确定要删除这条活动信息吗？',
        content: '',
        onOk: function() {

          IO.deletePoster( id ).then((data) => {

            if (data) {

              self.props.actions.deletePoster({

                'id': id

              })

            }

          }).catch((error) => {
          })

        },
        onCancel: function() {}
      });

    }

    attentionStatus( id,attention ) {

        if(attention){
          attention = 0
        }else{
          attention = 1
        }

        IO.Attention( id, attention ).then((data) => {

          if(data){

            this.props.actions.updatePoster({

              'id': id,
              'item': {
                'attention': attention
              }

            })
          }


        }).catch((error) => {

        })
    }

    listPages(page, type, attention){

      IO.getPosters({
          layout: type === 'all' ? '' : type,
          index: page - 1,
          title: '',
          attention: attention
      }).then((data) => {

          this.props.actions.cacheListData({
            'items': data.list
          })

      })


    }

    render() {

        let page = this.state.filter.page || 0
        let type = this.state.filter.type || 'all'
        let title = this.state.filter.title || ''
        let attention = this.state.filter.attention || ''
        let { posters, loading, error, total } = this.state
        let data = this.props.posters
        let self = this

        function onChange(checked){

          if(checked){
            self.changeFilter('attention','1')
          }else{
            self.changeFilter('attention','')
          }

        }
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
                            <a className={type === 'all' && style.active} onClick = { () => this.changeFilter('type','all') }  >全部</a>
                            <a className={type === 'mobile' && style.active} onClick = { () => this.changeFilter('type','mobile') }  >移动端</a>
                            <a className={type === 'pc' && style.active} onClick = { () => this.changeFilter('type','pc') }  >桌面端</a>
                        </div>
                        <div className={style.attentionType}>关注：<Switch defaultChecked={ attention ? true :false}  onChange={ onChange } /></div>
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
                            <span className={style.attention}>关注</span>
                            <span className={style.itemTitle}>标题</span>
                            <span className={style.itemType}>类型</span>
                            <span className={style.itemDate}>修改时间</span>
                            <span className={style.itemOptBtns}>操作</span>
                        </li>
                        {data.map((item, index) => {
                            return (
                                <li key={index + 1}>
                                    <div className={style.attention} >
                                        <Icon onClick={ () => this.attentionStatus( item.id, item.attention)} type={ item.attention ? 'star' : 'star-o'} />
                                    </div>
                                    <div className={style.itemTitle} >
                                        <a href={Config.CDNURL  + '/' + item.pathname} target="_blank">{item.title}</a>
                                    </div>
                                    <span className={style.itemType}>{item.layout === 'mobile' ? '移动端' : '桌面端'}</span>
                                    <span className={style.itemDate}>{item.updateDate || item.createDate}</span>
                                    <div className={style.itemOptBtns}>
                                        <a onClick={ () => this.showConfirm(item.id) }><Icon type="delete" /> 删除</a>
                                    </div>
                                    <div className={style.itemOptBtns}>
                                        <a href={'#/edit/' + item.id} target="_blank"><Icon type="edit" /> 修改</a>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <div className={style.page}>
                        { total ? <Pagination onChange={ (current ) => this.listPages(current, this.state.filter.type, this.state.filter.attention) } pageSize={20} total={total} /> : null}
                    </div>
                </div>
            </div>
        )

    }

}

 const mapStateToProps = (state) => {
    return {
      posters: state.list.posters.items
    }
 }

 const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(listActions, dispatch)}
 }

 export default connect(mapStateToProps, mapDispatchToProps)(List)
