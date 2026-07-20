import { NavLink } from "./ui";

export function NavBar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/rooms">Room</NavLink>
      {/* @ts-expect-error */}
      <NavLink to="/404">404</NavLink>
    </nav>
  );
}
