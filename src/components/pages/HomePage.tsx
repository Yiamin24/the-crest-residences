// HPI 1.5-V
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  Trees, 
  Building2, 
  Home, 
  Wind, 
  Shield, 
  Users, 
  Dumbbell,
  Waves,
  TreePine,
  GraduationCap,
  Hospital,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowRight,
  MoveRight,
  Star
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { 
  ProjectHighlights, 
  ClubhouseAmenities, 
  OutdoorAmenities, 
  LocationHighlights 
} from '@/entities';

// --- Utility Components ---

type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    element.classList.add('is-visible');
                }, delay);
                observer.unobserve(element); 
            }
        }, { threshold: 0.1 });

        observer.observe(element);
        return () => observer.disconnect();
    }, [delay]);

    return <div ref={ref} className={`${className || ''} reveal-element`}>{children}</div>;
};

const ParallaxSection = ({ children, className, offset = 50 }: { children: React.ReactNode, className?: string, offset?: number }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div style={{ y }} className="w-full h-full">
                {children}
            </motion.div>
        </div>
    );
};

// --- Main Component ---

export default function HomePage() {
  // --- Canonical Data Sources ---
  const [projectHighlights, setProjectHighlights] = useState<ProjectHighlights[]>([]);
  const [clubhouseAmenities, setClubhouseAmenities] = useState<ClubhouseAmenities[]>([]);
  const [outdoorAmenities, setOutdoorAmenities] = useState<OutdoorAmenities[]>([]);
  const [locationHighlights, setLocationHighlights] = useState<LocationHighlights[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [activeOutdoorCategory, setActiveOutdoorCategory] = useState<string>('Active Life');
  const [headerBgOpacity, setHeaderBgOpacity] = useState(0);
  const [isInHeroSection, setIsInHeroSection] = useState(true);

  // --- Scroll Hooks ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- Header Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroHeight = window.innerHeight;
      const opacity = Math.min(scrolled / (heroHeight * 0.3), 1);
      setHeaderBgOpacity(opacity);
      
      // Determine if user is in hero section (scrolled less than hero height)
      setIsInHeroSection(scrolled < heroHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Data Fetching (Preserved) ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [highlights, clubhouse, outdoor, location] = await Promise.all([
      BaseCrudService.getAll<ProjectHighlights>('projecthighlights'),
      BaseCrudService.getAll<ClubhouseAmenities>('clubhouseamenities'),
      BaseCrudService.getAll<OutdoorAmenities>('outdooramenities'),
      BaseCrudService.getAll<LocationHighlights>('locationhighlights')
    ]);
    
    setProjectHighlights(highlights.items);
    setClubhouseAmenities(clubhouse.items);
    setOutdoorAmenities(outdoor.items);
    setLocationHighlights(location.items);
  };

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! We'll contact you soon at ${formData.phone}`);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getIconForHighlight = (field: string) => {
    if (field.includes('landParcel')) return <Trees className="w-8 h-8" />;
    if (field.includes('structure')) return <Building2 className="w-8 h-8" />;
    if (field.includes('unit')) return <Home className="w-8 h-8" />;
    if (field.includes('openSpace')) return <Wind className="w-8 h-8" />;
    if (field.includes('vaastu')) return <Shield className="w-8 h-8" />;
    if (field.includes('privacy')) return <Users className="w-8 h-8" />;
    if (field.includes('density')) return <Building2 className="w-8 h-8" />;
    return <CheckCircle2 className="w-8 h-8" />;
  };

  const getIconForCategory = (cat: string) => {
    if (cat === 'Educational Institutes') return <GraduationCap className="w-6 h-6" />;
    if (cat === 'Healthcare') return <Hospital className="w-6 h-6" />;
    if (cat === 'Shopping & Lifestyle') return <ShoppingBag className="w-6 h-6" />;
    return <MapPin className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-background font-paragraph text-foreground selection:bg-primary selection:text-white overflow-x-clip">
      <style>{`
        .reveal-element {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s cubic-bezier(0.215, 0.61, 0.355, 1), transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .reveal-element.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }
        .clip-image-dynamic {
          clip-path: polygon(10% 0, 100% 0, 100% 90%, 0% 100%);
        }
        .text-stroke {
          -webkit-text-stroke: 1px rgba(191, 126, 70, 0.3);
          color: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Merged Navigation & Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
            <Image
                src="https://static.wixstatic.com/media/cef78c_bf612627d1364d9ead275224f0e62bdf~mv2.png"
                alt="The Crest - Luxury Building with Pool"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        </div>

        {/* Fixed Header - Overlaid on Hero */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{
            backgroundColor: `rgba(251, 237, 214, ${headerBgOpacity})`,
            backdropFilter: headerBgOpacity > 0.1 ? 'blur(12px)' : 'none',
            borderBottom: headerBgOpacity > 0.1 ? '1px solid rgba(191, 126, 70, 0.1)' : 'none'
          }}
        >
          <div className="max-w-[120rem] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className={`font-heading font-bold text-2xl tracking-tight transition-colors duration-300 ${
                headerBgOpacity > 0.5 ? 'text-primary' : 'text-white'
              }`}>THE CREST</span>
              <span className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                isInHeroSection ? 'text-white opacity-80' : (headerBgOpacity > 0.5 ? 'text-foreground opacity-60' : 'text-white opacity-40')
              }`}>By SLV Estates</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
               <div className={`flex gap-4 text-xs font-medium tracking-wide transition-colors duration-300 ${
                 isInHeroSection ? 'text-white opacity-80' : (headerBgOpacity > 0.5 ? 'text-foreground opacity-80' : 'text-white opacity-60')
               }`}>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> BBMP Approved</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> RERA Registered</span>
               </div>
               <Button 
                 onClick={scrollToContact} 
                 className={`rounded-full px-8 transition-all duration-300 ${
                   headerBgOpacity > 0.5 
                     ? 'bg-primary hover:bg-primary/90 text-white' 
                     : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                 }`}
               >
                  Enquire Now
               </Button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-start px-4 sm:px-6 container mx-auto text-center md:text-left">
            <AnimatedElement>
                <h2 className="text-white/80 text-xs sm:text-sm md:text-lg tracking-[0.3em] uppercase mb-2 sm:mb-4 font-light">Premium Living by SLV Estates</h2>
            </AnimatedElement>
            <AnimatedElement delay={200}>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-white leading-[0.9] mb-4 sm:mb-6 mix-blend-overlay">
                    <span className="text-primary-foreground opacity-90">THE CREST</span>
                </h1>
            </AnimatedElement>
            <AnimatedElement delay={400}>
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start max-w-2xl mb-4 sm:mb-6">
                    <p className="text-white/90 text-sm sm:text-base md:text-lg font-light leading-relaxed backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg bg-white/5 border border-white/10">
                        Rise Above the Ordinary: A 13-Story Masterpiece on 5 Acres of Serenity
                    </p>
                </div>
            </AnimatedElement>
            <AnimatedElement delay={600}>
                <Button onClick={scrollToContact} size="lg" className="bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-full shadow-2xl shadow-primary/30 transition-transform hover:scale-105">
                    Begin Your Journey
                </Button>
            </AnimatedElement>
        </div>
      </section>

      {/* Project Highlights - Cinematic Motion-Driven Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 relative z-20 bg-black overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/5 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-[120rem] mx-auto relative z-10">
            {/* Header Section */}
            <div className="mb-12 sm:mb-16 lg:mb-24 relative">
                <AnimatedElement>
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <span className="text-primary font-medium tracking-widest uppercase text-xs sm:text-sm">Architectural Excellence</span>
                        <h2 className="text-4xl sm:text-5xl lg:text-8xl font-heading font-bold text-white leading-tight">
                            Project <br/><span className="text-primary">Highlights</span>
                        </h2>
                        <p className="text-base sm:text-lg text-white/60 max-w-2xl font-light">
                            Discover the defining features that set The Crest apart. Every element meticulously crafted for perfection.
                        </p>
                    </div>
                </AnimatedElement>
            </div>

            {/* Cinematic Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-max">
                {projectHighlights.length > 0 && projectHighlights[0] && (
                    <>
                        {[
                            { label: 'Land Parcel', value: projectHighlights[0].landParcel, icon: 'landParcel', img: projectHighlights[0].landParcelImage, span: 'lg:col-span-1 lg:row-span-2' },
                            { label: 'Structure', value: projectHighlights[0].structureDetails, icon: 'structure', img: projectHighlights[0].structureDetailsImage, span: 'lg:col-span-1 lg:row-span-2' },
                            { label: 'Configuration', value: projectHighlights[0].unitConfiguration, icon: 'unit', img: projectHighlights[0].unitConfigurationImage, span: 'lg:col-span-1' },
                            { label: 'Open Space', value: projectHighlights[0].openSpacePercentage, icon: 'openSpace', img: projectHighlights[0].openSpacePercentageImage, span: 'lg:col-span-1' },
                            { label: 'Vaastu', value: projectHighlights[0].vaastuCompliance, icon: 'vaastu', img: projectHighlights[0].vaastuComplianceImage, span: 'lg:col-span-1' },
                            { label: 'Privacy', value: projectHighlights[0].privacyFeature, icon: 'privacy', img: projectHighlights[0].privacyFeatureImage, span: 'lg:col-span-1' },
                            { label: 'Density', value: projectHighlights[0].densityType, icon: 'density', img: projectHighlights[0].densityTypeImage, span: 'lg:col-span-1' },
                            { label: 'Approvals', value: 'RERA & BBMP', icon: 'check', img: null, span: 'lg:col-span-1' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.08 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-primary/50 transition-all duration-500 backdrop-blur-sm ${item.span}`}
                            >
                                {/* Animated Gradient Border */}
                                <motion.div 
                                  className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                  style={{
                                    background: 'linear-gradient(45deg, transparent, rgba(191, 126, 70, 0.2), transparent)',
                                    backgroundSize: '200% 200%'
                                  }}
                                  animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                />

                                {/* Image Section with Parallax */}
                                {item.img ? (
                                    <div className="relative h-48 sm:h-56 lg:h-80 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/10">
                                        <motion.div
                                          whileHover={{ scale: 1.15 }}
                                          transition={{ duration: 0.8 }}
                                          className="w-full h-full"
                                        >
                                            <Image 
                                                src={item.img} 
                                                alt={item.label} 
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                        <motion.div 
                                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                                          initial={{ opacity: 0.3 }}
                                          whileHover={{ opacity: 0.6 }}
                                          transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 sm:h-56 lg:h-80 bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                          className="absolute inset-0 opacity-10"
                                        >
                                            <div className="w-full h-full flex items-center justify-center">
                                                {getIconForHighlight(item.icon)}
                                            </div>
                                        </motion.div>
                                        <div className="relative z-10 text-primary/50">
                                            {getIconForHighlight(item.icon)}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Content Section */}
                                <div className="p-4 sm:p-6 lg:p-8 relative z-20">
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                                      viewport={{ once: true }}
                                      className="flex items-start justify-between mb-4"
                                    >
                                        <div className="text-primary opacity-80 group-hover:opacity-100 transition-opacity w-6 h-6 sm:w-8 sm:h-8">
                                            {getIconForHighlight(item.icon)}
                                        </div>
                                        <motion.div
                                          initial={{ opacity: 0, x: 10 }}
                                          whileHover={{ opacity: 1, x: 0 }}
                                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                                        </motion.div>
                                    </motion.div>
                                    
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      whileInView={{ opacity: 1 }}
                                      transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                                      viewport={{ once: true }}
                                    >
                                        <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2 sm:mb-3 font-medium">{item.label}</h3>
                                        <p className="text-lg sm:text-2xl lg:text-3xl font-heading font-bold text-white group-hover:text-primary transition-colors duration-500">
                                            {item.value}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Hover Glow Effect */}
                                <motion.div
                                  className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                                  style={{
                                    background: 'radial-gradient(circle at center, rgba(191, 126, 70, 0.3), transparent)'
                                  }}
                                />
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
        </div>
      </section>

      {/* Clubhouse Experience - Cinematic Magazine Style */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white overflow-hidden relative">
        {/* Animated Background */}
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
                <motion.div 
                  className="lg:col-span-5"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                    <AnimatedElement>
                        <span className="text-primary font-medium tracking-widest uppercase text-xs sm:text-sm">Indoor Luxury</span>
                        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-heading font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
                            15,000+ Sq. Ft.<br/>Clubhouse
                        </h2>
                        <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-6 sm:mb-8">
                            Step into a world of refined elegance. From the grand entrance plaza to the state-of-the-art fitness center, every corner is designed for your indulgence.
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {['Grand Lobby', 'Co-Working', 'Gaming Zone', 'Terrace Garden'].map((tag, i) => (
                                <motion.span 
                                  key={i} 
                                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(191, 126, 70, 1)', color: 'white' }}
                                  className="px-3 sm:px-4 py-2 rounded-full border border-foreground/10 text-xs sm:text-sm hover:border-primary transition-colors cursor-default"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>
                    </AnimatedElement>
                </motion.div>
                <motion.div 
                  className="lg:col-span-7 relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                    <div className="relative aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
                        <Image 
                            src="https://static.wixstatic.com/media/cef78c_2958cf93704e4b678fcf12056fcbfd52~mv2.png?originWidth=1600&originHeight=896" 
                            alt="Clubhouse Grand Lobby" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                          initial={{ opacity: 0.5 }}
                          whileHover={{ opacity: 0.7 }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 relative z-10">
                            <motion.p 
                              className="text-white font-heading text-lg sm:text-2xl"
                              initial={{ y: 20, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.6, delay: 0.4 }}
                              viewport={{ once: true }}
                            >
                                Grand Entrance Plaza
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Amenities Grid with Stagger */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {clubhouseAmenities.slice(0, 6).map((amenity, idx) => (
                    <motion.div
                        key={amenity._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-background"
                    >
                        {amenity.image ? (
                            <Image 
                                src={amenity.image} 
                                alt={amenity.amenityName || ''} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 sm:w-10 sm:h-10 text-primary/50" />
                            </div>
                        )}
                        <motion.div 
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 sm:p-4 text-center"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                            <span className="text-white font-medium text-xs sm:text-sm">{amenity.amenityName}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            
            <motion.div 
              className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 border-t border-foreground/10 pt-8 sm:pt-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
                {clubhouseAmenities.slice(6).map((amenity, idx) => (
                    <motion.div 
                      key={amenity._id} 
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3 sm:gap-4 group cursor-pointer"
                    >
                        <motion.div 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                        <div>
                            <h4 className="font-heading font-bold text-base sm:text-lg">{amenity.amenityName}</h4>
                            {amenity.isAvailable24_7 && <span className="text-xs text-primary font-medium">24/7 Access</span>}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* Outdoor Amenities - Cinematic Sticky Scroll Experience */}
      <section className="relative bg-background py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 relative z-10">
            <motion.div 
              className="text-center mb-12 sm:mb-16 lg:mb-24 relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
                <h2 className="text-5xl sm:text-6xl lg:text-8xl font-heading font-bold text-primary/10 absolute left-0 right-0 -top-8 sm:-top-12 select-none pointer-events-none">
                    OUTDOORS
                </h2>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-heading font-bold relative z-10">
                    Life Beyond <span className="text-primary">Four Walls</span>
                </h2>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
                {/* Sticky Navigation */}
                <div className="lg:w-1/4">
                    <motion.div 
                      className="sticky top-20 sm:top-32 space-y-3 sm:space-y-4"
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                        {['Active Life', 'Family & Kids', 'Nature & Zen'].map((category, idx) => (
                            <motion.button
                                key={category}
                                onClick={() => {
                                    setActiveOutdoorCategory(category);
                                    document.getElementById(`outdoor-${category}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full text-left py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-between group ${
                                    activeOutdoorCategory === category 
                                    ? 'bg-primary text-white shadow-lg' 
                                    : 'bg-white hover:bg-white/50 text-foreground/60'
                                }`}
                            >
                                <span className="font-heading font-bold text-base sm:text-xl">{category}</span>
                                <motion.div
                                  animate={{ x: activeOutdoorCategory === category ? 4 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                    <MoveRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${activeOutdoorCategory === category ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                </motion.div>
                            </motion.button>
                        ))}
                        <motion.div 
                          className="mt-6 sm:mt-8 p-4 sm:p-6 bg-secondary/20 rounded-lg sm:rounded-2xl"
                          whileHover={{ scale: 1.02 }}
                        >
                            <p className="text-xs sm:text-sm text-foreground/70 italic">
                                "Designed to reconnect you with nature and community."
                            </p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scrollable Content */}
                <div className="lg:w-3/4 space-y-16 sm:space-y-24 lg:space-y-32">
                    {['Active Life', 'Family & Kids', 'Nature & Zen'].map((category) => {
                        const items = outdoorAmenities.filter(a => a.category === category);
                        if (items.length === 0) return null;

                        return (
                            <motion.div 
                              key={category} 
                              id={`outdoor-${category}`} 
                              className="scroll-mt-20 sm:scroll-mt-32"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 0.6 }}
                              viewport={{ once: true }}
                            >
                                <AnimatedElement>
                                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                        <div className="h-px flex-1 bg-primary/30"></div>
                                        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-primary whitespace-nowrap">{category}</h3>
                                        <div className="h-px flex-1 bg-primary/30"></div>
                                    </div>
                                </AnimatedElement>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                    {items.map((amenity, idx) => (
                                        <motion.div
                                            key={amenity._id}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 h-[250px] sm:h-[300px]"
                                        >
                                            {amenity.amenityImage ? (
                                                <Image 
                                                    src={amenity.amenityImage} 
                                                    alt={amenity.amenityName || ''} 
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-secondary/10" />
                                            )}
                                            <motion.div 
                                              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"
                                              initial={{ opacity: 0.8 }}
                                              whileHover={{ opacity: 0.9 }}
                                            />
                                            
                                            <motion.div 
                                              className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8"
                                              initial={{ y: 20 }}
                                              whileHover={{ y: 0 }}
                                              transition={{ duration: 0.3 }}
                                            >
                                                <h4 className="text-xl sm:text-2xl font-heading font-bold text-white mb-1 sm:mb-2">{amenity.amenityName}</h4>
                                                {amenity.description && (
                                                    <motion.p 
                                                      className="text-white/80 text-xs sm:text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                                                      initial={{ opacity: 0 }}
                                                      whileHover={{ opacity: 1 }}
                                                    >
                                                        {amenity.description}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                            {amenity.isFeatured && (
                                                <motion.div 
                                                  className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-primary text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full"
                                                  initial={{ scale: 0 }}
                                                  whileInView={{ scale: 1 }}
                                                  transition={{ duration: 0.4, delay: 0.2 }}
                                                >
                                                    FEATURED
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
      </section>

      {/* Location Highlights - Cinematic Split Screen */}
      <section className="py-0 bg-white overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-auto">
            <div className="lg:w-1/2 p-6 sm:p-12 lg:p-24 flex flex-col justify-center bg-secondary/5 min-h-[50vh] lg:min-h-screen">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                    <AnimatedElement>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6">
                            Unbeatable <br/><span className="text-primary">Connectivity</span>
                        </h2>
                        <p className="text-base sm:text-lg text-foreground/70 mb-8 sm:mb-12 max-w-md">
                            Strategically located to keep you connected to the city's pulse while offering a serene retreat.
                        </p>
                    </AnimatedElement>
                </motion.div>

                <div className="space-y-8 sm:space-y-12">
                    {['Educational Institutes', 'Healthcare', 'Shopping & Lifestyle', 'Key Distances'].map((category, idx) => {
                        const items = locationHighlights.filter(l => l.category === category);
                        if (items.length === 0) return null;

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <AnimatedElement delay={idx * 100}>
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <motion.div 
                                          className="p-2 sm:p-3 bg-white rounded-lg shadow-sm text-primary flex-shrink-0"
                                          whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            {getIconForCategory(category)}
                                        </motion.div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{category}</h3>
                                            <ul className="space-y-2 sm:space-y-3">
                                                {items.map(item => (
                                                    <motion.li 
                                                      key={item._id} 
                                                      whileHover={{ x: 5 }}
                                                      className="flex justify-between items-center text-xs sm:text-sm border-b border-foreground/5 pb-2 last:border-0 gap-2"
                                                    >
                                                        <span className="text-foreground/80 truncate">{item.locationName}</span>
                                                        {item.distanceValue && (
                                                            <span className="font-bold text-primary whitespace-nowrap ml-2">
                                                                {item.distanceValue} {item.distanceUnit || 'km'}
                                                            </span>
                                                        )}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </AnimatedElement>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <div className="lg:w-1/2 relative min-h-[40vh] sm:min-h-[50vh] lg:min-h-screen">
                <motion.div 
                  className="sticky top-0 h-[40vh] sm:h-[50vh] lg:h-screen w-full"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                    <Image 
                        src="https://static.wixstatic.com/media/cef78c_f8bb81edc65349eb8d150c0048074407~mv2.png?originWidth=1600&originHeight=896" 
                        alt="Location Map" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
                    <motion.div 
                      className="absolute bottom-4 sm:bottom-8 lg:bottom-12 left-4 sm:left-8 lg:left-12 right-4 sm:right-8 lg:right-12 bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-2xl max-w-xs sm:max-w-md"
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                    >
                        <div className="flex items-center gap-3 sm:gap-4">
                            <motion.div 
                              className="bg-primary text-white p-2 sm:p-3 rounded-full flex-shrink-0"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                                <MapPin className="w-4 h-4 sm:w-6 sm:h-6" />
                            </motion.div>
                            <div className="min-w-0">
                                <p className="font-bold text-base sm:text-lg">Prime Location</p>
                                <p className="text-xs sm:text-sm text-foreground/70">Hennur 80 Ft Road Access</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Contact Section - Cinematic High Contrast */}
      <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 clip-diagonal"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
        
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-24">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                    <AnimatedElement>
                        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-heading font-bold mb-4 sm:mb-6 lg:mb-8 text-white">
                            Begin Your <br/><span className="text-primary">Legacy</span>
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-white/60 mb-8 sm:mb-12 font-light">
                            Exclusive residences for the discerning few. Reach out to schedule your private viewing.
                        </p>
                    </AnimatedElement>

                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.02, x: 10 }}
                          className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <motion.div 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.div>
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider">Sales Manager</p>
                                <p className="text-lg sm:text-2xl font-heading font-bold text-white">Amar</p>
                            </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.02, x: 10 }}
                          className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <motion.div 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.div>
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider">Direct Line</p>
                                <a href="tel:+919513604777" className="text-lg sm:text-2xl font-heading font-bold text-white hover:text-primary transition-colors">
                                    +91 9513604777
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-foreground shadow-2xl"
                >
                    <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Enquire Now</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <motion.div 
                              className="space-y-2"
                              whileHover={{ scale: 1.02 }}
                            >
                                <label className="text-xs sm:text-sm font-medium ml-1">Name</label>
                                <Input 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="bg-secondary/10 border-0 h-10 sm:h-12 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary text-sm"
                                    placeholder="John Doe"
                                    required
                                />
                            </motion.div>
                            <motion.div 
                              className="space-y-2"
                              whileHover={{ scale: 1.02 }}
                            >
                                <label className="text-xs sm:text-sm font-medium ml-1">Phone</label>
                                <Input 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="bg-secondary/10 border-0 h-10 sm:h-12 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary text-sm"
                                    placeholder="+91..."
                                    required
                                />
                            </motion.div>
                        </div>
                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.02 }}
                        >
                            <label className="text-xs sm:text-sm font-medium ml-1">Email</label>
                            <Input 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="bg-secondary/10 border-0 h-10 sm:h-12 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary text-sm"
                                placeholder="john@example.com"
                                required
                                type="email"
                            />
                        </motion.div>
                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.02 }}
                        >
                            <label className="text-xs sm:text-sm font-medium ml-1">Message</label>
                            <Textarea 
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="bg-secondary/10 border-0 min-h-[100px] sm:min-h-[120px] rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary resize-none text-sm"
                                placeholder="I'm interested in a 3BHK..."
                            />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                            <Button type="submit" className="w-full h-11 sm:h-14 text-sm sm:text-lg bg-primary hover:bg-primary/90 text-white rounded-lg sm:rounded-xl transition-all">
                                Submit Enquiry
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-black text-white/60 py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
                <h4 className="text-white font-heading font-bold text-lg sm:text-xl mb-1">SLV ESTATES</h4>
                <p className="text-xs sm:text-sm">Creating landmarks since 2000</p>
            </motion.div>
            <motion.div 
              className="flex gap-4 sm:gap-8 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
                <motion.a href="#" whileHover={{ color: '#BF7E46' }} className="hover:text-primary transition-colors">Privacy Policy</motion.a>
                <motion.a href="#" whileHover={{ color: '#BF7E46' }} className="hover:text-primary transition-colors">Terms of Service</motion.a>
                <motion.a href="#" whileHover={{ color: '#BF7E46' }} className="hover:text-primary transition-colors">Disclaimer</motion.a>
            </motion.div>
            <motion.div 
              className="text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
                © {new Date().getFullYear()} The Crest. All rights reserved.
            </motion.div>
        </div>
      </footer>
    </div>
  );
}
