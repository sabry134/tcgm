import React, { Component, createRef } from 'react'
import { FormComponnent } from '../FormComponnent'
import jscolor from '@eastdesire/jscolor'
import shallowEqual from 'shallowequal'

export class ColorPicker extends FormComponnent {
  constructor (props) {
    super(props)
    this.colorInputRef = createRef()
    this.jsColorInstance = null
  }

  getInitialValue () {
    try {
      const storedData = localStorage.getItem(
        this.props.localStorageName ?? 'currentEditedCard'
      )
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        const value = this.getValueByPath(parsedData, this.props.name)
        // Return the array value or default color array
        return value || [0, 0, 52, 1]
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
    return [0, 0, 52, 1] // Default color as array
  }

  componentDidMount () {
    // First set the initial value
    this.componentDidMountHandle()

    // Initialize jsColor after state is set
    setTimeout(() => {
      if (!this.jsColorInstance && this.colorInputRef.current) {
        this.jsColorInstance = new jscolor(this.colorInputRef.current, {
          format: 'rgba',
          alpha: true,
          onChange: this.handleChange,
          onInput: this.handleChange
        })

        // Set initial color from state
        if (this.state.inputValue && Array.isArray(this.state.inputValue)) {
          const [r, g, b, a = 1] = this.state.inputValue
          this.jsColorInstance.fromRGBA(r, g, b, a)
        }
      }
    }, 0)
  }

  componentDidUpdate (prevProps, prevState) {
    // Update jsColor when state changes externally
    if (
      this.jsColorInstance &&
      this.state.inputValue &&
      Array.isArray(this.state.inputValue) &&
      !shallowEqual(prevState.inputValue, this.state.inputValue)
    ) {
      const [r, g, b, a = 1] = this.state.inputValue
      this.jsColorInstance.fromRGBA(r, g, b, a)
    }
  }

  componentWillUnmount () {
    // Clean up jsColor instance
    if (this.jsColorInstance) {
      this.jsColorInstance.hide()
    }
  }

  handleChange = event => {
    // Get RGBA values from jsColor
    if (this.jsColorInstance && this.jsColorInstance.channels) {
      const colorArray = [
        Math.round(this.jsColorInstance.channels.r),
        Math.round(this.jsColorInstance.channels.g),
        Math.round(this.jsColorInstance.channels.b),
        this.jsColorInstance.channels.a
      ]

      // Update state
      this.setState({ inputValue: colorArray })

      // Update your JSON file
      this.updateJsonFile(colorArray)
    }
  }

  render () {
    const colorValue =
      this.state.inputValue && Array.isArray(this.state.inputValue)
        ? this.state.inputValue
        : [0, 0, 52, 1]

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          ref={this.colorInputRef}
          type='text'
          style={{
            width: '150px',
            height: '40px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '5px'
          }}
          readOnly
          value={`rgba(${colorValue.join(',')})`}
        />
      </div>
    )
  }
}
