import { Component } from "react";

export class TCGMCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: {
            }
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
        const data = JSON.parse(storedData).card
        if (storedData) {
            this.setState({ cardData: data });
        }
    };

    render() {

        return (
            <div style={mainContainer}>
                <div style={mainCardBorder}>
                    <div style={cardNameContainer}>
                        <p style={cardName}>
                            {this.state.cardData.name}
                        </p>
                    </div>
                    <div style={cardImageContainer}>
                        <img src={this.state.cardData.image} alt="Card" style={cardImage} />
                    </div>
                    <div style={cardTextContainer}>
                        <p style={cardText}>
                            {this.state.cardData.text}
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

    width: "clamp(250px, 30%, 400px)", // Responsive width
    maxWidth: "90vw", // Responsive width

    height: "auto", // Responsive height
    minHeight: "150px", // Minimum height
    maxHeight: "500px", // Maximum height

    margin: "auto", // Center the container
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0"
}

const mainCardBorder = {
    display: "flex",
    flexDirection: "column", // Ensure column direction
    backgroundColor: "#FFF", // White background
    width: "100%", // Portrait rectangle width
    height: "100%", // Portrait rectangle height
    borderRadius: "10px", // Rounded corners
    boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" // Drop shadow
}

const cardNameContainer = {
    width: "100%", // Portrait rectangle width
    height: "10%", // Portrait rectangle height
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    backgroundColor: "#000", // Black background
    borderRadius: "10px 10px 0 0" // Rounded top corners
}

const cardName = {
    color: "#FFF", // White text
    paddingLeft: "10%", // Add padding
    fontWeight: "bold", // Bold text
    fontSize: "1.1em", // Larger text
}

const cardImageContainer = {
    width: "100%", // Portrait rectangle width
    height: "50%", // Portrait rectangle height
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
}

const cardImage = {
    width: "100%",
    height: "100%",
}

const cardTextContainer = {
    width: "100%", // Portrait rectangle width
    height: "40%", // Portrait rectangle height
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    backgroundColor: "#000", // Black background
    borderRadius: "0 0 10px 10px", // Rounded bottom corners
}

const cardText = {
    color: "#FFF", // White text
    margin: "0", // Remove default margin
    paddingLeft: "5%", // Add padding
    paddingTop: "5%", // Add padding
}