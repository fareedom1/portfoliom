// Intro/landing page (before login)
import { Link } from 'react-router-dom';
export default function Home() {
    return (
        <div className="home-container">
            <h1 className="home-header">Portfoliom</h1>
            <p className="home-tagline">Showcase your portfolio projects and connect with others.</p>
            <p className="home-description">
                Portfoliom lets you showcase your best portfolio projects, connect with other creators, get feedback, and find inspiration in the work of your peers.
            </p>
            <ul className="home-features-list">
                <li>Share your personal portfolio projects</li>
                <li>View and get inspired by others’ work</li>
                <li>Like impressive portfolios</li>
                <li>Comment and exchange feedback</li>
            </ul>
            <div className="home-cta">
                <p>Ready to showcase your work? Create an account or log in below </p>
                <Link className="cta-btn" to ="/login"> Sign Up</Link>
                <Link className="cta-btn" to ="/login"> Log In</Link>
            </div>
            <div className="home-contact">
                <p>Have questions or feedback? <Link className="contact-link" to="/feedback">Contact us here.</Link></p>
            </div>
        </div>
    );
}