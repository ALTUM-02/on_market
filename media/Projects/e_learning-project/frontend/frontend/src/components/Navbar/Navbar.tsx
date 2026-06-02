import {
  Link,
} from "react-router-dom";

const Navbar = () => {

  return (

    <nav
      className="
      bg-slate-900
      text-white
      px-8
      py-4
      flex
      justify-between
      items-center
      "
    >

      <h1
        className="
        text-2xl
        font-bold
        "
      >
        CyberSafe Learn
      </h1>

      <div className="space-x-6">

        <Link to="/">
          Home
        </Link>

        <Link to="/lessons">
          Lessons
        </Link>

        <Link to="/quiz">
          Quiz
        </Link>

        <Link to="/about">
          About
        </Link>

      </div>

    </nav>

  );

};

export default Navbar;