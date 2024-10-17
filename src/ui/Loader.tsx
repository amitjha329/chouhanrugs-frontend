import clsx from "clsx";
const Loader = ({ className = "" }: { className?: string }) => {
    return (
        <div className={clsx("fixed top-0 left-0 h-screen w-screen flex justify-center items-center overflow-hidden z-[49] bg-white", className)}>
            <span className="loading loading-dots loading-lg"></span>
        </div>
    );
}

export default Loader;