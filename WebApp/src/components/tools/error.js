import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <div></div>;
    }else{
      return <div>{this.props.children}</div>;
    }
  }
}

export default ErrorBoundary;