import Axios from "axios";

const BASEURL = "bsbucla-chatsocket-production.up.railway.app";

async function queryCoursePrefix(jwt, prefix) {
  const endpoint = BASEURL + "/getCoursesByPrefix";
  const query = endpoint + "?prefix=" + prefix;
  const config = {
    headers: {
      "Authorization": 'Bearer ' + jwt,
      "Content-Type": "application/json",
    },
  };
  const courses = await Axios.get(query, config);

  return courses.data;
}

async function queryCourseFromId(jwt, courseId) {
    const endpoint = BASEURL + '/getCourseById';
    const query = endpoint + '?id=' + courseId;
    const config = {
        headers: {
            "Authorization": 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.get(query, config);

    return group.data;
}

async function queryGroupsFromCourseId(jwt, courseId) {
    const endpoint = BASEURL + '/getGroupsByCourseId';
    const query = endpoint + '?id=' + courseId;
    const config = {
        headers: {
            "Authorization": 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        }
    }
    const groups = await Axios.get(query, config);

    return groups.data;
}

async function queryGroupFromId(jwt, groupId) {
    const endpoint = BASEURL + '/getGroupById';
    const query = endpoint + '?id=' + groupId;
    const config = {
        headers: {
            "Authorization": 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.get(query, config);

    return group.data;
}

async function joinGroupById(jwt, groupId) {
    const endpoint = BASEURL + '/joinGroupById';
    const query = endpoint + '?id=' + groupId;
    const config = {
        headers: {
            "Authorization": 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.patch(query, config);

    return group.data;
}

async function leaveGroupById(jwt, groupId) {
    const endpoint = BASEURL + '/leaveGroupById';
    const query = endpoint + '?id=' + groupId;
    const config = {
        headers: {
            "Authorization": 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.patch(query, config);

    return group.data;
}

async function createGroup(jwt, name, courseId, maxMembers=0) {
    const endpoint = BASEURL + '/createGroup';
    const query = endpoint + '?name=' + name + '&courseId=' + courseId + '&maxMembers=' + maxMembers;
    const config = {
        headers: {
            "Authorization": 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        }
    }
    const group = await Axios.post(query, config);

    return group.data;
}

async function getUserProfile(jwt) {
    const endpoint = BASEURL + '/getUser';
    const config = {
        headers: {
            "Authorization": 'Bearer ' + jwt,
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
