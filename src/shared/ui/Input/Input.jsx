function Input(props) {
  const { placeholder, icon, register, ...otherProps } = props;
  return (
    <div className="flex items-center rounded-xl bg-dark-graphite">
      <input
        placeholder={placeholder}
        className="w-full rounded-xl bg-dark-graphite px-5 py-4 pr-10 text-xl font-light text-main-white focus:outline-none"
        {...register}
        {...otherProps}
      />
      {icon && <div className="mx-5 w-5">{icon}</div>}
    </div>
  );
}

export default Input;
