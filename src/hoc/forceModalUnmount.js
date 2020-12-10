import React from 'react'

export default function forceModalUnmount(WrappedComponent) {
  return class extends React.Component {
    render() {
      if (!this.props.isOpen) {
        return undefined
      }

      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}