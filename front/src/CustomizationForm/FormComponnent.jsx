import { Component } from 'react'
import shallowEqual from 'shallowequal'

export class FormComponnent extends Component {
  constructor (props) {
    super(props)
    this.state = { inputValue: this.getInitialValue() }
  }

  getInitialValue () {
    try {
      const storedData = localStorage.getItem(
        this.props.localStorageName ?? 'currentEditedCard'
      )
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        return this.getValueByPath(parsedData, this.props.name)
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
    return ''
  }

  getValueByPath (obj, path) {
    if (!path || !obj) return ''
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  setValueByPath (obj, path, value) {
    const parts = path.split('.')
    const lastPart = parts.pop()
    const lastObj = parts.reduce((acc, part) => acc[part], obj)
    lastObj[lastPart] = value
  }

  componentDidMountHandle () {
    const currentValue = this.getInitialValue()
    if (!shallowEqual(this.state.inputValue, currentValue)) {
      this.setState({ inputValue: currentValue })
    }
  }

  componentDidMount () {
    this.componentDidMountHandle()
  }

  // Remove componentDidUpdate to prevent infinite loops
  // The component will re-render when props change naturally

  shouldComponentUpdate (nextProps, nextState) {
    // Component should update if state or props have changed
    return (
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.props, nextProps)
    )
  }

  // Handle input change and update state
  handleChange = event => {
    const newValue = event.target.value
    this.setState({ inputValue: newValue })
    this.updateJsonFile(newValue)
  }

  // Simulating JSON file update
  updateJsonFile = newValue => {
    try {
      const storedCard = localStorage.getItem(
        this.props.localStorageName ?? 'currentEditedCard'
      )
      const parsedCard = JSON.parse(storedCard)
      this.setValueByPath(parsedCard, this.props.name, newValue)
      localStorage.setItem(
        this.props.localStorageName ?? 'currentEditedCard',
        JSON.stringify(parsedCard)
      )
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error('Error updating localStorage:', error)
    }
  }
}
