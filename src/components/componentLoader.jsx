import { RotatingLines } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <RotatingLines
        visible={true}
        height="120"
        width="120"
        color="#00ADEF"
        strokeWidth="3"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        // wrapperStyle={{}}
        // wrapperClass=""
      />
    </section>
  );
};


export default LoadingSpinner;