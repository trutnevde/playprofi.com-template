import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";



function CustomSlider({slides}) {
  const [index, setIndex] = useState(0);
  const slideInterval = 5000; // Интервал смены (в миллисекундах)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, slideInterval);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании или изменении index
  }, [index]);

  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
  };

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-xl">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className="absolute left-0 top-0 flex size-full items-center justify-center"
        >
          <img
            src={slides[index].url}
            alt=""
            className="absolute left-0 top-0 size-full object-cover"
          />
          <div className="absolute w-full p-8 text-center">
            <p className="mb-5 text-5xl">{slides[index].category}</p>
            <p className="text-2xl text-main-accent">{slides[index].title}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Навигационные точки */}
      <div className="absolute bottom-5 right-0 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`size-3 rounded-full transition-all ${
              index === i ? "bg-main-accent" : "bg-dark-supporting"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default CustomSlider;
