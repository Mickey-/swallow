import React, { Component } from 'react'
import { Modal, Button } from 'antd'

export default class LocalizeModal extends Component{
	constructor(props){
		super(props) 
		this.state = {
			visible: this.props.visible,
			test: 1
		}  
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			visible: nextProps.visible,
			test: this.state.test+1
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

	click(){
		this.setState({
			test: 1
		})
	}

	render(){
		const visible  = this.state.visible
		console.log('变化了')
		return (
			<div>
	        	<Modal visible={this.state.visible} onOk={()=>this.handleOK()} onCancel={(e)=>this.handleCancel()} title="编辑" width={"1001px"}>
          			<div style={{height: '800px'}} onClick={()=>this.click()}>
          				test state:{this.state.test}
          			</div>
	        	</Modal>
	        </div>	
		)
	}

}