import React, { Component } from "react";
import { Grid2, Box } from "@mui/material";


export class CommunityGamePicker extends Component {

    constructor(props) {
        super(props)
        this.state = {
            "gameList": []
        }
    }

    componentDidMount() {
        this.setState({ "gameList": this.getGames() })
    }

    getGames() {
        const apiUrl = this.baseApiUrl + 'games';

        fetch(apiUrl, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                };
                return response.json()

            })
            .then((data) => {
                return data
            })
            .catch((error) => {
                console.log(error);
                return {}
            });
    }

    render() {
        return (
            <Box>
                <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {
                        this.state.gameList ?
                            this.state.gameList.map((game, index) => (
                                <  ></>
                            ))
                            : <Box> Loading ... </Box>
                    }
                </Grid2>
            </Box>
        )
    }
}