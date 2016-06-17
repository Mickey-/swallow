import React from 'react'
import { bindActionCreators } from 'redux'
import { connect} from 'react-redux'
import Header from '../../components/Header'
import LeftSidebar from '../../components/LeftSidebar'
import Canvas from '../../components/Canvas'
import RightSidebar from '../../components/RightSidebar'
import * as editorActions from '../../actions/editor'
import style from './style.scss'

class Editor extends React.Component{

    render() {

        return (
            <div className={style.editPage}>
                <Header pageData={this.props.pageData} actions={this.props.actions}/>
                <LeftSidebar actions={this.props.actions}/>
                <Canvas pageData={this.props.pageData} actions={this.props.actions}/>
                <RightSidebar pageData={this.props.pageData} actions={this.props.actions}/>
            </div>
        )
    }

}

const mapStateToProps = (state) => {

    return {
        pageData: state.editor.attr
    }

}

const mapDispatchToProps = (dispatch) => {

    return {
        actions: bindActionCreators(editorActions, dispatch)
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)