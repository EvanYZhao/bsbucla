import Axios from "axios";

const BASEURL = "http://localhost:3001";

async function queryCoursePrefix(prefix, jwt) {
  const endpoint = BASEURL + "/getCoursePrefix";
  const query = endpoint + "?prefix=" + prefix;
  const config = {
    headers: {
      jwttokenstring: jwt,
      "Content-Type": "application/json",
    },
  };
  const courses = await Axios.get(query, config);

  return courses.data;
}

async function queryCourseFromId(courseId, jwt) {
    const endpoint = BASEURL + '/getCourseFromId';
    const query = endpoint + '?id=' + courseId;
    const config = {
        headers: {
            jwttokenstring: jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.get(query, config);

    return group.data;
}

async function queryGroupsFromCourseId(courseId, jwt) {
    const endpoint = BASEURL + '/getGroupsFromCourseId';
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

async function queryGroupFromId(groupId, jwt) {
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

async function joinGroupById(groupId, jwt) {
    const endpoint = BASEURL + '/joinGroupById';
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

async function leaveGroupById(groupId, jwt) {
    const endpoint = BASEURL + '/leaveGroupById';
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

async function createGroup(name, courseId, jwt) {
    const endpoint = BASEURL + '/createGroup';
    const query = endpoint + '?name=' + name + '&courseId=' + courseId;
    const config = {
        headers: {
            jwttokenstring: jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.get(query, config);

    return group.data;
}

async function getUserProfile(jwt) {
    const endpoint = BASEURL + '/getUserProfile';
    const config = {
        headers: {
            jwttokenstring: jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.get(endpoint, config);

    return group.data;
}

export {
    queryCoursePrefix,
    queryCourseFromId,
    queryGroupsFromCourseId,
    queryGroupFromId,
    joinGroupById,
    leaveGroupById,
    createGroup,
    getUserProfile
}
