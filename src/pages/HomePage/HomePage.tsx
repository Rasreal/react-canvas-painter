
import { usePainter } from "@/hooks/usePainter";
import { Intro } from "@/components/Intro";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";

const Home = () => {

    const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter();
    const navigate = useNavigate();


    const navigateToPaint = () => {
        navigate('/paint')
    }


    return (
      <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      >
        <Intro isReady={isReady} init={navigateToPaint} />
      </motion.div>
    );
  };


  export default Home;