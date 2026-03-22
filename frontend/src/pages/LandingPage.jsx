import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheckDouble, FaMagic, FaTasks, FaFilePdf, FaArrowRight, FaGithub, FaLinkedin } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <FaMagic className="feature-icon magic" />,
            title: "✨ AI Goal Breakdown",
            desc: "Type a vague goal, get a complete action plan. Taskflow's AI breaks any goal into prioritized subtasks with deadlines automatically."
        },
        {
            icon: <FaTasks className="feature-icon tasks" />,
            title: "📋 Smart Task Management",
            desc: "Organize tasks by priority, deadline, or creation date. Filter by status. Never lose track of what matters most."
        },
        {
            icon: <FaFilePdf className="feature-icon pdf" />,
            title: "📄 Export & Report",
            desc: "Export your task list as a professional PDF report instantly. Perfect for tracking progress and sharing updates."
        }
    ];

    const steps = [
        {
            num: "1",
            title: "Type your goal",
            desc: "e.g. 'Prepare for my OS exam' or 'Build a portfolio website'"
        },
        {
            num: "2",
            title: "AI breaks it down",
            desc: "4-7 specific subtasks generated with priorities and deadlines in seconds."
        },
        {
            num: "3",
            title: "Track and complete",
            desc: "Check off tasks, monitor progress, and export your success."
        }
    ];

    return (
        <div className="landing-container">
            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="badge-glow">Now with Gemini 1.5 Flash AI</div>
                    <h1 className="hero-title">
                        Stop planning. <br />
                        <span className="text-gradient">Start doing.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Taskflow uses AI to turn your vague goals into clear, prioritized action plans — automatically. 
                        Let AI handle the cognitive load of planning while you focus on execution.
                    </p>
                    <div className="hero-ctas">
                        <button className="primary-btn-lp" onClick={() => navigate('/signup')}>
                            Get Started Free <FaArrowRight style={{ marginLeft: '10px' }} />
                        </button>
                        <button className="ghost-btn-lp" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                            See how it works
                        </button>
                    </div>
                    <p className="hero-caption">Free forever · No credit card required</p>
                    
                    {/* REAL APP PREVIEWS */}
                    <div className="preview-grid-lp">
                        <div className="browser-mockup main-mockup">
                            <div className="browser-header">
                                <div className="dots"><span></span><span></span><span></span></div>
                                <div className="address-bar">taskflow.app/dashboard</div>
                            </div>
                            <div className="browser-content">
                        <div className="browser-mockup main-mockup">
                            <div className="browser-header">
                                <div className="dots"><span></span><span></span><span></span></div>
                                <div className="address-bar">taskflow.app/dashboard</div>
                            </div>
                            <div className="browser-content">
                                <img src="/dashboard_new.png" alt="Taskflow Dashboard" className="mockup-img" />
                            </div>
                        </div>

                        <div className="preview-secondary-lp">
                            <div className="browser-mockup secondary-mockup">
                                <div className="browser-header">
                                    <div className="dots"><span></span><span></span><span></span></div>
                                    <div className="address-bar">taskflow.app/ai-planner</div>
                                </div>
                                <div className="browser-content">
                                    <img src="/planner_new.png" alt="AI Planner" className="mockup-img" />
                                </div>
                            </div>

                            <div className="browser-mockup secondary-mockup">
                                <div className="browser-header">
                                    <div className="dots"><span></span><span></span><span></span></div>
                                    <div className="address-bar">taskflow.app/contact</div>
                                </div>
                                <div className="browser-content">
                                    <img src="/contact_new.png" alt="Contact Us" className="mockup-img" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="features-section" id="features">
                <div className="section-header">
                    <h2>Everything you need to stay on track</h2>
                    <p>Powerful features designed to simplify your productivity workflow.</p>
                </div>
                <div className="feature-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            {f.icon}
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="how-it-works">
                <div className="section-header">
                    <h2>From goal to done in 3 steps</h2>
                </div>
                <div className="steps-container">
                    {steps.map((s, i) => (
                        <div key={i} className="step-item">
                            <div className="step-number">{s.num}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA SECTION BOTTOM */}
            <section className="cta-bottom">
                <div className="cta-card">
                    <h2>Ready to get things done?</h2>
                    <p>Join Taskflow and let AI handle the planning so you can focus on building.</p>
                    <button className="primary-btn-lp large" onClick={() => navigate('/signup')}>
                        Start for Free
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer-lp">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <FaCheckDouble /> <span>Taskflow</span>
                        </div>
                        <p>Your goals, broken down by AI. <br /> Done by you.</p>
                    </div>
                    <div className="footer-links">
                        <div className="link-group">
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <Link to="/signup">AI Planner</Link>
                            <a href="#">About</a>
                        </div>
                        <div className="link-group">
                            <h4>Social</h4>
                            <div className="social-icons">
                                <a href="https://github.com/AbdulWaihd" target="_blank" rel="noreferrer"><FaGithub /> GitHub</a>
                                <a href="https://linkedin.com/in/abdulwahid02" target="_blank" rel="noreferrer"><FaLinkedin /> LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Taskflow. Built by Abdul Wahid.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
