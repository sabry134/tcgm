import { TextField } from "@mui/material";
import { FormComponnent } from "../FormComponnent";

export class NumberInput extends FormComponnent {
    render() {
        return (
            <TextField
                id="standard-number"
                label="Number"
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