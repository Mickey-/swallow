import React from 'react'
import ElementList from '../Widgets/ElementList'
import PageOption from '../Widgets/PageOption'
import LinkOption from '../Widgets/LinkOption'
import style from './style.scss'

export default class RightSidebar extends React.Component{

    render() {

        let { pageData, editorState, actions, errors } = this.props

        return (
            <div className={style.rightSidebar} data-layout={pageData.layout}>
                <ElementList pageData={pageData} editorState={editorState} actions={actions} />
                <LinkOption pageData={pageData} editorState={editorState} actions={actions} />
                <PageOption errors={errors} pageData={pageData} editorState={editorState} actions={actions} />
            </div>
        )

    }

}