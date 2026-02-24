import { motion } from "framer-motion";

const PageTransition = () => {
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "#135eab", // El azul de tu marca
        zIndex: 9999,
        pointerEvents: "none",
      }}
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
};

export default PageTransition;