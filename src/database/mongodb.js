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

async function queryGroupsFromCourseId(courseId, jwt) {
    const endpoint = BASEURL + '/getGroupFromCourseId';
    const query = endpoint + '?id=' + courseId;
    const config = {
        headers: {
            jwttokenstring: jwt,
            'Content-Type': 'application/json'
        }
    }
    const groups = await Axios.get(query, config);

    return groups.data;
}

async function queryGroupFromGroupId(groupId, jwt) {
    const endpoint = BASEURL + '/getGroupFromId';
    const query = endpoint + '?id=' + groupId;
    const config = {
        headers: {
            jwttokenstring: jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.get(query, config);

    return group.data;
}

export {
    queryCoursePrefix,
    queryGroupsFromCourseId,
    queryGroupFromGroupId
}