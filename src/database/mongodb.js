import Axios from 'axios';

async function queryCoursePrefix(prefix) {
    const courses = await Axios.get('http://localhost:3001/getPrefix?prefix=' + prefix);
    return courses.data;
}

export {
    queryCoursePrefix
}