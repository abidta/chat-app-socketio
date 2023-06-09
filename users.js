const users = [];

function addUser(id, name) {
  let userExist = users.find(
    (user) => user.name.trim().toLowerCase() === name.trim().toLowerCase());

  if (userExist) return { error: "user already exist on this name" };
  if (!name) return { error: "name required" };
  let user = { id, name };
  users.push(user);
  return { user };
}

const getUser = (id) => {
  let user = users.find((user) => user.id == id);
  console.log(users, "get");
  return user;
};
module.exports = { addUser, getUser };
