const Axios = require('axios');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(express.json());
app.use(cors());

const BASEURL = 'https://us-west-2.aws.data.mongodb-api.com/app/application-0-sroti/endpoint'

/**
 * Returns an HTTP with appended query params
 * @param {String} endpoint HTTP endpoint
 * @param {Object} queries `{ queryKey: queryValue, ... }` object
 * @returns {String} New HTTP endpoint with queries
 */
function queryHandler(endpoint, queries) {
    let updated = endpoint + '?';
    for (const query in queries)
        updated += query + '=' + queries[query] + '&';
    updated = updated.replace(/&$/g, '');
    return updated;
}

// GET Request to /getCoursePrefix
app.get('/getCoursePrefix', (req, res) => {
    const endpoint = BASEURL + '/getCoursePrefix';
    
    // Bad request
    if (!(req.query.prefix && Object.keys(req.query).length === 1 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }
    const updatedEndpoint = queryHandler(endpoint, req.query);

    const config = { headers: {jwttokenstring: req.headers.jwttokenstring}};

    Axios.get(updatedEndpoint, config)
    .then((response) => {
        res.json(response.data);
    })
    .catch((err) => {
        res.json(err);
    })
});


app.listen(3001, () => {
    console.log('Server up.');
});