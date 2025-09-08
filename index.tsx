import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
// FIX: Added GenerateContentResponse to fix type inference issues with the API response.
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SERVICES_DATA = [
    {
        id: 'ai-agents',
        title: 'AI Agents',
        price: 2500,
        shortDescription: 'Deploy intelligent AI agents to automate customer support and sales.',
        headline: 'Your 24/7 Automated Workforce.',
        intro: 'Leverage the power of artificial intelligence with custom-built AI agents. Our agents can handle customer inquiries, qualify leads, and automate complex workflows, freeing up your team to focus on high-value tasks.',
        features: [ 'Custom AI Chatbot Development', 'Sales & Lead Qualification Agents', 'Customer Support Automation', 'Integration with CRM & Helpdesk', 'Natural Language Processing (NLP)', 'Continuous Learning & Optimization' ],
        imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=600&h=400&fit=crop&q=80'
    },
    {
        id: 'ai-automation',
        title: 'AI Automation',
        price: 2000,
        shortDescription: 'Streamline business processes with intelligent automation solutions.',
        headline: 'Work Smarter, Not Harder.',
        intro: 'Identify and eliminate bottlenecks in your operations with our AI Automation services. We analyze your workflows and implement intelligent solutions to automate repetitive tasks, reduce errors, and increase efficiency across your organization.',
        features: [ 'Workflow Analysis & Optimization', 'Automated Data Entry & Processing', 'AI-Powered Reporting', 'Marketing Automation Enhancement', 'Internal Process Automation', 'API & System Integrations' ],
        imageUrl: 'https://images.unsplash.com/photo-1555255707-c07969078a5b?w=600&h=400&fit=crop&q=80'
    },
    { 
        id: 'seo',
        title: 'SEO Optimization', 
        price: 999, 
        shortDescription: 'Improve your search engine ranking and drive organic traffic.',
        headline: "Climb the Ranks. Dominate Search.",
        intro: "Unlock your website's true potential with our comprehensive SEO Optimization services. We go beyond keywords to build a sustainable strategy that drives organic traffic, increases visibility, and converts visitors into customers.",
        features: [
            'In-depth Keyword Research & Analysis',
            'Technical SEO Audit & Implementation',
            'On-Page & Off-Page Optimization',
            'High-Quality Link Building',
            'Local SEO for brick-and-mortar businesses',
            'Transparent Monthly Reporting'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80'
    },
    { 
        id: 'content-marketing',
        title: 'Content Marketing', 
        price: 1200, 
        shortDescription: 'Engage your audience with high-quality, relevant content.',
        headline: "Content that Connects and Converts.",
        intro: "Engage your audience and build lasting relationships with our data-driven Content Marketing services. We create valuable, relevant, and consistent content that attracts and retains a clearly defined audience — and, ultimately, drives profitable customer action.",
        features: [
            'Content Strategy & Planning',
            'Blog Post & Article Writing',
            'Ebooks, Whitepapers & Case Studies',
            'Infographic & Video Script Creation',
            'Content Distribution & Promotion',
            'Performance Analytics'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&q=80'
    },
    { 
        id: 'ppc',
        title: 'PPC Campaigns', 
        price: 1500, 
        shortDescription: 'Targeted ad campaigns to maximize your ROI.',
        headline: "Instant Visibility. Measurable Results.",
        intro: "Get immediate traction and maximize your return on investment with our expertly managed Pay-Per-Click (PPC) campaigns. We create highly targeted ad campaigns on platforms like Google Ads and Bing to put your brand in front of customers at the exact moment they're ready to buy.",
        features: [
            'Campaign Strategy & Setup',
            'Ad Copywriting & A/B Testing',
            'Landing Page Optimization',
            'Bid Management & Budget Optimization',
            'Conversion Tracking & Analysis',
            'Detailed Performance Reporting'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop&q=80'
    },
    { 
        id: 'social-media',
        title: 'Social Media Management', 
        price: 850, 
        shortDescription: 'Build and manage your brand\'s presence on social media.',
        headline: "Build Your Tribe. Grow Your Brand.",
        intro: "Amplify your message and foster a loyal community with our strategic Social Media Management services. We help you navigate the ever-changing social landscape, building an authentic brand presence that resonates with your target audience and drives business goals.",
        features: [
            'Platform-Specific Strategy',
            'Content Creation & Curation',
            'Community Management & Engagement',
            'Social Media Advertising Campaigns',
            'Influencer Outreach',
            'Performance Analytics & Reporting'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1611162616805-669b3528b1e5?w=600&h=400&fit=crop&q=80'
    },
    {
        id: 'landing-page',
        title: 'Sales/Landing Page',
        price: 750,
        shortDescription: 'High-converting landing pages designed to drive action.',
        headline: 'Turn Clicks into Customers.',
        intro: 'Capture your audience\'s attention and drive conversions with a professionally designed sales or landing page. We focus on compelling copy, user-centric design, and clear calls-to-action to maximize your campaign\'s effectiveness.',
        features: [ 'Conversion-Focused Design (UI/UX)', 'Compelling A/B Tested Copywriting', 'Fast Loading Speeds', 'Mobile-Responsive Layout', 'Lead Capture Form Integration', 'Analytics & Heatmap Setup' ],
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop&q=80'
    },
    {
        id: 'copywriting',
        title: 'Copywriting',
        price: 600,
        shortDescription: 'Persuasive copy that tells your brand\'s story and sells.',
        headline: 'Words that Work.',
        intro: 'From website content to ad copy, our expert copywriters craft clear, concise, and compelling messages that resonate with your target audience and persuade them to take action. We blend creativity with SEO best practices to ensure your content is both engaging and discoverable.',
        features: [ 'Website & Landing Page Copy', 'Email Marketing Campaigns', 'Ad Copy (PPC & Social)', 'Blog Posts & Articles', 'Brand Voice & Tone Development', 'Product Descriptions' ],
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop&q=80'
    },
    {
        id: 'web-development',
        title: 'Website Development',
        price: 3000,
        shortDescription: 'Custom, responsive websites that look great and perform better.',
        headline: 'Your Digital Storefront, Perfected.',
        intro: 'Build a powerful online presence with a custom website that is fast, secure, and user-friendly. Our development process focuses on clean code, responsive design, and a seamless user experience to represent your brand professionally and effectively.',
        features: [ 'Custom WordPress & Shopify Development', 'Responsive Design for All Devices', 'E-commerce Functionality', 'Performance Optimization', 'SEO-Friendly Architecture', 'Content Management System (CMS) Training' ],
        imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop&q=80'
    },
    {
        id: 'branding-kit',
        title: 'Branding Kit',
        price: 1800,
        shortDescription: 'A complete visual identity to make your brand unforgettable.',
        headline: 'Define Your Identity. Make an Impact.',
        intro: 'Establish a strong and consistent brand presence with a comprehensive branding kit. We develop a complete visual identity system, from your logo to your color palette, ensuring your brand looks professional and cohesive across all platforms.',
        features: [ 'Logo Design & Variations', 'Color Palette & Typography', 'Brand Style Guide', 'Business Card & Letterhead Design', 'Social Media Profile Kit', 'Marketing Material Templates' ],
        imageUrl: 'https://images.unsplash.com/photo-1600585152220-0204262ae758?w=600&h=400&fit=crop&q=80'
    },
    {
        id: 'email-marketing',
        title: 'Email Marketing',
        price: 700,
        shortDescription: 'Nurture leads and drive sales with targeted email campaigns.',
        headline: 'Directly to Their Inbox. Directly to the Point.',
        intro: 'Connect with your audience directly and effectively through our strategic email marketing services. We design, write, and manage campaigns that nurture leads, promote your products, and build lasting customer loyalty.',
        features: [ 'Campaign Strategy & Segmentation', 'Email Template Design', 'Compelling Copywriting', 'Automation & Drip Campaigns', 'A/B Testing & Optimization', 'Performance Analytics & Reporting' ],
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-3072a353d989?w=600&h=400&fit=crop&q=80'
    },
];

const USERS = {
  admin: { password: 'admin123', role: 'Admin', name: 'Admin User' },
  client: { password: 'client123', role: 'Client', name: 'Client User' },
};

const TESTIMONIALS_DATA = [
    {
        quote: "AdQure's SEO strategy skyrocketed our organic traffic by 300% in just six months. Their team is knowledgeable, responsive, and truly a partner in our success.",
        name: 'Jane Doe',
        company: 'CEO, TechSolutions Inc.',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80'
    },
    {
        quote: "The new website they developed is not only beautiful but also incredibly fast and user-friendly. Our conversion rates have doubled since the launch.",
        name: 'John Smith',
        company: 'Founder, The Coffee Corner',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80'
    },
    {
        quote: "Their content marketing is second to none. They consistently deliver high-quality articles that resonate with our audience and establish us as thought leaders.",
        name: 'Emily White',
        company: 'Marketing Director, HealthCo',
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80'
    },
];

const initializeProjectStages = () => {
    const stageData = [
        { name: 'Discovery & Kick-off', status: 'completed', duration: 7 },
        { name: 'Strategy & Planning', status: 'completed', duration: 14 },
        { name: 'Implementation & Development', status: 'active', duration: 30 },
        { name: 'Optimization & Testing', status: 'pending', duration: 21 },
        { name: 'Reporting & Analysis', status: 'pending', duration: 14 },
    ];

    let cumulativeDate = new Date();
    const completedCount = stageData.filter(s => s.status === 'completed').length;
    let pastDuration = 0;
    for (let i = 0; i < completedCount; i++) {
        pastDuration += stageData[i].duration;
    }
    cumulativeDate.setDate(cumulativeDate.getDate() - pastDuration);
    
    let lastDeadline = new Date(cumulativeDate);
    return stageData.map(stage => {
        const deadline = new Date(lastDeadline);
        deadline.setDate(deadline.getDate() + stage.duration);
        lastDeadline = deadline;
        return { name: stage.name, status: stage.status, deadline };
    });
};

const App = () => {
    const [theme, setTheme] = useState('light');
    const [view, setView] = useState<{ name: string; data: any; }>({ name: 'Dashboard', data: null });
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [selectedServiceForQuote, setSelectedServiceForQuote] = useState(null);
    const [projectStages, setProjectStages] = useState(initializeProjectStages);

    useEffect(() => {
        document.body.className = theme;
        const root = document.documentElement;
        if (theme === 'light') {
            root.style.setProperty('--primary-color', 'hsl(165.65, 26.44%, 65.88%)');
            root.style.setProperty('--secondary-color', 'hsl(0, 0%, 8.24%)');
            root.style.setProperty('--background-color', 'hsl(70.91, 21.57%, 90%)');
            root.style.setProperty('--card-color', 'hsl(180 6.67% 97.06%)');
            root.style.setProperty('--text-color', 'hsl(0, 0%, 8.24%)');
            root.style.setProperty('--text-muted-color', 'hsl(0, 0%, 30%)');
        } else {
            root.style.setProperty('--primary-color', 'hsl(203.77, 87.60%, 52.55%)');
            root.style.setProperty('--secondary-color', 'hsl(0, 0%, 95%)');
            root.style.setProperty('--background-color', 'hsl(0, 0%, 0%)');
            root.style.setProperty('--card-color', 'hsl(228, 9.80%, 10%)');
            root.style.setProperty('--text-color', 'hsl(0, 0%, 95%)');
            root.style.setProperty('--text-muted-color', 'hsl(0, 0%, 70%)');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleUpdateStage = (stageIndex, newStatus) => {
        const newStages = [...projectStages];
        newStages[stageIndex].status = newStatus;

        if (newStatus === 'completed' && stageIndex < newStages.length - 1) {
            if (newStages[stageIndex + 1].status === 'pending') {
                 newStages[stageIndex + 1].status = 'active';
            }
        }

        if (newStatus === 'pending') {
            for (let i = stageIndex + 1; i < newStages.length; i++) {
                newStages[i].status = 'pending';
            }
        }
        
        setProjectStages(newStages);
    };
    
    const handleUpdateDeadline = (stageIndex, newDeadline) => {
        const newStages = [...projectStages];
        // The date from input is a string 'YYYY-MM-DD', need to convert to Date object
        // but also account for timezone offset to prevent day-before issues.
        const [year, month, day] = newDeadline.split('-').map(Number);
        newStages[stageIndex].deadline = new Date(year, month - 1, day);
        setProjectStages(newStages);
    };

    const handleLogin = (username, password) => {
        const user = USERS[username.toLowerCase()];
        if (user && user.password === password) {
            setCurrentUser({ username, ...user });
            setIsLoginModalOpen(false);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };
    
    const handleOpenQuoteModal = (service) => {
        setSelectedServiceForQuote(service);
        setIsQuoteModalOpen(true);
    };

    const handleCloseQuoteModal = () => {
        setIsQuoteModalOpen(false);
        setSelectedServiceForQuote(null);
    };

    const renderView = () => {
        const userRole = currentUser?.role || 'Client';
        switch (view.name) {
            case 'Dashboard':
                return <DashboardView setActiveView={(name) => setView({ name, data: null })} />;
            case 'Services':
                return <ServicesView onSelectService={(service) => setView({ name: 'ServiceDetail', data: service })} />;
            case 'Project Roadmap':
                return <RoadmapView stages={projectStages} role={userRole} onUpdateStage={handleUpdateStage} onUpdateDeadline={handleUpdateDeadline} />;
            case 'Support':
                return <SupportView />;
            case 'ServiceDetail':
                return <ServiceDetailView service={view.data} onBack={() => setView({ name: 'Services', data: null })} onRequestQuote={handleOpenQuoteModal} />;
            default:
                return <DashboardView setActiveView={(name) => setView({ name, data: null })} />;
        }
    };

    return (
        <>
            <style>{STYLES}</style>
            <div className="app-container">
                <Sidebar 
                    activeView={view.name} 
                    setActiveView={(name) => setView({ name, data: null })} 
                    theme={theme} 
                    toggleTheme={toggleTheme}
                />
                <main className="main-content">
                    <header className="main-header">
                        <h1>{view.name === 'ServiceDetail' ? view.data.title : view.name}</h1>
                         <AccountControl user={currentUser} onLoginClick={() => setIsLoginModalOpen(true)} onLogout={handleLogout} />
                    </header>
                    {renderView()}
                </main>
                <footer className="mobile-footer">
                    <div className="theme-switcher">
                         <label className="switch">
                            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} aria-label="Toggle dark mode" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <AccountControl user={currentUser} onLoginClick={() => setIsLoginModalOpen(true)} onLogout={handleLogout} />
                </footer>
            </div>
            {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setIsLoginModalOpen(false)} />}
            {isQuoteModalOpen && <ServiceRequestModal service={selectedServiceForQuote} onClose={handleCloseQuoteModal} />}
        </>
    );
};

const AccountControl = ({ user, onLoginClick, onLogout }) => {
    if (user) {
        return (
            <div className="account-control">
                <span>Welcome, {user.name}</span>
                <button onClick={onLogout}>Logout</button>
            </div>
        );
    }
    return (
        <div className="account-control">
            <button onClick={onLoginClick}>Account Login</button>
        </div>
    );
};

const LoginModal = ({ onLogin, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = onLogin(username, password);
        if (!success) {
            setError('Invalid username or password.');
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);


    return (
        <div className="login-modal-overlay">
            <div className="login-modal" ref={modalRef}>
                <button className="close-button" onClick={onClose} aria-label="Close login modal">&times;</button>
                <h2>Account Login</h2>
                <p>Login to access your client portal.</p>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="cta-button">Login</button>
                </form>
                 <div className="demo-credentials">
                  <p><strong>Demo Credentials:</strong></p>
                  <p>Admin: admin / admin123</p>
                  <p>Client: client / client123</p>
                </div>
            </div>
        </div>
    );
};

const ServiceRequestModal = ({ service, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: service.title,
        details: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const modalRef = useRef(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a server
        console.log('Form Submitted:', formData);
        setIsSubmitted(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="quote-modal-overlay">
            <div className="quote-modal" ref={modalRef}>
                <button className="close-button" onClick={onClose} aria-label="Close form modal">&times;</button>
                {isSubmitted ? (
                    <div className="submission-success">
                        <h3>Thank You!</h3>
                        <p>Your quote request has been received. We will get back to you within 24 hours.</p>
                        <button onClick={onClose} className="cta-button">Close</button>
                    </div>
                ) : (
                    <>
                        <h2>Request a Quote</h2>
                        <p>Fill out the form below and we'll get back to you with a personalized quote.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="service">Service</label>
                                <input type="text" id="service" value={formData.service} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required />
                            </div>
                             <div className="form-group">
                                <label htmlFor="phone">Phone Number (Optional)</label>
                                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="details">Project Details</label>
                                {/* FIX: Changed rows="4" to rows={4} as the 'rows' attribute expects a number. */}
                                <textarea id="details" rows={4} value={formData.details} onChange={handleChange} required></textarea>
                            </div>
                            <button type="submit" className="cta-button">Submit Request</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};


const AdQureLogo = () => (
    <img 
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAACBCAMAAABTDA/3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0JDQjU5RTE3MkY0MTFFOUEzNkNDOEY2NDhFRDc3OTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0JDQjU5RTI3MkY0MTFFOUEzNkNDOEY2NDhFRDc3OTciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQkNCNTlERjcyRjQxMUU5QTM2Q0M4RjY0OEVDNzc5NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQkNCNTlFMCA3MkY0MTFFOUEzNkNDOEY2NDhFRDc3OTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4/h73LAAAACVBMVEUAf/8Aqv8A//8AAAB6QpW+AAACvUlEQVR42uycW2/aMBCGE1JcR4g75xS/yYt8X/7Gf+yD60qO2kIryZ6Zk8w0wzRNHf8f/r+r/xH/vJm/vQ+f//fX+Yf517w/3/r/379f8y/55018f3z47cM8b01c3z/v5h9/8YmJ168+mI/x39/9mK/5980c/vL84yO+f//8N5jvj5m/Pz8+f/z014+5f27mv5s/Pz8/fveZ++l+nZgLd08l4sJ98/n3yX/81+f8m/92x5W5tL+8b/938h8/f//8/Hl/e/1h//7y1x//97d//r//9/n3/f/e/p//+a+/3x/+v9/9e3N/7v+4n7+Z/v+V/+P3H/nL//x+n/u//v9zP1/+37e5v9z/l/v5z7+f+/nrw/nJ/L//9//8P/9z//v7/f7y/8v9v/+/n//X/+X/eX/f3+9v/y//+v/++v/6//y//3+///6+v/8v9/PJ/M//4d+fvz+9vzy/0t9+P/99f1/+V/un+vP/Uv+8j/fP9e/3+cv9ff1/fl8m+7z+f6yP//fn8/3y//6/38evzz/4b9///4+v+R/93p+uR9v8iX/835+/z+/5F/+5//813v5L3/L/v09P9/kX+b/+f1z/X18XyS5sD2r0iJbN9vR9m98v3v15Z9XW/mH1d59tZffm39e3b+vD8+L/fr8+W/18/vj++L/fmz/+v9ef+5X++r4+vy//v819/L/+L/fP/+v94f/lf7x/35/v//Pn//b/+L/+X+3P/y38//6d/fr+/v/zL/23+v7//L/fP/W/+L/fP/e/+L/fP9U/+L/fP/a/+L/fP/e/+L/fP9c/+L/fP/e//L/fP/f9zP9/+pX+e/+u/3+ev+u/39/p/7x+vr/nL/Xn9z/v19n8B33/+L/eL/Xn/9T/9z//9/fL/+P/fL/H/+v/0L//n/+3/eT+ev//fL//P+0v/+H/er/d/+v/vH8//e/+ev7//+H//P9+/+v/+f71//7/e33//X3/f/9/v3/7P+3v+9v7y/vJ+ffx98v/+/7y+3F/e37+/n+vL47/Y/2f/3v+X/Xf/y/3j/vL/+H/+X+/n+8v/+/7yf/y//j+/pX/e35//a/7P/Uv+8v/kv+Tf8n8Z5b/zfy0v7y/5k/+/eL/r+Mv+ffl//X/+v/74j5j5+b6+/t9kP2rC1h7N5+Z+fL+W2d0fX3/X3x/Pz2eC5m7x/P582zP+mY95s3/4m/908jM/M/bzeT6fv8yP+M/mef7n+/J/5ub+ef4z7893+PzP5f7+5f64f8v++3/eT++P/yv7823+9j//pX9ef8m/zL+kv+Tf/l/2L/mL/2L/y3/Jv8j/JP/L/nJ/y3+R/1d//L++P8vP/Xn/v5h/+D//H+/P76f3Vf7n+nn8P/8P+vj4vn1l9f8/3y/5P/lP8kX/Iv+TPyD0Pz1+uT/y38ev+Z///Xv5X++v6//r4832Sbb2zS19m+b/b+/+vJvr9+b+ffW5/M35vMvM/Xl3//s5/vj/m+ev7y/vH+u35s/3p+fP+9P98f7y/vyv68v8zP98f683+ZP+ef+sP+/n84/2X/mn/pv+TP8r/23+ev6d/8r+X//n+nv/J/1//r/+T//f+q//n+1f/yfz3/kv8k/7N/kv+p/+X+Uf+Zf1H/kv8p/1P/y/2r/jP/Y/6Z/1H/mf+x/xn/Uf+Z/1//z/2v/s/4v//8XwEGAIPcGYyB49V+AAAAAElFTkSuQmCC"
        alt="AdQure Logo"
    />
);

const Sidebar = ({ activeView, setActiveView, theme, toggleTheme }) => {
    const navItems = ['Dashboard', 'Services', 'Project Roadmap', 'Support'];
    const icons = {
        Dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
        Services: 'M12.65 10A5.65 5.65 0 0 0 7 4.35a5.65 5.65 0 0 0-5.65 5.65A5.65 5.65 0 0 0 7 15.65a5.65 5.65 0 0 0 5.65-5.65zM20 12h-2a8 8 0 0 1-8-8V2c5.52 0 10 4.48 10 10z',
        'Project Roadmap': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-4h2v4zm4 0h-2v-7h2v7zm4 0h-2v-2h2v2z',
        Support: 'M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
    };

    return (
        <aside className="sidebar">
            <div>
                <AdQureLogo />
                <nav>
                    <ul>
                        {navItems.map(item => (
                            <li key={item} className={(activeView === item || (activeView === 'ServiceDetail' && item === 'Services')) ? 'active' : ''} onClick={() => setActiveView(item)} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && setActiveView(item)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d={icons[item]} />
                                </svg>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="theme-switcher">
                <span>Dark Mode</span>
                <label className="switch">
                    <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                    <span className="slider round"></span>
                </label>
            </div>
        </aside>
    );
};

const DashboardView = ({ setActiveView }) => {
    const cards = [
        { title: 'Our Services', description: 'Explore our marketing solutions.', view: 'Services' },
        { title: 'Project Roadmap', description: 'Track your project\'s progress.', view: 'Project Roadmap' },
        { title: 'Get Support', description: 'Contact us or chat with our AI.', view: 'Support' },
    ];
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
    };

    return (
        <div className="view-content">
            <p className="intro-text">Welcome to the AdQure client portal. Manage your services, track project progress, and get support all in one place.</p>
            <div className="card-grid">
                {cards.map(card => (
                    <div key={card.title} className="content-card interactive-card" onClick={() => setActiveView(card.view)}>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>

            <div className="testimonials-section">
                <h2>What Our Clients Say</h2>
                {/* Desktop Grid */}
                <div className="testimonial-grid">
                    {TESTIMONIALS_DATA.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <div className="testimonial-author">
                                <img src={testimonial.imageUrl} alt={testimonial.name} />
                                <div className="testimonial-author-info">
                                    <span className="author-name">{testimonial.name}</span>
                                    <span className="author-company">{testimonial.company}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Mobile Carousel */}
                <div className="testimonial-carousel">
                    <div className="testimonial-card">
                        <p className="testimonial-quote">"{TESTIMONIALS_DATA[currentTestimonial].quote}"</p>
                        <div className="testimonial-author">
                            <img src={TESTIMONIALS_DATA[currentTestimonial].imageUrl} alt={TESTIMONIALS_DATA[currentTestimonial].name} />
                            <div className="testimonial-author-info">
                                <span className="author-name">{TESTIMONIALS_DATA[currentTestimonial].name}</span>
                                <span className="author-company">{TESTIMONIALS_DATA[currentTestimonial].company}</span>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-controls">
                        <button onClick={prevTestimonial} aria-label="Previous testimonial">&#8249;</button>
                        <button onClick={nextTestimonial} aria-label="Next testimonial">&#8250;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesView = ({ onSelectService }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = SERVICES_DATA.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-content">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search services by title or description..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search services"
                />
            </div>
            <div className="card-grid">
                {filteredServices.map(service => (
                    <div key={service.title} className="content-card service-card">
                        <img src={service.imageUrl} alt={service.title} className="service-card-image" />
                        <div className="service-card-content">
                            <h3>{service.title}</h3>
                            <p>{service.shortDescription}</p>
                        </div>
                        <div className="service-footer">
                            <span className="price-tag">Starts at ${service.price}</span>
                            <button className="cta-button" onClick={() => onSelectService(service)}>Learn More</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ServiceDetailView = ({ service, onBack, onRequestQuote }) => {
    if (!service) return null;

    return (
        <div className="view-content service-detail-view">
            <button onClick={onBack} className="back-button" aria-label="Back to services">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                Back to Services
            </button>
            <div className="content-card">
                <h2>{service.headline}</h2>
                <p className="intro-text">{service.intro}</p>
                <h3>Key Features</h3>
                <ul className="features-list">
                    {service.features.map(feature => <li key={feature}>{feature}</li>)}
                </ul>
                <div className="service-detail-footer">
                    <span className="price-tag">Starts at ${service.price}</span>
                    <button className="cta-button large-cta" onClick={() => onRequestQuote(service)}>Request a Quote</button>
                </div>
            </div>
        </div>
    );
};

const RoadmapView = ({ stages, role, onUpdateStage, onUpdateDeadline }) => {
    const projectName = "SEO Optimization Campaign";
    const [editingIndex, setEditingIndex] = useState(null);
    const [newDate, setNewDate] = useState('');

    const handleEditClick = (index, currentDeadline) => {
        setEditingIndex(index);
        setNewDate(currentDeadline.toISOString().split('T')[0]);
    };

    const handleSaveClick = (index) => {
        onUpdateDeadline(index, newDate);
        setEditingIndex(null);
    };

    const handleCancelClick = () => {
        setEditingIndex(null);
    };
    
    const getDeadlineStatus = (deadline, status) => {
        if (status === 'completed') {
            return { text: 'Completed', className: 'completed' };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { text: 'Overdue', className: 'overdue' };
        }
        if (diffDays <= 7) {
            return { text: 'Due Soon', className: 'upcoming' };
        }
        return { text: 'On Track', className: 'on-track' };
    };

    return (
        <div className="view-content">
            <div className="content-card roadmap-card">
                <div className="roadmap-project-header">
                    <p className="project-header-label">Project</p>
                    <h2 className="project-header-title">{projectName}</h2>
                </div>
                <div className="roadmap-header">
                    <h3>Your Project Roadmap</h3>
                    <p>Following our agile methodology for transparent and efficient delivery.</p>
                </div>
                <div className="roadmap-timeline">
                    {stages.map((stage, index) => {
                        const isCompleted = stage.status === 'completed';
                        const isActive = stage.status === 'active';
                        const isFirstPending = stage.status === 'pending' && (index === 0 || stages[index - 1].status === 'completed' || stages[index - 1].status === 'active');
                        const deadlineStatus = getDeadlineStatus(stage.deadline, stage.status);

                        return (
                            <div key={stage.name} className={`roadmap-stage ${stage.status}`} style={{ '--stage-animation-delay': `${index * 150}ms` } as React.CSSProperties}>
                                <div className="stage-icon-wrapper">
                                    <div className="stage-icon">
                                        {isCompleted && <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                                        {isActive && <div className="active-dot" />}
                                        {!isCompleted && !isActive && <div className="pending-dot" />}
                                    </div>
                                </div>
                                <div className="stage-details">
                                    <div className="stage-name">{stage.name}</div>
                                    <div className="stage-status">{stage.status}</div>
                                    <div className={`stage-deadline-info ${deadlineStatus.className}`}>
                                        <span className="deadline-indicator"></span>
                                        {editingIndex === index && role === 'Admin' ? (
                                            <div className="deadline-edit">
                                                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                                            </div>
                                        ) : (
                                            <span>{deadlineStatus.text} - Due by {stage.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        )}
                                    </div>
                                     {role === 'Admin' && (
                                        <div className="admin-controls">
                                            <div className="stage-controls">
                                                {stage.status === 'pending' && <button onClick={() => onUpdateStage(index, 'active')} disabled={!isFirstPending}>Mark as Active</button>}
                                                {stage.status === 'active' && <button onClick={() => onUpdateStage(index, 'completed')}>Mark as Completed</button>}
                                                {stage.status === 'completed' && <button onClick={() => onUpdateStage(index, 'pending')}>Reset Stage</button>}
                                            </div>
                                            <div className="deadline-controls">
                                                {editingIndex === index ? (
                                                    <>
                                                        <button className="save-btn" onClick={() => handleSaveClick(index)}>Save</button>
                                                        <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button className="edit-btn" onClick={() => handleEditClick(index, stage.deadline)}>Edit Date</button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SupportView = () => {
    return (
        <div className="view-content support-view">
            <div className="content-card chatbot-container">
                <header className="chatbot-header">
                    <h3>AdQure AI Assistant</h3>
                    <p>Ask me anything about our services!</p>
                </header>
                <Chatbot />
            </div>
        </div>
    );
};

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatHistoryRef = useRef(null);

    useEffect(() => {
        const initChat = () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const systemInstruction = `
You are a friendly and helpful customer support assistant for AdQure, a digital marketing agency. You are professional, concise, and knowledgeable.

**Your knowledge base includes the following service details:**
${JSON.stringify(SERVICES_DATA, null, 2)}

**General Information:**
- **Pricing:** Our pricing models are flexible. We offer monthly retainers for ongoing services like SEO and Social Media Management, project-based pricing for specific deliverables like a website audit, and custom quotes tailored to client needs. The "Starts at" prices listed for each service are a baseline and can vary based on project scope and complexity.
- **Project Timelines:**
  - **SEO Optimization:** Seeing significant results typically takes 3-6 months due to the nature of search engine algorithms.
  - **Content Marketing:** This is an ongoing strategy. You can expect to see initial content published within the first month.
  - **PPC Campaigns:** Campaigns can be launched within 1-2 weeks after the initial strategy and setup phase.
  - **Social Media Management:** We start by developing a strategy, which takes about a week, and then begin consistent posting and engagement.

Use the provided service data and general information to answer user questions about our services, pricing, features, and timelines. Be helpful and encourage users to request a formal quote for precise pricing.`;
                
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                    },
                });
                setChat(newChat);
                setMessages([{ text: "Hello! How can I assist you with AdQure's services today?", from: 'bot' }]);
            } catch (error) {
                console.error("Error initializing Gemini:", error);
                setMessages([{ text: "Sorry, I'm having trouble connecting to the AI service. Please try again later.", from: 'bot' }]);
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage = { text: input, from: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // FIX: Explicitly typing the response variable to ensure correct type inference.
            const response: GenerateContentResponse = await chat.sendMessage({ message: input });
            const botMessage = { text: response.text, from: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage = { text: "I'm sorry, I encountered an error. Please try again.", from: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="chatbot-inner">
            <div className="chat-history" ref={chatHistoryRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.from}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {isLoading && (
                     <div className="chat-message bot">
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={sendMessage} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    aria-label="Chat message input"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading} aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

const STYLES = `
    :root {
      --border-radius: 0.875rem;
      --transition-speed: 0.3s;
    }

    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Serif Pro', serif;
        background-color: var(--background-color);
        color: var(--text-color);
        transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    h1, h2, h3 {
        font-family: 'Inter', sans-serif;
        color: var(--secondary-color);
    }
    
    #root {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .app-container {
        display: flex;
        height: 100vh;
    }

    .sidebar {
        width: 260px;
        background-color: var(--card-color);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-right: 1px solid rgba(0,0,0,0.1);
        transition: background-color var(--transition-speed) ease;
    }
    .dark .sidebar {
        border-right: 1px solid rgba(255,255,255,0.1);
    }
    .sidebar .logo {
        width: 100%;
        height: auto;
        margin-bottom: 2rem;
    }

    .sidebar nav ul {
        list-style: none;
    }

    .sidebar nav li {
        display: flex;
        align-items: center;
        padding: 0.875rem 1rem;
        margin-bottom: 0.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        color: var(--text-muted-color);
        transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
    }
    .sidebar nav li svg {
        margin-right: 1rem;
        transition: color var(--transition-speed) ease;
    }

    .sidebar nav li:hover {
        background-color: var(--background-color);
        color: var(--secondary-color);
    }

    .sidebar nav li.active {
        background-color: var(--primary-color);
        color: var(--card-color) !important;
    }
    .light .sidebar nav li.active {
        color: var(--secondary-color) !important;
    }
    
    .main-content {
        flex: 1;
        overflow-y: auto;
        padding: 2rem;
    }

    .main-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .main-header h1 {
        font-size: 2.5rem;
    }
    
    .view-content {
        animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .intro-text {
        font-size: 1.2rem;
        max-width: 800px;
        margin-bottom: 2rem;
        line-height: 1.6;
        color: var(--text-muted-color);
    }
    
    .search-bar-container {
        margin-bottom: 2rem;
    }

    .search-input {
        width: 100%;
        max-width: 400px;
        padding: 0.75rem 1rem;
        border-radius: var(--border-radius);
        border: 1px solid var(--text-muted-color);
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: 'Source Serif Pro', serif;
        font-size: 1rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .dark .search-input {
        border-color: rgba(255,255,255,0.2);
    }
    .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(var(--primary-color-raw), 0.3);
    }
    
    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .content-card {
        background-color: var(--card-color);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .dark .content-card {
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .interactive-card {
        cursor: pointer;
    }
    .interactive-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    .dark .interactive-card:hover {
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }

    .service-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0;
    }
    .service-card-image {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
    }
    .service-card-content {
        padding: 1.5rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .service-card-content h3 { margin-bottom: 0.5rem; }
    .service-card-content p { color: var(--text-muted-color); flex-grow: 1; }
    
    .service-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.5rem 1.5rem 1.5rem;
    }
    
    .price-tag {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: bold;
        color: var(--primary-color);
    }
    
    .cta-button {
        background-color: var(--secondary-color);
        color: var(--card-color);
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: var(--border-radius);
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s ease;
    }
    .cta-button:hover {
        opacity: 0.8;
    }
    .light .cta-button {
      color: var(--background-color);
    }
    
    /* Roadmap */
    .roadmap-card {
        padding: 2rem;
    }

    .roadmap-project-header {
        text-align: center;
        padding-bottom: 1.5rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--primary-color);
    }
    .project-header-label {
        font-family: 'Inter', sans-serif;
        text-transform: uppercase;
        font-size: 0.9rem;
        color: var(--text-muted-color);
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
    }
    .project-header-title {
        font-size: 1.75rem;
    }

    .roadmap-header {
        margin-bottom: 2.5rem;
        text-align: center;
    }

    .roadmap-header h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .roadmap-header p {
        color: var(--text-muted-color);
        font-size: 1.1rem;
    }

    .roadmap-timeline {
        display: flex;
        justify-content: space-between;
        position: relative;
    }

    .roadmap-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 120px;
        opacity: 0;
        transform: scale(0.9);
        animation-name: stage-fade-in;
        animation-duration: 0.6s;
        animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        animation-fill-mode: forwards;
        animation-delay: var(--stage-animation-delay);
    }

    @keyframes stage-fade-in {
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .stage-icon-wrapper {
        position: relative;
        z-index: 2;
    }

    .stage-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--card-color);
        border: 2px solid var(--text-muted-color);
        transition: all var(--transition-speed) ease;
        margin-bottom: 1rem;
    }
    
    .stage-icon svg {
        width: 24px;
        height: 24px;
        fill: var(--card-color);
    }
    .light .stage-icon svg {
        fill: var(--secondary-color);
    }

    .active-dot {
        width: 16px;
        height: 16px;
        background-color: var(--primary-color);
        border-radius: 50%;
        animation: pulse 1.5s infinite;
    }

    .pending-dot {
        width: 16px;
        height: 16px;
        background-color: var(--text-muted-color);
        border-radius: 50%;
        opacity: 0.5;
    }

    .roadmap-stage.completed .stage-icon, .roadmap-stage.active .stage-icon {
        border-color: var(--primary-color);
    }

    .roadmap-stage.completed .stage-icon {
        background-color: var(--primary-color);
    }

    .stage-details {
        font-family: 'Inter', sans-serif;
    }

    .stage-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: var(--text-muted-color);
    }
    
    .stage-status {
        font-size: 0.8rem;
        text-transform: uppercase;
        color: var(--text-muted-color);
        opacity: 0.7;
    }

    .stage-deadline-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        font-family: 'Inter', sans-serif;
        margin-top: 0.5rem;
        font-weight: 600;
    }
    .stage-deadline-info .deadline-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: currentColor; /* Inherits color from parent */
    }
    .stage-deadline-info.overdue { color: #e53e3e; }
    .stage-deadline-info.upcoming { color: #dd6b20; }
    .stage-deadline-info.on-track { color: #38a169; }
    .stage-deadline-info.completed { color: var(--text-muted-color); font-weight: normal; }

    .admin-controls {
        margin-top: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .stage-controls, .deadline-controls {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }
    
    .deadline-edit {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .deadline-edit input[type="date"] {
      padding: 0.2rem;
      border-radius: 4px;
      border: 1px solid var(--text-muted-color);
      background-color: var(--background-color);
      color: var(--text-color);
      font-size: 0.75rem;
      width: 120px;
    }

    .stage-controls button, .deadline-controls button {
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        padding: 0.3rem 0.6rem;
        border: 1px solid var(--text-muted-color);
        background-color: transparent;
        color: var(--text-muted-color);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    
    .deadline-controls .save-btn {
        border-color: #38a169;
        color: #38a169;
    }
     .deadline-controls .save-btn:hover {
        background-color: #38a169;
        color: white;
     }

    .stage-controls button:hover, .deadline-controls button:hover {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        color: var(--card-color);
    }
    .light .stage-controls button:hover, .light .deadline-controls button:hover {
        color: var(--secondary-color);
    }
    .stage-controls button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .roadmap-stage.completed .stage-name, .roadmap-stage.active .stage-name {
        color: var(--text-color);
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(var(--primary-color-raw), 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(var(--primary-color-raw), 0); }
        100% { box-shadow: 0 0 0 0 rgba(var(--primary-color-raw), 0); }
    }
    .light { --primary-color-raw: 148, 184, 175; }
    .dark { --primary-color-raw: 76, 158, 223; }

    /* Testimonials */
    .testimonials-section {
        margin-top: 3rem;
    }
    .testimonials-section h2 {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    .testimonial-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
    }
    .testimonial-card {
        background-color: var(--card-color);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .dark .testimonial-card {
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .testimonial-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    .dark .testimonial-card:hover {
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    .testimonial-quote {
        font-style: italic;
        color: var(--text-muted-color);
        margin-bottom: 1.5rem;
        flex-grow: 1;
    }
    .testimonial-author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .testimonial-author img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }
    .testimonial-author-info {
        display: flex;
        flex-direction: column;
    }
    .author-name {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
    }
    .author-company {
        font-size: 0.9rem;
        color: var(--text-muted-color);
    }

    .testimonial-carousel {
        display: none;
    }

    /* Support & Chatbot */
    .support-view {
        display: flex;
        justify-content: center;
    }
    .chatbot-container {
        width: 100%;
        max-width: 800px;
        height: 70vh;
        display: flex;
        flex-direction: column;
        padding: 0;
    }
    .chatbot-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .dark .chatbot-header {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .chatbot-header p {
        color: var(--text-muted-color);
        font-size: 0.9rem;
    }
    .chatbot-inner {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        overflow: hidden;
    }
    .chat-history {
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 1rem; /* for scrollbar */
    }
    .chat-message {
        display: flex;
        margin-bottom: 1rem;
    }
    .chat-message p {
        padding: 0.75rem 1rem;
        border-radius: 1.25rem;
        line-height: 1.5;
        max-width: 80%;
    }
    .chat-message.bot {
        justify-content: flex-start;
    }
    .chat-message.bot p {
        background-color: var(--background-color);
        border-top-left-radius: 0.25rem;
    }
    .chat-message.user {
        justify-content: flex-end;
    }
    .chat-message.user p {
        background-color: var(--primary-color);
        color: var(--card-color);
        border-top-right-radius: 0.25rem;
    }
    .light .chat-message.user p {
      color: var(--secondary-color);
    }
    
    .chat-input-form {
        display: flex;
        margin-top: 1rem;
        gap: 0.5rem;
    }
    .chat-input-form input {
        flex-grow: 1;
        padding: 0.75rem 1rem;
        border-radius: var(--border-radius);
        border: 1px solid var(--text-muted-color);
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: 'Source Serif Pro', serif;
        font-size: 1rem;
    }
    .chat-input-form button {
        background-color: var(--primary-color);
        color: var(--card-color);
        border: none;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 0.2s ease;
    }
    .light .chat-input-form button {
      color: var(--secondary-color);
    }
    .chat-input-form button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .typing-indicator { display: flex; align-items: center; }
    .typing-indicator span {
        height: 8px; width: 8px;
        margin: 0 2px;
        background-color: var(--text-muted-color);
        border-radius: 50%;
        display: inline-block;
        animation: typing 1.4s infinite ease-in-out both;
    }
    .typing-indicator span:nth-of-type(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-of-type(2) { animation-delay: -0.16s; }
    @keyframes typing {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
    }

    /* Theme Switcher */
    .theme-switcher { display: flex; align-items: center; justify-content: space-between; font-family: 'Inter'; font-size: 0.9rem; color: var(--text-muted-color); }
    .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
    input:checked + .slider { background-color: var(--primary-color); }
    input:checked + .slider:before { transform: translateX(20px); }
    .slider.round { border-radius: 24px; }
    .slider.round:before { border-radius: 50%; }

    /* Service Detail View */
    .service-detail-view .content-card {
        padding: 2.5rem;
    }
    .service-detail-view h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    .service-detail-view .intro-text {
        font-size: 1.1rem;
    }
    .service-detail-view h3 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
    .features-list {
        list-style: none;
        padding-left: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }
    .features-list li {
        position: relative;
        padding-left: 1.75rem;
        line-height: 1.6;
        color: var(--text-muted-color);
    }
    .features-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-weight: bold;
    }
    .service-detail-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2.5rem;
        background-color: var(--background-color);
        padding: 1.5rem;
        border-radius: var(--border-radius);
    }
    .large-cta {
        padding: 0.8rem 1.6rem;
        font-size: 1rem;
    }
    .back-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        background: none;
        border: none;
        color: var(--text-muted-color);
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: color var(--transition-speed) ease;
    }
    .back-button:hover {
        color: var(--text-color);
    }
    
    .mobile-footer {
        display: none;
    }

    /* --- Login Modal & Account --- */
    .account-control {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
    }
    .account-control span {
        color: var(--text-muted-color);
    }
    .account-control button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--primary-color);
        background-color: transparent;
        color: var(--primary-color);
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .account-control button:hover {
        background-color: var(--primary-color);
        color: var(--card-color);
    }
    .light .account-control button:hover {
        color: var(--secondary-color);
    }
    
    .login-modal-overlay, .quote-modal-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background-color: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .login-modal, .quote-modal {
        background: var(--card-color);
        padding: 2.5rem;
        border-radius: var(--border-radius);
        width: 100%;
        max-width: 450px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        position: relative;
        animation: fadeIn 0.4s ease-out;
        transform: translateY(-20px);
    }
    
    .login-modal h2, .quote-modal h2 { margin-bottom: 0.5rem; }
    .login-modal p, .quote-modal p { color: var(--text-muted-color); margin-bottom: 1.5rem; }

    .close-button {
        position: absolute;
        top: 1rem; right: 1rem;
        background: none; border: none;
        font-size: 2rem;
        color: var(--text-muted-color);
        cursor: pointer;
        line-height: 1;
    }
    
    .form-group {
        margin-bottom: 1.25rem;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
    }
    .form-group input, .form-group textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--text-muted-color);
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: 'Source Serif Pro', serif;
        font-size: 1rem;
    }
    .form-group textarea {
        resize: vertical;
        min-height: 80px;
    }
    .form-group input:read-only {
        background-color: rgba(0,0,0,0.1);
        cursor: not-allowed;
    }
    .dark .form-group input:read-only {
        background-color: rgba(255,255,255,0.05);
    }

    .login-modal .cta-button, .quote-modal .cta-button {
        width: 100%;
        padding: 0.8rem;
        font-size: 1rem;
    }
    
    .error-message {
        background-color: #ff4d4d20;
        color: #ff4d4d;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        text-align: center;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
    }
    
    .demo-credentials {
        margin-top: 1.5rem;
        font-size: 0.8rem;
        color: var(--text-muted-color);
        text-align: center;
        background: var(--background-color);
        padding: 0.5rem;
        border-radius: 0.5rem;
    }
    .demo-credentials p { margin: 0.25rem 0; }
    
    .submission-success {
        text-align: center;
    }
    .submission-success h3 {
        color: var(--primary-color);
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    .submission-success p {
        margin-bottom: 1.5rem;
    }
    .submission-success .cta-button {
        width: auto;
    }

    /* --- Responsive Fixes --- */
    @media (max-width: 768px) {
        .app-container { 
            flex-direction: column; 
        }
        
        .sidebar { 
            width: 100%; 
            height: auto; 
            flex-direction: row; 
            border-right: none; 
            border-bottom: 1px solid rgba(0,0,0,0.1); 
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .dark .sidebar { 
            border-bottom: 1px solid rgba(255,255,255,0.1); 
        }
        
        .sidebar .logo { width: 120px; margin: 0; }
        .sidebar nav ul { display: flex; }
        .sidebar nav li { padding: 0.5rem; }
        .sidebar nav li span { display: none; }
        .sidebar > div:first-child { display: flex; align-items: center; gap: 1rem; }
        
        .main-header { 
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        
        .main-content { padding: 1.5rem; padding-bottom: 80px; }
        .main-header h1 { font-size: 1.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chatbot-container { height: 80vh; }
        
        .roadmap-timeline { 
            flex-direction: column; 
            align-items: stretch;
            position: relative;
        }
        
        .roadmap-stage { 
            flex-direction: row; 
            text-align: left; 
            width: 100%; 
            margin-bottom: 0;
            padding-left: 70px;
            position: relative;
            min-height: 90px;
            align-items: center;
            animation: none;
            opacity: 1;
            transform: none;
        }
        
        .roadmap-stage:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 25px;
            height: 100%;
            width: 2px;
            background-color: var(--text-muted-color);
            z-index: 0;
        }

        .roadmap-stage.completed::after {
            background-color: var(--primary-color);
        }

        .stage-icon-wrapper {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
        }

        .stage-icon { 
            margin: 0;
        }
        
        .stage-details {
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
        }
        .stage-deadline-info {
            font-size: 0.75rem;
            margin-top: 0.25rem;
            justify-content: flex-start;
        }
        
        .main-header .account-control {
            display: none;
        }
        
        .sidebar .theme-switcher {
            display: none;
        }
        
        .testimonial-grid { display: none; }
        .testimonial-carousel {
            display: block;
            position: relative;
        }
        .carousel-controls {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        .carousel-controls button {
            background: var(--background-color);
            border: 1px solid var(--text-muted-color);
            color: var(--text-color);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .carousel-controls button:hover {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .mobile-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--card-color);
            height: 65px;
            padding: 0 1rem;
            border-top: 1px solid rgba(0,0,0,0.1);
            z-index: 20;
        }
    
        .dark .mobile-footer {
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .mobile-footer .account-control button, .mobile-footer .account-control span {
             font-size: 0.8rem;
             white-space: nowrap;
        }
    }
`;


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);