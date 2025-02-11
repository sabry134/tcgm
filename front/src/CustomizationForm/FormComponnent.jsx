import { Component } from "react";

export class FormComponnent extends Component {
    constructor(props) {
        super(props);
        this.state = { inputValue: "" };
    }

    getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
    setValueByPath(obj, path, value) {
        const parts = path.split('.');
        const lastPart = parts.pop();
        const lastObj = parts.reduce((acc, part) => acc[part], obj);
        lastObj[lastPart] = value; // Set the new value
    }


    componentDidMount() {
        this.setState({ inputValue: this.getValueByPath(JSON.parse(localStorage.getItem("currentEditedCard")), this.props.name) });
    }


    // Handle input change and update state
    handleChange = (event) => {
        const newValue = event.target.value;
        this.setState({ inputValue: newValue });

        // Send update to backend (or localStorage for temporary saving)
        this.updateJsonFile(newValue);
    };

    // Simulating JSON file update (this should be an API request)
    updateJsonFile = (newValue) => {
        const storedCard = localStorage.getItem("currentEditedCard");
        const parsedCard = JSON.parse(storedCard)
        this.setValueByPath(parsedCard, this.props.name, newValue)
        localStorage.setItem("currentEditedCard", JSON.stringify(parsedCard))
        window.dispatchEvent(new Event('storage'))
    };
}