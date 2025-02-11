import { TextField } from "@mui/material";
import { FormComponnent } from "../FormComponnent";

export class CustomInput extends FormComponnent {
    render() {
        return (
            <TextField
                style={{ backgroundColor: 'white' }}
                id="standard-basic"
                variant="standard"
                value={this.state.inputValue}
                onChange={this.handleChange}
            />
        );
    }
}