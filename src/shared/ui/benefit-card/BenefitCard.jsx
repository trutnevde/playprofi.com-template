function BenefitCard({ children, className }) {
  return (
    <div
      className={`h-[352px] ${className} flex justify-center items-center rounded-3xl`}
    >
      <div
        className={`h-[350px] bg-main-dark rounded-[calc(1.5rem+0.2px)] px-5 py-[30px]`}
      >
        {children}
      </div>
    </div>
  )
}

export default BenefitCard
