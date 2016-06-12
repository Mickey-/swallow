import React from 'react'
import Draggable from 'react-draggable'
import classNames from 'classnames'
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

        let canvasClassNames = classNames(style.canvas, style.mobileCanvas)
        let scaleStyle = {
            transform: 'scale(' + this.state.scale + ')'
        }
        let position = this.state.position
        let dragHandleStyle = this.state.allowDrag ? {display:'block',transform: 'scale(' + this.state.scale + ')'} : {display:'none'}

        return (
            <div data-role="canvas-wrap" onKeyDown={(e) => this.__keyDown(e)} onWheel={(e) => this.__scaleCanvas(e)} className={style.canvasWrap}>
                <Draggable handle="#dragHandle" onDrag={(e, pos) => this.__draging(pos)} position={position}>
                    <div className={canvasClassNames}>
                        <div id="dragHandle" className={style.dragHandle} style={dragHandleStyle}></div>
                        <div style={scaleStyle} id="appCanvas" className={style.canvasCore}>

                        </div>
                    </div>
                </Draggable>
                <div className={style.indicator}>
                    <button onClick={() => this.__centerCanvas()} className={style.centerCanvas}><i className="fa fa-dot-circle-o"></i></button>
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

    __centerCanvas() {

        this.setState({
            scale: 1,
            position: {x:0, y:0}
        })

    }

    __scaleCanvas(e) {

        let scale = this.state.scale + e.deltaY * -0.05
        scale < 0.3 && (scale = 0.3)
        scale > 4 && (scale = 4)

        this.setState({
            scale: scale
        })

    }

}