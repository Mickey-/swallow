import React, { Component }from 'react'
import { bindActionCreators } from 'redux'
import * as listActions from '../../actions/list'
import { connect } from 'react-redux'
import classNames from 'classnames'
import style from './style.scss'

import { Table, Icon, Modal, Pagination, message } from 'antd'

import { deletePoster, getPosters } from '../../io' 
import columns from './tableHeader.json'


class List extends Component{
    constructor(props){
        super(props)
        this.state = {
            id: 0,
            total: 0,
            current: 1
        }
        this.filter = this.props.list.filter;
        this.changeProp = this.changeProp.bind(this);
    }

    getList(index, size){
        getPosters( index-1, this.filter, size ).then( (res) => {
            //todo  this.setState({total: res.length});  传入总数设置页数   默认每页数量是5。应改为20
            this.setState({total: 50, current: index});

            this.props.actions.initialTodo(res)
        })
    }

    componentWillMount(){
        this.getList(this.state.current, 5);
        //todo  将if语句去掉     
        if(columns.length == 11 ){
            columns.push({
                "title": "操作",
                "key": "operation",
                "render": (text, record) => (<span className={style.operation}>
                    <a onClick={ e => this.edit( record.id ) }><Icon type="edit"/></a>
                    <a onClick={ e => this.delete( record.id ) }><Icon type="delete"/></a>
                    <a onClick={ e => this.preview( record.id ) }><Icon type="book"/></a>
                  </span>)
            })
        }
       
    }

    edit( id ){
        console.log(id)
    }

    preview(e){
        console.log(3)
    }

    delete( id ){
        var _this = this;
        Modal.confirm({
            title: '删除',
            content: '您确定要删除此条记录吗',
            okText: '确定',
            onOk(){
                // _this.props.actions.deleteTodo(id)
                deletePoster(id).then( (res) => {
                    if(res == true){
                        _this.getList(_this.state.current, 5);
                        message.success('删除成功...', 1);

                    }
                })
            },
            cancelText: '取消',
        });
    }

    onChange(page){
        this.getList(page, 5);
    }

    onclick(){
        this.filter = this.props.list.filter;
        this.setState({
            current: 1
        }, () => {
            this.getList(this.state.current, 5);
        })
        message.success('搜索结果展示如下...', 1);
    }

    changeProp(event){
        const name = event.target.name;
        const params = {[name]: event.target.value};

        this.props.actions.filterTodo( params );
    }

    render() {
        const { list } = this.props;
        let id = this.state.id
        const none = this.state.total == 0 ? style.none : ''

        return (
            <div className={style.content}>
                <div className={style.header}>
                    <h4>Swallow Lists</h4>
                    <a href="#/edit">编辑页面</a>
                </div>
                <div className={classNames(style.searchForm, 'clearfix')}>
                    <input type="text" name="title"  value={this.props.list.filter.title} onChange={this.changeProp}  placeholder="请输入标题" />
                    布局:<select name="layout" onChange={this.changeProp} >
                        <option value="">请选择</option>
                        <option value="mobile">移动端</option>
                        <option value="pc">电脑端</option>
                    </select>
                    <input type="text" name="shareTitle" value={this.props.list.filter.shareTitle} onChange={this.changeProp}  placeholder="请输入分享标题" />
                    <button className={classNames(style.search, 'clearfix')} onClick={()=>this.onclick()} >搜索</button>
                </div>
                <div className={style.tableC}>
                    <Table columns={columns} dataSource={list.lists} pagination={false} />
                </div>
                <div className={classNames( style.page, none )}>
                    <Pagination pageSize={5} total={this.state.total} current={this.state.current}  onChange={ (page) => this.onChange(page)}/>
                </div>
            </div>
        )
    }

}

 const mapStateToProps = ( state ) => {
    return {list: state.list}
 }

 const mapDispatchToProps = ( dispatch ) => {
    return {actions: bindActionCreators( listActions, dispatch )}
 }

 export default connect( mapStateToProps, mapDispatchToProps )( List )
