// checking if the current route is the active route, if it is return "active", if not ""
function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? "active" : "";
}

module.exports = { isActiveRoute };
