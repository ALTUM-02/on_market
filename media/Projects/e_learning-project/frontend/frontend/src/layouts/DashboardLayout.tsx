import Sidebar from "../components/sidebar/sidebar";
import Topbar from "../components/Topbar/Topbar";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({
  children,
}: Props) => {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen">

        <Topbar />

        <div className="p-8">

          {children}

        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;