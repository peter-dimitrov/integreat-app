import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './Headroom.css'

const UPWARDS = 'up'
const DOWNWARDS = 'down'

const UNPINNED = 'unpinned'
const PINNED = 'pinned'
const STATIC = 'static'

class Headroom extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired, // The child node to be displayed as a header
    scrollHeight: PropTypes.number.isRequired, // The maximum amount of px the header should move up when scrolling
    pinStart: PropTypes.number.isRequired, // The minimum scrollTop position where the transform should start
    stickyAncestor: PropTypes.node, // Gets rendered with a corresponding stickyTop prop as an ancestor
    height: PropTypes.number // Used for rendering stickyTop position of stickyAncestor
  }

  static defaultProps = {
    pinStart: 0
  }

  /**
   * @returns {number} the current scrollTop position of the window
   */
  static getScrollTop () {
    if (window.pageYOffset !== undefined) {
      return window.pageYOffset
    } else if (window.scrollTop !== undefined) {
      return window.scrollTop
    } else {
      return (document.documentElement || document.body.parentNode || document.body).scrollTop
    }
  }

  constructor (props) {
    super(props)
    this.handleEvent = this.handleEvent.bind(this)
    this.update = this.update.bind(this)
    this.state = {mode: STATIC, transition: false}
    this.lastKnownScrollTop = 0 // the very last scrollTop which we know about (to determine direction changes)
    this.direction = DOWNWARDS // the current direction that the user is scrolling into
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleEvent)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleEvent)
  }

  /**
   * If we're already static and pinStart + scrollHeight >= scrollTop, then we should stay static.
   * If we're not already static, then we should set the header static, only when pinStart >= scrollTop (regardless of
   * scrollHeight, so the header doesn't jump up, when scrolling upwards to the trigger).
   * Else we shouldn't set it static.
   * @param scrollTop the currentScrollTop position
   * @returns {boolean} if we should set the header static
   */
  shouldSetStatic (scrollTop) {
    if (this.state.mode === STATIC) {
      return this.props.pinStart + this.props.scrollHeight >= scrollTop
    } else {
      return this.props.pinStart >= scrollTop
    }
  }

  /**
   *
   * @param scrollTop
   * @param direction
   * @returns {string}
   */
  determineMode (scrollTop, direction) {
    if (this.shouldSetStatic(scrollTop)) return STATIC
    else return direction === UPWARDS ? PINNED : UNPINNED
  }

  /**
   * @returns {boolean} if we should activate css transition animations for the transform property
   */
  shouldTransition (mode, direction) {
    // If mode is static, then no transition, because we're already in the right spot
    // (and want to change transform and top properties seamlessly)
    if (mode === STATIC) return false
    // mode is not static, transition when moving upwards or when we've lastly did the transition
    return direction === UPWARDS || this.state.transition
  }

  /**
   * Checks the current scrollTop position and updates the state accordingly
   */
  update () {
    const currentScrollTop = Headroom.getScrollTop()
    const direction = this.lastKnownScrollTop < currentScrollTop ? DOWNWARDS : UPWARDS
    const mode = this.determineMode(currentScrollTop, direction)
    const transition = this.shouldTransition(mode, direction)
    this.setState({mode, transition})
    this.lastKnownScrollTop = currentScrollTop
  }

  handleEvent () {
    window.requestAnimationFrame(this.update)
  }

  render () {
    const {stickyAncestor, children, height, scrollHeight} = this.props
    const {mode, transition} = this.state
    const transform = mode === UNPINNED ? -scrollHeight : 0
    const ownStickyTop = mode === STATIC ? -scrollHeight : 0
    const stickyTop = mode === PINNED ? height : height - scrollHeight
    return <React.Fragment>
      <div
        style={{transform: `translateY(${transform}px)`, top: `${ownStickyTop}px`}}
        className={cx({
          [style.headroom]: true,
          [style.transition]: transition,
          [style.static]: mode === STATIC
        })}>
        {children}
      </div>
      {stickyAncestor && React.cloneElement(stickyAncestor, {stickyTop})}
    </React.Fragment>
  }
}

export default Headroom
