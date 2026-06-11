// function Landing(){
//     return(
//         <h1>Landing Page</h1>
//     );
// }

// export default Landing;
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Landing(){
    return(
       <div className="min-h-screen bg-slate-600 text-white">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
            
        </div>
    );
}
export default Landing;