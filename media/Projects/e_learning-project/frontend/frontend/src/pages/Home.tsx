import {
  motion,
} from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {

  return (

    <div>

      <section
        className="
        min-h-screen
        flex
        flex-col
        justify-center
        items-center
        bg-slate-100
        "
      >

        <motion.h1

          initial={{
            opacity: 0,
            y: -50,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 1,
          }}

          className="
          text-6xl
          font-bold
          mb-6
          "
        >

          CyberSafe Learn

        </motion.h1>

        <p
          className="
          text-xl
          text-gray-600
          "
        >

          Learn Cyber Security
          Interactively

        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/lessons"
            className="rounded-full bg-slate-900 px-6 py-3 text-white"
          >
            View Lessons
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full border border-slate-900 px-6 py-3 text-slate-900"
          >
            Open Dashboard
          </Link>
        </div>

      </section>

    </div>

  );

};

export default Home;