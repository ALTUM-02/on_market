type Props = {
  title: string;
  value: string;
};

const StatsCard = ({
  title,
  value,
}: Props) => {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      p-6
      shadow-sm
      "
    >
      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
};

export default StatsCard;