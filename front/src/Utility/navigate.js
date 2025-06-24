import { ROUTES } from "../Routes/routes";

export function unselectGame(navigate) {
  if (localStorage.getItem("gameSelected")) {
    localStorage.setItem("gameSelected", false);
  }
  navigate(ROUTES.HOME);
}