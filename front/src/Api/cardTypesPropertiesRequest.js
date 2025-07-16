import { baseRequest } from "./baseRequest";

// Get all types properties
export async function getCardTypesPropertiesRequest() {
    const response = await baseRequest('cardTypeProperties', 'GET')

    return response;
}

// data should look like this
// cardTypeProperty: {
//      "pos_y" : 0
//      "pos_x": 0
// }
// right now everything is a string but it will change
export async function saveNewCardTypesPropertiesRequest(data) {
    let tmpData = {
        ...data,
        value: data.type === 'number' ? toString(data.value) : data.value,
        font_color: data.font_color.toString(),
        border_color: data.border_color.toString(),
        background_color: data.background_color.toString(),
        variant: "variant" //TODO(): add variant capacity
    }
    delete data.inserted_at
    delete data.updated_at
    return await baseRequest('cardTypeProperties', 'POST', { cardTypeProperty: tmpData }, {
        'Content-Type': 'application/json'
    });
}

// Get all type Properties for one type
// typeId: Id of the card type
export async function getCardTypesPropertiesbyTypeRequest(typeId) {
    return await baseRequest('cardTypeProperties/cardType/' + typeId, 'GET').then((response) => {
        try {
            return response.map((property, index) => {
                if (property.type === 'number') {
                    return {
                        ...property,
                        value: parseInt(property.value),
                        border_color: property.border_color.split(','),
                        font_color: property.font_color.split(','),
                        background_color: property.background_color.split(',')
                    }
                }
                return {
                    ...property,
                    border_color: property.border_color.split(','),
                    font_color: property.font_color.split(','),
                    background_color: property.background_color.split(',')
                }
            })
        } catch (error) {
            console.log(error)
            return []
        }
    });
}

// Get one property from card type
// typeId: Id of the card type
// propertyName: name of the retrived property
export async function getCardTypePropertyRequest(typeId, propertyName) {
    return await baseRequest('cardTypeProperties/carType' + typeId + '/property/' + propertyName, 'GET');
}

// Get card property by its id
export async function getCardTypesPropertyByIdRequest(propertyId) {
    return await baseRequest('cardTypeProperties/' + propertyId, 'GET');
}

// Edit a card Property
export async function editCardTypesPropertyByIdRequest(data, propertyId) {
    let tmpData = {
        ...data, font_color: data.font_color.toString(),
        value: data.type === "number" ? `${data.value}` : data.value,
        border_color: data.border_color.toString(),
        background_color: data.background_color.toString(),
        variant: "variant" //TODO(): add variant capacity
    }
    delete data.inserted_at
    delete data.updated_at
    return await baseRequest('cardTypeProperties/' + propertyId, 'PUT', { cardTypeProperty: tmpData }, {
        'Content-Type': 'application/json'
    });
}