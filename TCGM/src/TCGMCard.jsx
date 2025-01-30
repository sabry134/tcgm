import { Component } from "react";
import ExampleCaster from "./data/ExampleCaster.json";

export class TCGMCard extends Component {
    render() {
        return (
            <div style={mainContainer}>
                <div style={mainCardBorder}>
                    <div style={cardNameContainer}>
                        <p style={cardName}>
                            {ExampleCaster.Name}
                        </p>
                    </div>
                    <div style={cardImageContainer}>
                        <img src={`${ExampleCaster.Image}`} alt="Example Caster" style={cardImage} />
                    </div>
                    {/*<div style={cardTextContainer}>*/}
                    {/*    <p style={cardText}>{ExampleCaster.Text}</p>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

const mainContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "10%", // Portrait rectangle width
    height: "30%", // Portrait rectangle height
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
    margin: "0", // Remove default margin
    paddingLeft: "5%" // Add padding
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