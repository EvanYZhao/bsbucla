const Axios = require('axios');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(express.json());
app.use(cors());

const BASEURL = 'https://us-west-2.aws.data.mongodb-api.com/app/cs35l-project-backend-upvkk/endpoint'

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

// Request to /getCoursePrefix
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
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

// Request to /getCourseFromId
app.get('/getCourseFromId', (req, res) => {
    const endpoint = BASEURL + '/getCourseFromId';
    
    // Bad request
    if (!(req.query.id && Object.keys(req.query).length === 1 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }
    const updatedEndpoint = queryHandler(endpoint, req.query);

    const config = { headers: {jwttokenstring: req.headers.jwttokenstring}};

    Axios.get(updatedEndpoint, config)
    .then((response) => {
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

// Request to /getGroupsFromCourseId
app.get('/getGroupsFromCourseId', (req, res) => {
    const endpoint = BASEURL + '/getGroupsFromCourseId';
    
    // Bad request
    if (!(req.query.id && Object.keys(req.query).length === 1 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }
    const updatedEndpoint = queryHandler(endpoint, req.query);

    const config = { headers: {jwttokenstring: req.headers.jwttokenstring}};

    Axios.get(updatedEndpoint, config)
    .then((response) => {
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

// Request to /getGroupFromId
app.get('/getGroupFromId', (req, res) => {
    const endpoint = BASEURL + '/getGroupFromId';
    
    // Bad request
    if (!(req.query.id && Object.keys(req.query).length === 1 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }
    const updatedEndpoint = queryHandler(endpoint, req.query);

    const config = { headers: {jwttokenstring: req.headers.jwttokenstring}};

    Axios.get(updatedEndpoint, config)
    .then((response) => {
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

// Request to /joinGroupById
app.get('/joinGroupById', (req, res) => {
    const endpoint = BASEURL + '/joinGroupById';
    
    // Bad request
    if (!(req.query.id && Object.keys(req.query).length === 1 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }
    const updatedEndpoint = queryHandler(endpoint, req.query);

    const config = { headers: {jwtTokenString: req.headers.jwttokenstring}};

    Axios.get(updatedEndpoint, config)
    .then((response) => {
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

// Request to /leaveGroupById
app.get('/leaveGroupById', (req, res) => {
    const endpoint = BASEURL + '/leaveGroupById';
    
    // Bad request
    if (!(req.query.id && Object.keys(req.query).length === 1 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }
    const updatedEndpoint = queryHandler(endpoint, req.query);

    const config = { headers: {jwttokenstring: req.headers.jwttokenstring}};

    Axios.get(updatedEndpoint, config)
    .then((response) => {
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

// Request to /createGroup
app.get('/createGroup', (req, res) => {
    const endpoint = BASEURL + '/createGroup';
    
    // Bad request
    if (!(req.query.name && req.query.courseId && req.query.maxMembers && Object.keys(req.query).length === 3 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }
    const updatedEndpoint = queryHandler(endpoint, req.query);

    const config = { headers: {jwttokenstring: req.headers.jwttokenstring}};

    Axios.get(updatedEndpoint, config)
    .then((response) => {
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

// Request to /getUserProfile
app.get('/getUserProfile', (req, res) => {
    const endpoint = BASEURL + '/getUserProfile';
    
    // Bad request
    if (!(Object.keys(req.query).length === 0 && req.headers.jwttokenstring)) {
        res.status(400);
        res.send('400 Bad Request');
        return;
    }

    const config = { headers: {jwttokenstring: req.headers.jwttokenstring}};

    Axios.get(endpoint, config)
    .then((response) => {
        res.status(response.status);
        res.json(response.data);
    })
    .catch((err) => {
        res.status(err.response.status);
        res.json(err.response.data);
    });
});

app.listen(3001, () => {
    console.log('Server up.');
});