
const fecthCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/region/euro?fields=name,flags');

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;

     }catch (error) {
        console.error('Error fetching countries:', error);
    }

}

export { fecthCountries };