import { Flame } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setTokenMintAddress,
  setTokenAmount,
} from "@/store/slices/statesSlice";
import { toast } from "react-hot-toast";
import { Button } from "@/components/Button";

const BurnTokenAction = () => {
  const [tokenMint, setTokenMint] = useState("");
  const [minBurnAmount, setMinBurnAmount] = useState("");

  const dispatch = useDispatch();

  const handleSave = () => {
    if (!tokenMint || !minBurnAmount) {
      toast.error("Either fields cannot be empty.");
      return;
    }

    dispatch(setTokenMintAddress(tokenMint));
    dispatch(setTokenAmount(minBurnAmount));
    toast.success("Saved successful");
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Flame className="mr-2 text-red-500" />
          Burn Token Details
        </h3>
        <input
          className="w-full p-2 mb-2 border rounded outline-none"
          placeholder="Token mint address"
          value={tokenMint}
          onChange={(e) => setTokenMint(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2 border rounded outline-none"
          type="number"
          placeholder="Minimum burn amount"
          value={minBurnAmount}
          onChange={(e) => setMinBurnAmount(e.target.value)}
        />
        <Button
          name={"Save"}
          onClick={() => handleSave()}
          className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 sm:py-3"
        />
      </div>
    </>
  );
};

export default BurnTokenAction;
