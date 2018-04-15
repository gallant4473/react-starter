import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { CheckboxGroup } from 'reusable-react-components'

class Home extends Component {
  render () {
    return (
      <div className='hello' >
        it's my home
        <button onClick={() => this.props.history.push('/about/1')} >go to about</button>
        <button onClick={() => this.props.history.push('/contact')} >go to contact</button>
        <CheckboxGroup id='checkbox' options={[1, 2, 3]} active={[]} onChange={(value) => console.log(value)} />
      </div>
    )
  }
}

export default withRouter(Home)
