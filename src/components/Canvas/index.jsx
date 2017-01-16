import React from 'react'
import Draggable from 'react-draggable'
import { Icon } from 'antd'
import style from './style.scss'

export default class Canvas extends React.Component{

    constructor(props, context) {

        super(props, context)

        this.state = {
            scale: 1,
            allowDragCanvas: false,
            hightlightElements: false,
            width: 0,
            height: 0,
            position: {x:0, y:0},
            sketchpad: {
                left:0,
                top:0,
                width: 0,
                height: 0
            },
            tempElement: {
                top: -50,
                left: 0,
                width: 0,
                height: 0
            }
        }

        this.__globalDraging = false
        this.__dragCache = []
        this.__globalMouseDown = false

    }

    componentDidMount() {

        let listOfLayoutSize = {
            'mobile': [375, 667],
            'pc': [1920, 1080]
        }

        this.__canvas = document.getElementById('appCanvas')
        let rect = this.__canvas.getBoundingClientRect()
        this.setState({
            width: listOfLayoutSize[this.props.pageData.layout][0],
            height: listOfLayoutSize[this.props.pageData.layout][1],
            sketchpad: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height

            }
        })

        window.addEventListener('resize', (e) => this.__triggerGlobalResize(e))
        document.addEventListener('keydown', (e) => this.__triggerGlobalKeyDown(e))
        document.addEventListener('keyup', (e) => this.__triggerGlobalKeyUp(e))
        document.addEventListener('mouseup', (e) => this.__triggleGlobalMouseUp(e))
        document.addEventListener('mousedown', (e) => this.__triggleGlobalMouseDown(e))
        document.addEventListener('mousemove', (e) => this.__triggerGlobalDragging(e))

    }

    componentWillUnmount() {

        window.removeEventListener('resize', (e) => this.__triggerGlobalResize(e))
        document.removeEventListener('keydown', (e) => this.__triggerGlobalKeyDown(e))
        document.removeEventListener('keyup', (e) => this.__triggerGlobalKeyUp(e))
        document.removeEventListener('mouseup', (e) => this.__triggleGlobalMouseUp(e))
        document.removeEventListener('mousedown', (e) => this.__triggleGlobalMouseDown(e))
        document.removeEventListener('mousemove', (e) => this.__triggerGlobalDragging(e))

    }

    componentWillReceiveProps() {

        let listOfLayoutSize = {
            'mobile': [375, 667],
            'pc': [1920, 1080]
        }
        let rect = this.__canvas.getBoundingClientRect()
        this.setState({
            width: listOfLayoutSize[this.props.pageData.layout][0],
            height: listOfLayoutSize[this.props.pageData.layout][1],
            sketchpad: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height

            }
        })

    }

    render() {

        let pageData = this.props.pageData
        let editorState = this.props.editorState

        let layoutClassNames = {
            'mobile': style.mobileCanvas,
            'pc': style.pcCanvas
        }
        let canvasClassNames = [style.canvas, layoutClassNames[pageData.layout]]
        let canvasStyle = {
            transform: 'scale(' + this.state.scale + ')',
            backgroundColor: pageData.backgroundColor
        }
        let position = this.state.position
        let dragHandleStyle = this.state.allowDragCanvas ? {display:'block',transform: 'scale(' + this.state.scale + ')'} : {display:'none'}
        let backgroundImageElement = null

        let elementWrapperClassNames = [style.elementWrapper]
        this.state.hightlightElements && elementWrapperClassNames.push(style.highlight)

        const createBackgrounds = (item, index) => {

            if (item.data || item.url) {
                return <img key={index} onLoad={(e) => this.__updateBackgroundImageHeight(index, e.currentTarget.naturalHeight)} draggable="false" className={style.backgroundImageElement} src={item.data || item.url}/>
            } else {
                return null
            }

        }

        const createLinks = (item, index) => {

            let handle = '#linkDragHandle' + index
            let elmentStyle = {
                left: item.left,
                top: item.top,
                width: item.width,
                height: item.height,
                maxWidth: this.state.width - item.left
            }
            let classNames = [style.linkElement]
            if (editorState.currentElement.type === 'links' && editorState.currentElement.index === index) {
                classNames[1] = [style.active] 
            }

            return (
                <div data-role="element" key={index} onMouseDown={() => this.__selectElement('links', index)} className={classNames.join(' ')} style={elmentStyle}>
                    <div data-role="element" onMouseDown={(e) => this.__startDraggingElement(e, 'links', index)} className={style.linkDragHandle}></div>
                    <div data-role="element" onMouseDown={(e) => this.__startResizeElement(e, 'links', index)} className={style.linkResizeHandle}></div>
                </div>
            )

        }

        return (
            <div>
                <div data-current-tool={editorState.currentTool} style={this.state.sketchpad} onMouseDown={(e) => {this.__startDrawingElement(e)}} onMouseMove={(e) => this.__drawingElement(e)} onMouseUp={() => this.__confirmDrawingElement()} className={style.sketchpad}>
                    <div style={this.state.tempElement} className={style.tempElement}></div>
                </div>
                <div data-role="canvas-wrap" onKeyDown={(e) => this.__triggerGlobalKeyDown(e)} onWheel={(e) => this.__resizeCanvas(e)} className={style.canvasWrap}>
                    <Draggable handle="#dragHandle" onDrag={(e, pos) => this.__draggingCanvas(pos)} position={position}>
                        <div data-role="canvas-wrap" className={canvasClassNames}>
                            <div id="dragHandle" className={style.dragHandle} style={dragHandleStyle}></div>
                            <div style={canvasStyle} id="appCanvas" className={style.canvasCore}>
                                <div className={elementWrapperClassNames.join(' ')}>
                                    {pageData.background.map(createBackgrounds)}
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
            </div>
        )

    }

    __updatePageData(name, value) {

        var tempData = {}
        tempData[name] = value
        this.props.actions.updatePageData(tempData)

    }

    __triggerGlobalKeyDown(e) {

        let keyCode = e.keyCode
        let nodeName = e.target.nodeName.toLowerCase()
        let isInput = (nodeName === 'input' || nodeName === 'textarea')

        if (keyCode === 32 && !isInput) {
            this.setState({
                allowDragCanvas: true 
            })
            e.preventDefault()
        }

        if (keyCode === 72 && !isInput) {
            this.setState({
                hightlightElements: !this.state.hightlightElements
            })
        }

        if (keyCode === 65) {
            this.props.actions.updateEditorState({
                currentTool: 'links'
            })
        }

        if ((keyCode === 46 || keyCode === 8) && !isInput) {
            this.__deleteCurrentElement()
        }

        if (keyCode === 8 && !isInput) {
            e.preventDefault()
            return false
        }

    }

    __triggerGlobalKeyUp() {

        this.setState({
            allowDragCanvas: false 
        })
        this.props.actions.updateEditorState({
            currentTool: null
        })

    }

    __draggingCanvas(pos) {

        let rect = this.__canvas.getBoundingClientRect()
        this.setState({
            position: pos,
            sketchpad: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            }
        })

    }

    __updateBackgroundImageHeight(index, height) {
        this.props.actions.updateBackground({index, data:{height}})
    }

    __selectElement(type, index) {
        this.props.actions.selectElement({ type, index })
    }

    __deleteCurrentElement() {

        let { type, index } = this.props.editorState.currentElement
        ;(type !== null && index !== null) && this.props.actions.deleteElement({ type, index })
        
    }

    __startResizeElement(e, type, index) {
        this.__dragCache = [e.clientX, e.clientY]
        this.__globalDraging = { action: 'resize', type, index, dom_element: e.currentTarget }
    }

    __startDraggingElement(e, type, index) {
        this.__dragCache = [e.clientX, e.clientY]
        this.__globalDraging = { action: 'drag', type, index, dom_element: e.currentTarget }
    }

    __startDrawingElement(e) {

        if (this.props.editorState.currentTool) {

            let left = e.clientX - this.state.sketchpad.left
            let top = e.clientY - this.state.sketchpad.top

            this.__dragCache = [e.clientX, e.clientY]
            this.__globalDraging = { 'action': 'draw' }
            this.setState({
                tempElement: {
                    top, left,
                    width: 0,
                    height: 0
                }
            })

        }

    }

    __drawingElement(e) {

        if (this.__globalDraging.action === 'draw' && this.props.editorState.currentTool) {

            let offsetLeft = e.clientX - this.__dragCache[0]
            let offsetTop = e.clientY - this.__dragCache[1]

            this.setState({
                tempElement: {
                    top: this.state.tempElement.top,
                    left: this.state.tempElement.left,
                    width: this.state.tempElement.width + offsetLeft,
                    height: this.state.tempElement.height + offsetTop,
                }
            })
            this.__dragCache = [e.clientX, e.clientY]
        }

    }

    __confirmDrawingElement() {

        if (this.__globalDraging.action === 'draw' && this.props.editorState.currentTool) {

            let element_type = this.props.editorState.currentTool
            let element = {
                left: this.state.tempElement.left / this.state.scale,
                top: this.state.tempElement.top / this.state.scale + this.__canvas.scrollTop,
                width: this.state.tempElement.width / this.state.scale,
                height: this.state.tempElement.height / this.state.scale,
                'target': '_self',
                'url': '' 
            }

            element.width < 20 && (element.width = 20)
            element.height < 20 && (element.height = 20)

            this.props.actions.addElement({
                element_type, element
            })

            this.props.actions.selectElement({
                'type': element_type,
                'index': this.props.pageData.elements[element_type].length
            })

        }

    }

    __triggerGlobalDragging(e) {

        if (this.__globalDraging && !this.state.allowDragCanvas) {

            let offsetX = (e.clientX - this.__dragCache[0]) / this.state.scale
            let offsetY = (e.clientY - this.__dragCache[1]) / this.state.scale

            if (this.__globalDraging.action === 'draw') {

            } else if (this.__globalDraging.action === 'drag') {

                let element = this.props.pageData.elements[this.__globalDraging.type][this.__globalDraging.index]
                let left = element.left + offsetX
                let top = element.top + offsetY

                left <= 0 && (left = 0)
                top <= 0 && (top = 0),

                (left + element.width > this.state.width) && (left = this.state.width - element.width)

                this.props.actions.updateElement({
                    'element_type': this.__globalDraging.type,
                    'index': this.__globalDraging.index,
                    'data': { left, top }
                })

            } else if (this.__globalDraging.action === 'resize') {

                let element = this.props.pageData.elements[this.__globalDraging.type][this.__globalDraging.index]
                let width = element.width + offsetX
                let height = element.height + offsetY

                width <= 20 && (width = 20)
                height <= 20 && (height = 20),

                (element.left + width > this.state.width) && (width = this.state.width - element.left)

                this.props.actions.updateElement({
                    'element_type': this.__globalDraging.type,
                    'index': this.__globalDraging.index,
                    'data': { width, height }
                })

            }

            this.__dragCache = [e.clientX, e.clientY]

        }

    }

    __triggleGlobalMouseDown(e) {

        if (e.target.dataset.role === 'canvas-wrap') {

            this.props.actions.selectElement({
                type: null,
                index: null
            })

        }

        this.__globalMouseDown = true

    }

    __triggleGlobalMouseUp(e, type, index) {

        this.__globalMouseDown = false
        this.__globalDraging = false
        this.__dragCache = []

        this.setState({
            tempElement: {
                top: -50,
                left: 0,
                width: 0,
                height: 0
            }
        })

        this.props.actions.updateEditorState({
            currentTool: null
        })

    }

    __triggerGlobalResize() {
        this.__syncSizeOfSketchpad()
    }

    __centerCanvas() {

        this.setState({
            scale: 1,
            position: {x:0, y:0},
        }, () => {
            this.__syncSizeOfSketchpad()
        })

    }

    __syncSizeOfSketchpad () {

        let rect = this.__canvas.getBoundingClientRect()
        this.setState({
            sketchpad: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            }
        })

    }

    __resizeCanvas(e) {

        if (!this.state.allowDragCanvas) {
            return false
        }

        let scale = this.state.scale + e.deltaY * -0.05
        scale < 0.3 && (scale = 0.3)
        scale > 4 && (scale = 4)

        this.setState({ scale }, () => {
            this.__syncSizeOfSketchpad()
        })

    }

}