import Axios from 'axios';

const BASEURL = 'http://localhost:3001'

async function queryCoursePrefix(prefix, jwt) {
    const endpoint = BASEURL + '/getCoursePrefix';
    const query = endpoint + '?prefix=' + prefix;
    const config = {
        headers: {
            jwttokenstring: jwt,
            'Content-Type': 'application/json'
        }
    }
    const courses = await Axios.get(query, config);
    
    return courses.data;
}

export {
    queryCoursePrefix
}