import React, { Component } from 'react'
import { fromJS } from 'immutable'
import ReactTooltip from 'react-tooltip'
import Immutify from './Immutify'

function defaultTooltipContent(tooltipData) {
  if(tooltipData === undefined) return <span>N/A</span>
  return <span>Tooltip content {tooltipData.value}</span>
}

const WithTooltips = (WrappedComponent, tooltipContent = defaultTooltipContent) => {
  return class extends Component {
    constructor(props) {
      super(props)
      const mergedProps = Object.assign({}, props, { onMouseOver: (data) => this.setState({ tooltipData: data })})
      this.state = {
        tooltipData: undefined,
        immutableProps: fromJS(mergedProps)
      }
      this.ImmutableComponent = Immutify(WrappedComponent)
    }

    componentWillReceiveProps(nextProps) {
      const mergedProps = Object.assign({}, nextProps, { onMouseOver: (data) => this.setState({ tooltipData: data })})
      const nextImmutableProps = fromJS(mergedProps)
      if(!this.state.immutableProps.equals(nextImmutableProps)) {
        this.setState({ immutableProps: nextImmutableProps })
      }
    }

    render() {
      const ImmutableComponent = this.ImmutableComponent
      return (
        <div>
          <ImmutableComponent immutableProps={this.state.immutableProps} />
          <ReactTooltip id="global-tooltip">{tooltipContent(this.state.tooltipData)}</ReactTooltip>
        </div>
      )
    }
  }
}

export default WithTooltips
