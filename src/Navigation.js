import { Link } from "react-router-dom";

const Navigation = () => {
  return(
    <ul>
      <li>
        <Link to='/prijava'>Prijava</Link>
      </li>
      <li>
        <Link to='/registracija'>Registracija</Link>
      </li>
    </ul>
  )
}

export default Navigation;