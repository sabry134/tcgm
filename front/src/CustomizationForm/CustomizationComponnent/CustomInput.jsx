import { TextField } from "@mui/material";
import { FormComponnent } from "../FormComponnent";

export class CustomInput extends FormComponnent {
    render() {
        return (
            <TextField
                id="standard-basic"
                label="Standard"
                variant="standard"
                value={this.state.inputValue}
                onChange={this.handleChange}
            />
        );
    }
}