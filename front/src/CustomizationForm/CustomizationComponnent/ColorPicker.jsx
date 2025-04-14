import { FormComponnent } from "../FormComponnent";
import { TextField } from "@mui/material";

export class ColorPicker extends FormComponnent {
  handleChange = (event, index) => {
    this.state.inputValue[index] = parseInt(event.target.value)
    this.setState({ inputValue: this.state.inputValue });
    this.updateJsonFile(this.state.inputValue);
  };

  render() {
    return (
      <div className="display: flex">
        <TextField
          style={{ backgroundColor: 'white' }}
          id="standard-number"
          type="number"
          variant="standard"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={this.state.inputValue[0]}
          onChange={(event) => this.handleChange(event, 0)}
        />
        <TextField
          style={{ backgroundColor: 'white' }}
          id="standard-number"
          type="number"
          variant="standard"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={this.state.inputValue[1]}
          onChange={(event) => this.handleChange(event, 1)}
        />
        <TextField
          style={{ backgroundColor: 'white' }}
          id="standard-number"
          type="number"
          variant="standard"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={this.state.inputValue[2]}
          onChange={(event) => this.handleChange(event, 2)}
        />
        <TextField
          style={{ backgroundColor: 'white' }}
          id="standard-number"
          type="number"
          variant="standard"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={this.state.inputValue[3]}
          onChange={(event) => this.handleChange(event, 3)}
        />
      </div>
    )
  }
}