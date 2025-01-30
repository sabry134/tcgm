import {Component} from "react";
import ExampleCaster from "./assets/ExampleCaster.json";

export class TCGMCard extends Component {
    render() {
        return (
            <div style={mainContainer}>
                <div style={mainCardBorder}>
                    <div style={cardNameContainer}>
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
    backgroundColor: "#000", // Pitch black background
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF", // White background
    width: "100%", // Portrait rectangle width
    height: "100%", // Portrait rectangle height
    borderRadius: "10px", // Rounded corners
    boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)" // Drop shadow
}

const cardNameContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Portrait rectangle width
    height: "10%", // Portrait rectangle height
    backgroundColor: "#000", // Black background
    borderRadius: "10px 10px 0 0" // Rounded top corners
}

// const cardName = {
//     color: "#000", // Black text
//     fontSize: "1.5em", // 1.5 times the default font size
//     fontWeight: "bold", // Bold text
//     marginBottom: "100px" // 10px margin below the text
// }