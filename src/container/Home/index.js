import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

const Home = props => (
  <div className='hello' >
    its my home
    <button onClick={() => props.history.push('/about')} >go to about</button>
    <button onClick={() => props.history.push('/contact')} >go to contact</button>
  </div>
)

Home.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
}
Home.defaultProps = {
  history: {
    push: () => ''
  }
}

export default withRouter(Home)
