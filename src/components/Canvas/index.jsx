import React from 'react'
import Draggable from 'react-draggable'
import classNames from 'classnames'
import { Icon } from 'antd'
import style from './style.scss'

export default class Canvas extends React.Component{

    constructor(props, context) {

        super(props, context)

        this.state = {
            scale: 1,
            allowDrag: false,
            position: {x:0, y:0}
        }

    }

    componentDidMount() {

        document.addEventListener('keydown', (e) => this.__keyDown(e))
        document.addEventListener('keyup', (e) => this.__keyUp(e))

    }

    render() {

        let pageData = this.props.pageData
        let canvasClassNames = classNames(style.canvas, style.mobileCanvas)
        let canvasStyle = {
            transform: 'scale(' + this.state.scale + ')',
            backgroundColor: pageData.backgroundColor
        }
        let position = this.state.position
        let dragHandleStyle = this.state.allowDrag ? {display:'block',transform: 'scale(' + this.state.scale + ')'} : {display:'none'}
        let backgroundImageElement = pageData.backgroundImageData ? <img draggable="false" className={style.backgroundImageElement} src={pageData.backgroundImageData}/> : null

        const createLinks = (item, index) => {

            let id = 'linkDragHandle' + index
            let handle = '#linkDragHandle' + index
            return (
                <Draggable bounds="parent" handle={handle} key={index} onDrag={(e, pos) => this.__dragingElement(index, pos)}>
                    <div className={style.linkElement} style={{
                        top: item.top,
                        left: item.left,
                        width: item.width,
                        height: item.height
                    }}>
                        <div className={style.linkDragHandler} id={id}></div>
                    </div>
                </Draggable>
            )

        }

        return (
            <div data-role="canvas-wrap" onKeyDown={(e) => this.__keyDown(e)} onWheel={(e) => this.__scaleCanvas(e)} className={style.canvasWrap}>
                <Draggable handle="#dragHandle" onDrag={(e, pos) => this.__draging(pos)} position={position}>
                    <div className={canvasClassNames}>
                        <div id="dragHandle" className={style.dragHandle} style={dragHandleStyle}></div>
                        <div style={canvasStyle} id="appCanvas" className={style.canvasCore}>
                            {backgroundImageElement}
                            {pageData.elements.links.map(createLinks)}
                        </div>
                    </div>
                </Draggable>
                <div className={style.indicator}>
                    <button onClick={() => this.__centerCanvas()} className={style.centerCanvas}><Icon type="shrink" /></button>
                    <span>{Math.round(this.state.scale * 100)}%</span>
                </div>
            </div>
        )

    }

    __keyDown(e) {

        if (e.keyCode === 32) {
            this.setState({
               allowDrag: true 
            })
            e.preventDefault()
        }

    }

    __keyUp() {

        this.setState({
            allowDrag: false 
        })

    }

    __draging(pos) {

        this.setState({
            position: pos
        })

    }

    __dragingElement(post, index) {

    }

    __centerCanvas() {

        this.setState({
            scale: 1,
            position: {x:0, y:0}
        })

    }

    __scaleCanvas(e) {

        if (!this.state.allowDrag) {
            return false
        }

        let scale = this.state.scale + e.deltaY * -0.05
        scale < 0.3 && (scale = 0.3)
        scale > 4 && (scale = 4)

        this.setState({
            scale: scale
        })

    }

}