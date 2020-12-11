import React from 'react'
import axios from 'axios'

export default function withRequest(
  WrappedComponent, 
  provider = axios,
  namespace = undefined) 
{
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        errors: null
      }
    }

    setErrors = (errors) => {
      this.setState({ errors })
    }

    doRequest = async ({ url, method, body }) => {
      try {
        this.setErrors(null)
        const { data } = await axios[method](url, 
          { 
            ...body, 
            headers: {
              'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            } 
          }
        )

        if (data.error && data.error.message) {
          throw new Error(data.error.message)
        }

        return data
      }
      catch (err) {
        console.log(err)
        this.setErrors(
          <div className="alert alert-danger">
            <h4>Ooops...</h4>
            <ul className="my-0">
              {(err && err.message) || 'invalid request'}
            </ul>
          </div>
        )
        return null
      }
    }

    render() {
      let dynamicProps = {}
      if (namespace) {
        dynamicProps = {
          [namespace]: {
            doRequest: this.doRequest
          }
        }
      } else {
        dynamicProps.doRequest = this.doRequest
      }
      
      return (
        <WrappedComponent 
          errors={this.state.errors} 
          {...this.props} 
          {...dynamicProps}
        />
      )
    }
  };
}