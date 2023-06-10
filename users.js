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
  return user;
};

const deleteUser=(id)=>{
 let index= users.findIndex(user=>user.id==id)
 
 if (index!=-1) {
  console.log(index);
  users.splice(index,1)
 }
}
module.exports = { addUser, getUser, deleteUser };
