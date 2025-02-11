import { TextField } from "@mui/material";
import { FormComponnent } from "../FormComponnent";

export class NumberInput extends FormComponnent {
    render() {
        return (
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
                value={this.state.inputValue}
                onChange={this.handleChange}
            />
        );
    }
}