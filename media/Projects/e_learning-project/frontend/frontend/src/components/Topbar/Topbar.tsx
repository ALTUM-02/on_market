const Topbar = () => {
  return (
    <div
      className="
      bg-white
      shadow-sm
      p-5
      flex
      justify-between
      items-center
      "
    >
      <h2 className="text-xl font-bold">
        CyberSafe Learn
      </h2>

      <button
        className="
        bg-blue-600
        text-white
        px-4
        py-2
        rounded-lg
        "
      >
        Login
      </button>
    </div>
  );
};

export default Topbar;