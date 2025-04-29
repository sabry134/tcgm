import { Component } from 'react'
import './TCGMButton.css'

export class TCGMButton extends Component {
  render () {
    return (
      <div {...this.props} className='tcgmButton'>
        {this.props.children}
      </div>
    )
  }
}
