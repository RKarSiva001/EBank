import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    userid: '',
    pin: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUserid = event => {
    this.setState({userid: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userid, pin} = this.state
    const userDetails = {user_id: userid, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPinField = () => {
    const {pin} = this.state
    console.log(pin)
    return (
      <>
        <label className="input-label" htmlFor="pin">
          PIN
        </label>
        <input
          type="password"
          id="pin"
          className="pin-input-field"
          value={pin}
          onChange={this.onChangePin}
        />
      </>
    )
  }

  renderUseridField = () => {
    const {userid} = this.state
    console.log(userid)
    return (
      <>
        <label className="input-label" htmlFor="userid">
          User ID
        </label>
        <input
          type="text"
          id="userid"
          className="userid-input-field"
          value={userid}
          onChange={this.onChangeUserid}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
          className="website login"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <h1>Welcome Back</h1>
          <div className="input-container">{this.renderUseridField()}</div>
          <div className="input-container">{this.renderPinField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
