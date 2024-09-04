import clsx from "clsx";
import { PuffLoader } from "react-spinners";

const Loader = ({ className="" }: { className?: string }) => {
    return (
        <div className={clsx("fixed top-0 left-0 h-screen w-screen flex justify-center items-center overflow-hidden z-[49] bg-white", className)}>
            <PuffLoader />
        </div>
    );
}

export default Loader;