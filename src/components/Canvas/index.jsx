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
            allowDragCanvas: false,
            dragingElement: false,
            width: 0,
            height: 0,
            position: {x:0, y:0}
        }

        this.__globalDraging = false
        this.__dragCache = []
        this.__globalMouseDown = false

    }

    componentDidMount() {

        let listOfLayoutSize = {
            'mobile': [355, 667],
            'pc': [1920, 1080]
        }

        this.setState({
            width: listOfLayoutSize[this.props.pageData.layout][0],
            height: listOfLayoutSize[this.props.pageData.layout][1]
        })

        document.addEventListener('keydown', (e) => this.__keyDown(e))
        document.addEventListener('keyup', (e) => this.__keyUp(e))
        document.addEventListener('mouseup', (e) => this.__triggleGlobalMouseUp(e))
        document.addEventListener('mousedown', (e) => this.__triggleGlobalMouseDown(e))
        document.addEventListener('mousemove', (e) => this.__triggerGlobalDraging(e))

    }

    render() {

        let pageData = this.props.pageData
        let canvasClassNames = classNames(style.canvas, style.mobileCanvas)
        let canvasStyle = {
            transform: 'scale(' + this.state.scale + ')',
            backgroundColor: pageData.backgroundColor
        }
        let position = this.state.position
        let dragHandleStyle = this.state.allowDragCanvas ? {display:'block',transform: 'scale(' + this.state.scale + ')'} : {display:'none'}
        let backgroundImageElement = pageData.backgroundImageData ? <img draggable="false" className={style.backgroundImageElement} src={pageData.backgroundImageData}/> : null

        const createLinks = (item, index) => {

            let id = 'linkDragHandle' + index
            let handle = '#linkDragHandle' + index
            let elmentStyle = {
                left: item.left,
                top: item.top,
                width: item.width,
                height: item.height,
                minWidth: 30,
                minHeight: 20,
                maxWidth: this.state.width - item.left
            }
            return (
                <div key={index} onMouseOut={(e) => this.__syncElementSize(e, 'links', index)} onMouseUp={(e) => this.__syncElementSize(e, 'links', index)} className={style.linkElement} style={elmentStyle}>
                    <div onMouseDown={(e) => this.__startDragElement(e, 'links', index)} className={style.linkDragHandler} id={id}></div>
                </div>
            )

        }

        return (
            <div data-role="canvas-wrap" onKeyDown={(e) => this.__keyDown(e)} onWheel={(e) => this.__scaleCanvas(e)} className={style.canvasWrap}>
                <Draggable handle="#dragHandle" onDrag={(e, pos) => this.__draging(pos)} position={position}>
                    <div className={canvasClassNames}>
                        <div id="dragHandle" className={style.dragHandle} style={dragHandleStyle}></div>
                        <div style={canvasStyle} id="appCanvas" className={style.canvasCore}>
                            <div className={style.elementWrapper}>
                            {backgroundImageElement}
                            {pageData.elements.links.map(createLinks)}
                            </div>
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
                allowDragCanvas: true 
            })
            e.preventDefault()
        }

    }

    __keyUp() {

        this.setState({
            allowDragCanvas: false 
        })

    }

    __draging(pos) {

        this.setState({
            position: pos
        })

    }

    __syncElementSize(e, type, index) {

        if (this.__globalMouseDown) {

            let element = this.props.pageData.elements[type][index]
            let width = getComputedStyle(e.currentTarget).width.replace('px', '') * 1
            let height = getComputedStyle(e.currentTarget).height.replace('px', '') * 1

            this.props.actions.updateElement({
                'element_type': type,
                'index': index,
                'data': { width, height }
            })

        }

    }

    __startDragElement(e, type, index) {
        this.__dragCache = [e.clientX, e.clientY]
        this.__globalDraging = { type, index, dom_element: e.currentTarget }
    }

    __triggerGlobalDraging(e) {

        if (this.__globalDraging && !this.state.allowDragCanvas) {

            let element = this.props.pageData.elements[this.__globalDraging.type][this.__globalDraging.index]
            let offsetX = (e.clientX - this.__dragCache[0]) / this.state.scale
            let offsetY = (e.clientY - this.__dragCache[1]) / this.state.scale
            let left = element.left + offsetX
            let top = element.top + offsetY
            let element_width = getComputedStyle(this.__globalDraging.dom_element).width.replace('px', '') * 1 + 21

            left <= 0 && (left = 0)
            top <= 0 && (top = 0),

            (left + element_width > this.state.width) && (left = this.state.width - element_width)

            this.__dragCache = [e.clientX, e.clientY]
            this.props.actions.updateElement({
                'element_type': this.__globalDraging.type,
                'index': this.__globalDraging.index,
                'data': { left, top }
            })

        }

    }

    __triggleGlobalMouseDown(e) {
        this.__globalMouseDown = true
    }

    __triggleGlobalMouseUp(e, type, index) {

        this.__globalMouseDown = false
        this.__globalDraging = false
        this.__dragCache = []

    }

    __centerCanvas() {

        this.setState({
            scale: 1,
            position: {x:0, y:0}
        })

    }

    __scaleCanvas(e) {

        if (!this.state.allowDragCanvas) {
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