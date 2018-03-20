import React, {
  PureComponent,
  createElement,
  Children,
  cloneElement,
  isValidElement
} from 'react';
import PropTypes from 'prop-types';

import eventManager from './../util/eventManager';

class ContextMenuProvider extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    renderTag: PropTypes.node,
    event: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.object,
    propagation: PropTypes.bool
  };

  static defaultProps = {
    renderTag: 'div',
    event: 'onContextMenu',
    className: '',
    style: {},
    data: null,
    propagation: true
  };

  constructor(props) {
    super(props);
    this.childrenRefs = [];
  }

  handleEvent = e => {
    e.preventDefault();
    console.log("propagation", this.props.propagation);
    if (!this.props.propagation) {
      console.log("stopped");
      e.stopPropagation();
    }
    eventManager.emit(
      `display::${this.props.id}`,
      e.nativeEvent,
      this.childrenRefs.length === 1
        ? this.childrenRefs[0]
        : this.childrenRefs,
      this.props.data
    );
  };

  getChildren() {
    const {
      id,
      renderTag,
      event,
      children,
      className,
      style,
      propagation,
      ...rest
    } = this.props;

    // reset refs
    this.childrenRefs = [];
    // use a new ref callback function each time, so that it is guaranteed to be called on each render
    const setChildRef = ref => ref === null || this.childrenRefs.push(ref);

    return Children.map(this.props.children,
      child => (
        isValidElement(child)
          ? cloneElement(child, { ...rest, ref: setChildRef })
          : child
      ));
  }

  render() {
    const { renderTag, event, className, style, propagation } = this.props;
    const attributes = Object.assign({}, {
      [event]: this.handleEvent,
      className,
      style,
      propagation
    });

    return createElement(
      renderTag,
      attributes,
      this.getChildren()
    );
  }
}

export default ContextMenuProvider;
