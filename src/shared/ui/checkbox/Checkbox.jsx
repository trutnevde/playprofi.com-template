import { Controller } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";

function Checkbox({ control, label, name }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={value}
            onChange={onChange}
            className="hidden"
          />
          <span
            className={`mr-2 flex size-5 items-center justify-center rounded border-2 border-[rgba(41,228,222,0.4)] ${value ? "bg-[rgba(41,228,222,0.4)]" : "bg-dark-coal"}`}
          >
            {value && <FaCheck size={11} color="rgba(41,228,222,1)" />}
          </span>
          <p className="text-base text-gray">{label}</p>
        </label>
      )}
    />
  );
}

export default Checkbox;
