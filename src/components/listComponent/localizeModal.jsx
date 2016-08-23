import React, { Component } from 'react'
import { Modal, Button } from 'antd'

export default class LocalizeModal extends Component{
	constructor(props){
		super(props) 
		this.state = {
			visible: this.props.visible
		}  
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			visible: nextProps.visible
		})
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
		const visible  = this.state.visible
		return (
			<div>
	        	<Modal visible={this.state.visible} onOk={()=>this.handleOK()} onCancel={(e)=>this.handleCancel()} title="编辑" width={"1001px"}>
          			<div style={{height: '800px'}}></div>
	        	</Modal>
	        </div>	
		)
	}

}