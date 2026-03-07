const fecthCountries = async (region = 'euro') => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/${region}?fields=name,flags`);

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;

     }catch (error) {
        console.error('Error fetching countries:', error);
    }

}

const fetchCountryByName = async (countryName) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // La API devuelve un array, retornamos el primer elemento
        return data[0];

    } catch (error) {
        console.error('Error fetching country details:', error);
        throw error;
    }
}

export { fecthCountries, fetchCountryByName };