import { NavLink } from "./ui";

export function NavBar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {/* @ts-expect-error */}
      <NavLink to="/404">404</NavLink>
    </nav>
  );
}
