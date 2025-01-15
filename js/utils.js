function addNumbers(a,  b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return NaN; // Retourne NaN si l'un des arguments n'est pas un nombre
    }
    return a + b;
}

module.exports = addNumbers;