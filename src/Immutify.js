import React, { PureComponent } from 'react'

const Immutify = (WrappedComponent) => {
  return class extends PureComponent {
    render() {
      return <WrappedComponent {...this.props.immutableProps.toJS()} />
    }
  }
}

export default Immutify
