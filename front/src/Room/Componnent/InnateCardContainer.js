import '../Room.css'

const InnateCardsContainer = ({ opponent }) => {
    return <div className={"container innateCard" + (opponent ? " opponent" : "")}>
    </div>
}

export default InnateCardsContainer