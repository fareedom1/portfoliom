// Intro/landing page (before login)
import { Link } from 'react-router-dom';
export default function Home() {
    return (
        <div className="w-1/2 mt-20 mx-auto px-32 py-10 bg-[radial-gradient(circle_at_top_left,#1f2937_0%,#020617_65%)] rounded-3xl shadow-[var(--shadow-soft)] text-center border border-slate-400/20 flex flex-col max-md:mt-10 max-md:px-6 max-md:w-[90%]">
            <h1 className="tracking-wide font-extrabold mb-2 bg-[linear-gradient(90deg,var(--logo-gradient))] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.45)] ">
                Portfoliom
            </h1>
            <p className="text-lg text-gray-400 mb-6 font-medium">Showcase your portfolio projects and connect with others.</p>
            <p className="text-indigo-100 text-base mb-8 leading-relaxed max-w-2xl mx-auto">
                Portfoliom lets you showcase your best portfolio projects, connect with other creators, get feedback, and find inspiration in the work of your peers.
            </p>
            <ul className="text-left max-w-[440px] mx-auto mb-8 pl-5 text-gray-400 space-y-2 list-disc marker:text-sky-500">
                <li>Share your personal portfolio projects</li>
                <li>View and get inspired by others’ work</li>
                <li>Like impressive portfolios</li>
                <li>Comment and exchange feedback</li>
            </ul>
            <div className="mt-2 mb-8">
                <p className="mb-4 text-gray-300">Ready to showcase your work? Create an account or log in below</p>
                <div className="flex justify-center gap-3">
                    <Link className="border-none cursor-pointer px-7 py-2.5 rounded-full font-semibold text-sm bg-gradient-to-br from-sky-400 to-indigo-500 text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.45)] transition-all duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] inline-block" to="/login">Sign Up</Link>
                    <Link className="border-none cursor-pointer px-7 py-2.5 rounded-full font-semibold text-sm bg-gradient-to-br from-sky-400 to-indigo-500 text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.45)] transition-all duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] inline-block" to="/login">Log In</Link>
                </div>
            </div>
            <div className="text-sm text-gray-400">
                <p>Have questions or feedback? <Link className="text-sky-400 hover:text-sky-300 transition-colors font-medium" to="/feedback">Contact us here.</Link></p>
            </div>
        </div>
    );
}