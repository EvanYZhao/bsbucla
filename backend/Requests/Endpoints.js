const { app } = require('./Server');
const { verifyRequest, verifyRequestQuery, verifyRequestBody } = require('./utility');
const { UserModel, CourseModel, GroupModel, ChatroomModel } = require('../Models');

app.get('/getCourseById', async (req, res) => {
  // Verify request
  const user = await verifyRequestQuery(req, res, ['id']);
  if (!user) return false;

  // Fetch Course
  const course = await CourseModel.findById(req.query.id, { __v: 0 })
    .then(response => response)
    .catch(null);

  // Course with ID does not exist
  if (!course) {
    res.status(400);
    res.send('Bad Request: invalid course id');
    return;
  }

  res.status(200);
  res.send(course);
});

app.get('/getCoursesByPrefix', async (req, res) => {
  // Verify request
  const user = await verifyRequestQuery(req, res, ['prefix']);
  if (!user) return false;

  // Fetch Courses
  const prefix = `(^| )${req.query.prefix}`;
  const courses = await CourseModel.find({
      '$or': [
        { 'subjectLabel': { $regex: prefix, $options: 'i'} },
        { 'number': { $regex: prefix, $options: 'i'} },
        { 'name': { $regex: prefix, $options: 'i'} },
      ]
    }, { __v: 0 })
    .then(response => response)
    .catch(e => null);

  if (!courses) {
    res.status(400);
    res.send('Bad Request');
    return;
  }

  res.status(200);
  res.send(courses);
});

app.get('/getGroupById', async (req, res) => {
  // Verify request
  const user = await verifyRequestQuery(req, res, ['id']);
  if (!user) return false;

  const group = await GroupModel.findById(req.query.id, {__v: 0, created: 0})
    .then(response => response)
    .catch(() => null);

  if (!group) {
    res.status(400);
    res.send('Bad Request: invalid group id');
    return;
  }

  const memberList = [];
  const limit = group.members.includes(user.firebaseId) ? {} : { email: 0, picture: 0, major: 0, firebaseId: 0 };
  for (const memberId of group.members) {
    const member = await UserModel.findOne({ firebaseId: memberId }, {...limit, _id: 0, created: 0, groups: 0, __v: 0});
    memberList.push(member);
  }

  delete group._doc.members;
  group._doc.members = memberList;
  

  res.status(200);
  res.send(group._doc);
});

app.get('/getGroupsByCourseId', async (req, res) => {
  // Verify request
  const user = await verifyRequestQuery(req, res, ['id']);
  if (!user) return false;

  const groups = await GroupModel.find({ courseId: req.query.id }, {__v: 0, created: 0, chatroomId: 0})
    .then(response => {
      if (response.length === 0)
        return [];
      return response;
    })
    .catch(() => null);

  if (!groups) {
    res.status(400);
    res.send('Bad Request: invalid course id');
    return;
  }

  const groupsList = []
  for (const group of groups) {
    const groupData = {...(group._doc)};
    groupData.memberCount = groupData.members.length;
    delete groupData.members;
    groupsList.push(groupData);
  }

  res.status(200);
  res.send(groupsList);
});

app.get('/getUser', async (req, res) => {
  // Verify request
  const user = await verifyRequest(req, res);
  if (!user) return false;

  const userData = {...(user._doc)};

  delete userData._id;
  delete userData.firebaseId;
  delete userData.__v;

  res.status(200);
  res.send(user);
});

app.post('/createGroup', async (req, res) => {
  // Verify request
  const verify = await verifyRequestBody(req, res, GroupModel, ['name']);
  if (!verify) return false;
  const [user, groupDoc] = verify;

  // Verify name
  if (req.body.name === '') {
    res.status(400);
    res.send('Bad Request: invalid group name');
    return;
  }

  // Verify course exists
  const associatedCourse = await CourseModel.findById(req.body.courseId);
  if (!associatedCourse) {
    res.status(400);
    res.send('Bad Request: invalid course id');
    return;
  }

  // Link User to Group
  groupDoc.set('members', [user.firebaseId]);
  const group = await groupDoc.save();

  // Create associated Chatroom
  const room = new ChatroomModel({
    groupId: group._id
  });
  await room.save();

  // Link Chatroom to Group
  groupDoc.set('chatroomId', room._id);
  await groupDoc.save();

  // Link Group to User
  user.groups.push(group._id);
  await user.save();

  res.status(201);
  res.send({ groupId: group._id });
});

app.patch('/joinGroupById', async (req, res) => {
  // Verify request
  const user = await verifyRequestQuery(req, res, ['id']);
  if (!user) return false;

  const group = await GroupModel.findById(req.query.id)
    .then((response) => response)
    .catch(() => null);

  if (!group) {
    res.status(400);
    res.send('Bad Request: invalid group ID');
    return;
  }

  // Check if user already in group
  if (group.members.includes(user.firebaseId)) {
    res.status(403);
    res.send('Forbidden: user already in group');
    return;
  }

  // Check if group is full
  if (group.members.length === group.maxMembers) {
    res.status(403);
    res.send('Forbidden: group is full');
    return;
  }

  group.members.push(user.firebaseId);
  user.groups.push(group._id);

  await group.save();
  await user.save();

  res.status(201);
  res.send('User added');
});

app.patch('/leaveGroupById', async (req, res) => {
  // Verify request
  const user = await verifyRequestQuery(req, res, ['id']);
  if (!user) return false;

  const group = await GroupModel.findById(req.query.id)
    .then(response => response)
    .catch(() => null);

  if (!group) {
    res.status(400);
    res.send('Bad Request: invalid group ID');
    return;
  }

  // Check if user in group
  if (!group.members.includes(user.firebaseId)) {
    res.status(403);
    res.send('Forbidden: user not in group');
    return;
  }

  // Update user's groups
  user.groups = user.groups.filter(group => group != group._id);
  await user.save();

  // Update group's users
  group.members = group.members.filter(member => member != user.firebaseId);
  await group.save();

  // Delete group and chatroom if no more people
  if (group.members.length === 1) {
    await ChatroomModel.deleteOne({ _id: group.chatroomId });
    group.deleteOne();
  } else {
    group.members = group.members.filter(member => member !== user.firebaseId);
    await group.save();
  }

  res.status(201);
  res.send('User removed');
});