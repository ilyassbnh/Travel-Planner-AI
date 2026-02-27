import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGlobeAmericas, FaBolt, FaDatabase } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
    const container = useRef();
    const navigate = useNavigate();

    useGSAP(() => {
        // Hero Animation
        gsap.fromTo('.hero-text',
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power4.out' }
        );

        // Features Scroll Animation
        const featureCards = gsap.utils.toArray('.feature-card');
        featureCards.forEach((card, i) => {
            gsap.fromTo(card,
                { y: 150, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // CTA Animation
        gsap.fromTo('.cta-section',
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.cta-section',
                    start: 'top 75%'
                }
            }
        );

    }, { scope: container });

    return (
        <div ref={container} className="min-h-screen pb-12 flex flex-col items-center justify-center gap-32">

            {/* HERO SECTION */}
            <section className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
                <h1 className="hero-text text-5xl md:text-7xl font-extrabold tracking-tight">
                    Voyagez plus loin. <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Planifiez moins.
                    </span>
                </h1>
                <p className="hero-text text-lg md:text-2xl text-text-dim max-w-2xl">
                    L'intelligence artificielle au service de vos aventures.
                    Générez des itinéraires sur mesure, calculez vos budgets et sauvegardez le tout de manière sécurisée.
                </p>
                <div className="hero-text pt-8 flex gap-4 flex-col sm:flex-row">
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-8 py-4 bg-accent hover:bg-accent/80 text-white font-bold rounded-full text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all hover:scale-105"
                    >
                        Commencer l'expérience
                    </button>
                    <button
                        onClick={() => {
                            const featuresSection = document.getElementById('features');
                            featuresSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-4 bg-surface border border-white/10 hover:bg-surface/80 text-white font-bold rounded-full text-lg transition-all"
                    >
                        Découvrir
                    </button>
                </div>
            </section>

            {/* IMPORTANCE SECTION */}
            <section id="features" className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="feature-card p-8 rounded-2xl bg-surface/40 border border-white/5 backdrop-blur-md flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-blue-500/20 text-blue-400 text-3xl">
                        <FaBolt />
                    </div>
                    <h3 className="text-xl font-bold text-white">Création Instantanée</h3>
                    <p className="text-text-dim">
                        Ne perdez plus des heures à chercher. Indiquez une destination et des dates, notre IA dresse le programme complet.
                    </p>
                </div>

                <div className="feature-card p-8 rounded-2xl bg-surface/40 border border-white/5 backdrop-blur-md flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-purple-500/20 text-purple-400 text-3xl">
                        <FaGlobeAmericas />
                    </div>
                    <h3 className="text-xl font-bold text-white">Visualisation Immersive</h3>
                    <p className="text-text-dim">
                        Chaque voyage généré est accompagné d'images haute qualité captées en direct via nos APIs pour vous plonger dans le décor.
                    </p>
                </div>

                <div className="feature-card p-8 rounded-2xl bg-surface/40 border border-white/5 backdrop-blur-md flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-green-500/20 text-green-400 text-3xl">
                        <FaDatabase />
                    </div>
                    <h3 className="text-xl font-bold text-white">Sécurité Absolue</h3>
                    <p className="text-text-dim">
                        Vos données ne sont plus stockées dans le cache fragile de votre navigateur, mais encryptées sur nos serveurs PostgreSQL Supabase.
                    </p>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section w-full max-w-3xl px-4 text-center mt-12 mb-32">
                <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                        Prêt à décoller ?
                    </h2>
                    <p className="text-text-dim mb-10 text-lg relative z-10">
                        Inscrivez-vous gratuitement en quelques secondes et générez votre premier itinéraire complet.
                    </p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="relative z-10 px-10 py-4 bg-white text-black font-extrabold rounded-full text-lg transition-transform hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)]"
                    >
                        Tester l'Application
                    </button>
                </div>
            </section>

        </div>
    );
};

export default Landing;
