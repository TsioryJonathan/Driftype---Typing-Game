import { getUser } from "../../../../utils/auth.js";
import { apiGet } from "../../../../utils/api.js";

const usernameField = document.querySelectorAll("#username");
const navUsername = document.querySelector("#nav_username");
const initial = document.querySelector("#initial");


const getUsernameNdEmail = async () => {
  if (!getUser()) {
    usernameField.forEach((field) => (field.innerText = "Guest"));
    initial.textContent = "G";
    navUsername.textContent = "Guest";
    return null;
  }

  const { id } = getUser();

  const data = await apiGet(`/user/${id}`);
  if (!data) throw new Error("User not found");
  const username = data[0].username;
  navUsername.textContent = username;
  usernameField.forEach((field) => (field.innerText = username));
  initial.textContent = username[0];
};

getUsernameNdEmail();
