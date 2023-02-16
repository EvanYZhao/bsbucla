import Axios from 'axios';

<<<<<<< Updated upstream
async function queryCoursePrefix(prefix) {
    const courses = await Axios.get('http://localhost:3001/getPrefix?prefix=' + prefix);
=======
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
>>>>>>> Stashed changes
    return courses.data;
}

export {
    queryCoursePrefix
}