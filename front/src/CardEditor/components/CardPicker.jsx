import { FormComponnent } from "../../CustomizationForm/FormComponnent";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export class CardPicker extends FormComponnent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 0,
      cards: [], // Store fetched data
    };
    this.baseApiUrl = process.env.REACT_APP_API_URL;
    if (!this.baseApiUrl) {
      this.baseApiUrl = "http://localhost:4000/api/"
    }
  }

  componentDidMount() {
    this.fetchType()
  }


  fetchType = () => {
    const apiUrl = this.baseApiUrl + 'cards';

    fetch(apiUrl, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ cards: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange = (event) => {
    const newValue = event.target.value;
    this.setState({ inputValue: newValue });
    localStorage.setItem("editIdPick", newValue.toString())
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
          defaultValue={0}
          label="Type"
          onChange={this.handleChange}
          onOpen={this.fetchType}
        >
          <MenuItem key={"new"} value={0}>➕ New Card </MenuItem>
          {this.state.cards.length > 0 ? (
            this.state.cards.map((card, index) => (
              <MenuItem key={index} value={card.id}>
                {card.name}
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