import { useState } from "react";

import Button from "../buttons/Button";
import Input from "./Input";

import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

function PasswordInput(props) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleShowPassword = (e) => {
    e.preventDefault();
    setIsShowPassword(!isShowPassword);
  };

  const actionIcon = (
    <Button type="button" varian="secondary" onClick={handleShowPassword}>
      {isShowPassword ? (
        <IoEyeOff size={20} className="text-gray" />
      ) : (
        <IoEye size={20} className="text-gray" />
      )}
    </Button>
  );
  return (
    <Input
      {...props}
      icon={actionIcon}
      type={isShowPassword ? "text" : "password"}
    />
  );
}

export default PasswordInput;
