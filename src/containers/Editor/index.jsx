import React from 'react'
import Header from '../../components/Header'
import LeftSidebar from '../../components/LeftSidebar'
import Canvas from '../../components/Canvas'
import RightSidebar from '../../components/RightSidebar'
import style from './style.scss'

export default class Editor extends React.Component{

    render() {
        return (
            <div className={style.editPage}>
                <Header/>
                <LeftSidebar/>
                <Canvas/>
                <RightSidebar/>
            </div>
        )
    }

}