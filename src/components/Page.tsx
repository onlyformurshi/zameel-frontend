import { motion } from 'framer-motion';

interface PageProps {
  title: string;
  content: string;
  isVisible: boolean;
  zIndex: number;
}

const Page = ({ title, content, isVisible, zIndex }: PageProps) => {
  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full bg-white"
      style={{
        zIndex,
        transformOrigin: 'left',
        backfaceVisibility: 'hidden',
      }}
      initial={{ rotateY: 0 }}
      animate={{
        rotateY: isVisible ? 0 : -180,
        transition: {
          duration: 1,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
    >
      {/* Page content */}
      <div className="w-full h-full p-12 bg-gradient-to-r from-gray-50 to-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-gray-800">{title}</h1>
          <div className="prose prose-lg max-w-none">
            {content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-xl text-gray-700 mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Page fold shadow */}
      <div
        className="absolute top-0 right-0 w-16 h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.1))'
        }}
      />

      {/* Page edge shadow */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          boxShadow: isVisible ? 'none' : 'inset -10px 0 30px rgba(0,0,0,0.2)'
        }}
      />
    </motion.div>
  );
};

export default Page; 