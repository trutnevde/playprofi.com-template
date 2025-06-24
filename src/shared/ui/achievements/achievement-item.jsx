function AchievementItem({ icon, title, value }) {
  return (
    <div className="bg-main-white bg-opacity-5 flex pl-[10px] py-[6px] pr-5 w-[300px] rounded-[14px] items-center">
      <div className="flex gap-3 flex-1 text-main-white items-center">
        {icon}
        {title}
      </div>
      <p className="text-main-accent">+{value}</p>
    </div>
  )
}

export default AchievementItem
