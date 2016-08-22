import React, { Component } from 'react'
import style from './style.scss'
import { Modal, Button } from 'antd'

export default class LocalizeModal extends Component{
	constructor(props){
		super(props)   
	}

	showModal(){
		this.setState({
			visible: true 
		})
	}

	handleOK(){
		this.setState({
			visible: false
		})
	}

	handleCancel(){
		this.setState({
			visible: false
		})
	}

	render(){
		const { visible } = this.props.visible
		return (
			<div>
	        	<Modal title="Modal" visible={visible}
	        		onOk={this.handleOk} onCancel={this.handleCancel} title="编辑"
	          		okText="确定" cancelText="取消" 
	          		footer={[
	          		]}
	          	>
	        	</Modal>
	        </div>	
		)
	}

}