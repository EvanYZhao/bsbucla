import Axios from 'axios';

async function queryCoursePrefix(prefix) {
    const courses = await Axios.get('https://us-west-2.aws.data.mongodb-api.com/app/application-0-sroti/endpoint/getPrefix?prefix=' + prefix);
    return courses.data;
}

export {
    queryCoursePrefix
}