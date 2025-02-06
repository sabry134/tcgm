import React, { Component } from "react";

import MainWindow from "./MainWindow"
import JsonToList from "./CustomisationList"
import text from "./card_example.json"


class CardEditor extends Component {
    constructor(props) {
        super(props);

        console.log(text.cards)

    }



    render = () => {
        return (
            <MainWindow />
        )
    }

}


export default CardEditor