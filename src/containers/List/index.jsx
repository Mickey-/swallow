import React, { Component }from 'react'
import { bindActionCreators } from 'redux'
import * as listActions from '../../actions/list'
import { connect } from 'react-redux'
import style from './style.scss'

import { Table, Icon, Modal } from 'antd'
import columns from './tableHeader.json'
import Data from './mock.json'

import LocalizeModal from '../../components/listComponent/localizeModal'



class List extends Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            id: 0
        }
    }
    componentWillMount(){
        this.props.actions.initialTodo(Data)
        //todo  将length去掉
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
        this.setState({
            visible: true,
            id: id
        })
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
                _this.props.actions.deleteTodo(id)
            },
            cancelText: '取消',
        });
    }

    render() {
        const { list } = this.props;
        let id = this.state.id
        let visible = this.state.visible

        return (
            <div className={style.content}>
                <div className={style.header}>
                    <h4>Swallow Lists</h4>
                    <a href="#/edit">编辑页面</a>
                </div>
                <div className={style.tableC}>
                    <Table columns={columns} dataSource={list.lists} pagination={false} />
                </div>
                <LocalizeModal {...this.state} />
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
