// Intro/landing page (before login)
import { Link } from 'react-router-dom';
export default function Home() {
    return (
        <div className="w-1/2 mt-20 mx-auto px-32 py-10 bg-[radial-gradient(circle_at_top_left,#1f2937_0%,#020617_65%)] rounded-3xl shadow-[var(--shadow-soft)] text-center border border-slate-400/20 flex flex-col max-md:mt-10 max-md:px-6 max-md:w-[90%]">
            <h1 className="tracking-wide font-extrabold mb-2 bg-[linear-gradient(90deg,var(--logo-gradient))] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.45)] ">
                Portfoliom
            </h1>
            <p className="text-lg text-gray-400 mb-6 font-medium">Connect, Collaborate, and Upgrade your portfolio.</p>
            <ul className="text-left max-w-[440px] mx-auto mb-8 pl-5 text-gray-400 space-y-2 list-disc marker:text-sky-500">
                <li>Share your personal portfolio projects</li>
                <li>View and get inspired by others’ work</li>
                <li>Like and Comment on impressive portfolios</li>
                <li>Connect with other creators and exchange feedback</li>
            </ul>
            <div className="mt-2 mb-8">
                <p className="mb-4 text-gray-300"> <span className="block">Ready to showcase your work?</span>Create an account or log in below</p>
                <div className="flex justify-center gap-3">
                    <Link className="border border-sky-500/30 cursor-pointer px-7 py-2.5 rounded-full 
                    font-semibold text-sm bg-slate-950 text-sky-400 
                    shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 
                    hover:bg-gradient-to-br hover:from-sky-400 hover:to-indigo-500 
                    hover:text-slate-950 hover:-translate-y-px hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] 
                    hover:border-transparent inline-block" to="/login">Sign Up</Link>
                    <Link className="border border-sky-500/30 cursor-pointer px-7 py-2.5 rounded-full 
                    font-semibold text-sm bg-slate-950 text-sky-400 
                    shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 
                    hover:bg-gradient-to-br hover:from-sky-400 hover:to-indigo-500 
                    hover:text-slate-950 hover:-translate-y-px hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] 
                    hover:border-transparent inline-block" to="/login">Log In</Link>
                </div>
            </div>
            <div className="text-sm text-gray-400">
                <p>Have questions or feedback? <Link className="text-sky-400 hover:text-sky-300 transition-colors font-medium" to="/feedback">Contact us here.</Link></p>
            </div>
        </div>
    );
}