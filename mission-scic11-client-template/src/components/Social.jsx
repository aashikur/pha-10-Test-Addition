import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Social = () => {
  const { googleSignIn } = useContext(AuthContext);
  return (
    <div className=" bg-white shadow py-3 rounded-full flex flex-col items-center">
      <div>
        <img
        onClick={googleSignIn}
          className="w-[64px] hover:cursor-pointer"
          src="https://img.icons8.com/?size=96&id=17949&format=png"
          alt=""
        />
      </div>
      <div className="">
        <img
          className="w-[64px]"
          src="https://img.icons8.com/?size=96&id=118497&format=png"
          alt=""
        />
      </div>
      <div className="">
        <img
          className="w-[64px]"
          src="https://img.icons8.com/?size=96&id=bUGbDbW2XLqs&format=png"
          alt=""
        />
      </div>
      <div className="">
        <img
          className="w-[64px]"
          src="https://img.icons8.com/?size=128&id=3tC9EQumUAuq&format=png"
          alt=""
        />
      </div>
    </div>
  );
};

export default Social;
