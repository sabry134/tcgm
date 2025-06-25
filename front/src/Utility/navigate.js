import { ROUTES } from "../Routes/routes";

/**
 * Function to unselect a game and navigate to the home route.
 *
 * @param navigate - The navigate function from react-router-dom to change routes.
 * @returns {void}
 */

export function unselectGame(navigate) {
  if (localStorage.getItem("gameSelected")) {
    localStorage.setItem("gameSelected", false);
  }
  navigate(ROUTES.HOME);
}