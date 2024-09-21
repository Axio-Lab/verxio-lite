import { RotatingLines } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <div className="bg-[#000]/50 absolute w-full h-screen overflow-hidden top-0 left-0 z-50 flex justify-center items-center px-28">
      <section className="w-full h-full flex items-center justify-center mx-auto">
        <RotatingLines
          visible={true}
          height="120"
          width="120"
          color="grey"
          strokeWidth="3"
          strokeColor="#00ADEF"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          // wrapperStyle={{}}
          // wrapperClass=""
        />
      </section>
    </div>
  );
};

export default LoadingSpinner;
