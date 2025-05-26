import { ClipLoader } from "react-spinners";
import "./Loader.css"
const Loader = () => {
  return (
    <div className="loader-wrapper">
      <ClipLoader size={50} color="#7c5dfa" />
    </div>
  );
};

export default Loader;
