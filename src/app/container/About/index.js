import React, { Component } from 'react'
import { CheckboxGroup } from 'reusable-react-components'

class About extends Component {
  render () {
    return (
      <div>
        it's my About
        <CheckboxGroup id='checkbox' options={[1, 2, 3]} active={[]} onChange={(value) => console.log(value)} />
      </div>
    )
  }
}

export default About
