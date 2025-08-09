import { motion } from 'framer-motion';

interface LoaderProps {
  progress: number;
}

const Loader = ({ progress }: LoaderProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          className="w-64 h-96 bg-[#8B4513] rounded-lg shadow-2xl mb-8 relative overflow-hidden"
          initial={{ rotateY: -30 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white text-center px-4">
              My Interactive Book
            </h2>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#6B3E26]" />
        </motion.div>

        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-white mt-2">{Math.round(progress)}%</p>
      </motion.div>
    </div>
  );
};

export default Loader; 