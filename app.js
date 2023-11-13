// Main libs
import express from 'express';
import fetch from 'node-fetch';

// App
const app = express();

// Configs
const erAPIKey = '99d703719d35d417a9adbe93';

// Fonction de vérification des devises
async function areCurrenciesValid(currencyFrom, currencyTo) {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${erAPIKey}/codes`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error_type);
        }

        const validCurrencies = data.supported_codes.map(code => code[0]);
        return validCurrencies.includes(currencyFrom) && validCurrencies.includes(currencyTo);
    } catch (error) {
        return false;
    }
}

app.get('/convert/:from/:to/:amount', async (req, res) => {
    try {
        const currencyFrom = req.params.from;
        const currencyTo = req.params.to;
        const amount = req.params.amount;

        // Vérifier si les devises sont valides
        if (!(await areCurrenciesValid(currencyFrom, currencyTo))) {
            return res.status(400).json({ error: 'InvalidCurrencies' });
        }

        const response = await fetch(`https://v6.exchangerate-api.com/v6/${erAPIKey}/pair/${currencyFrom}/${currencyTo}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_type);
        }

        const convertedAmount = data.conversion_rate * amount;

        res.json({
            convertedAmount: convertedAmount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du taux de change !' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3081');
});
