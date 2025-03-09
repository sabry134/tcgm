import { baseRequest } from "./baseRequest";


// Get all types properties
export async function getCardTypesPropertiesRequest() {
    return await baseRequest('cardTypeProperties', 'GET');
}


// data should look like this
// cardTypeProperty: {
//      "pos_y" : 0
//      "pos_x": 0
// }
// right now everything is a string but it will change
export async function saveNewCardTypesPropertiesRequest(data) {
    return await baseRequest('cardTypeProperties', 'POST', data, {
        'Content-Type': 'application/json'
    });
}

// Get all type Properties for one type
// typeId: Id of the card type
export async function getCardTypesPropertiesbyTypeRequest(typeId) {
    return await baseRequest('cardTypeProperties/cardType/' + typeId, 'GET');
}

// Get one property from card type
// typeId: Id of the card type
// propertyName: name of the retrived property
export async function getCardTypePropertyRequest(typeId, propertyName) {
    return await baseRequest('cardTypeProperties/carDype' + typeId + '/property/' + propertyName, 'GET');
}

// Get card property by its id
export async function getCardTypesPropertyByIdRequest(propertyId) {
    return await baseRequest('cardTypeProperties/' + propertyId, 'GET');
}

// Edit a card Property
export async function editCardTypesPropertyByIdRequest(data, propertyId) {
    return await baseRequest('cardTypeProperties/' + propertyId, 'PUT', data, {
        'Content-Type': 'application/json'
    });
}