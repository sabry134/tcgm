import { FormComponnent } from "../FormComponnent";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { createGameRequest } from "../../Api/gamesRequest";

export class GamePicker extends FormComponnent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      cardTypes: [], // Store fetched Data
    };
  }

  componentDidMount() {
    this.fetchType()
    const currentCard = localStorage.getItem("currentEditedCard")
    if (currentCard) {
      this.setState({ inputValue: JSON.parse(currentCard).card.game_id })
    }
  }

  fetchType = () => {
    try {
      createGameRequest().then((data) => {
        this.setState({ cardTypes: data });
      })
    } catch (error) {
      console.log(error);
    }
  }

  handleChange = (event) => {
    const newValue = event.target.value;

    this.setState({ inputValue: newValue });
    this.updateJsonFile(newValue.toString());
  };

  render() {
    return (
      <FormControl fullWidth>
        <InputLabel id="card-type-picke-label"></InputLabel>
        <Select
          style={{ backgroundColor: 'white' }}
          labelId="card-type-picke-label"
          id="card-type-picker"
          value={this.state.inputValue}
          label="Type"
          onChange={this.handleChange}
          onOpen={this.fetchType}
        >
          {this.state.cardTypes.length > 0 ? (
            this.state.cardTypes.map((type, index) => (
              <MenuItem key={index} value={type.id}>
                {type.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>
    );
  }
}