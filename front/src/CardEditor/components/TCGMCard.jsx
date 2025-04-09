import { Component } from "react";

export class TCGMCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {}
    };
  }

  componentDidMount() {
    this.handleStorageChange({})

    window.addEventListener("storage", this.handleStorageChange);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
  }

  handleStorageChange = (event) => {
    const storedData = localStorage.getItem("currentEditedCard");
    if (storedData) {
      const data = JSON.parse(storedData).card
      console.log(data)
      if (storedData) {
        this.setState({ cardData: data });
      }
    }
  };

  render() {

    return (
      <div style={mainContainer}>
        <div style={mainCardBorder}>
          <div style={cardNameContainer}>
            <p style={cardName}>
              {this.state.cardData ? this.state.cardData.name : "Card Name"}
            </p>
          </div>
          <div style={cardImageContainer}>
            <img src={this.state.cardData ? this.state.cardData.image : "../images/iminyourwalls.png"} alt="Card"
                 style={cardImage}/>
          </div>
          <div style={cardTextContainer}>
            <p style={cardText}>
              {this.state.cardData ? this.state.cardData.text : "Card Text"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mainContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  width: "clamp(250px, 30%, 400px)",
  maxWidth: "90vw",

  height: "auto",
  minHeight: "150px",
  maxHeight: "500px",

  margin: "auto",
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0"
}

const mainCardBorder = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#FFF",
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)"
}

const cardNameContainer = {
  width: "100%",
  height: "10%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000",
  borderRadius: "10px 10px 0 0"
}

const cardName = {
  color: "#FFF",
  paddingLeft: "10%",
  fontWeight: "bold",
  fontSize: "1.1em",
}

const cardImageContainer = {
  width: "100%",
  height: "50%",
  justifyContent: "center",
  alignItems: "center",
}

const cardImage = {
  width: "100%",
  height: "100%",
}

const cardTextContainer = {
  width: "100%",
  height: "40%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000",
  borderRadius: "0 0 10px 10px",
}

const cardText = {
  color: "#FFF",
  margin: "0",
  paddingLeft: "5%",
  paddingTop: "5%",
}