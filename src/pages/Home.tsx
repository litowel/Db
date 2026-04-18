import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

const slidesData = [
  { img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=600", title: "Scale Your Business", desc: "Gain access to capital that fuels your expansion and growth." },
  { img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600", title: "All Industries", desc: "From tech to retail, we match you with lenders who understand your sector." },
  { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600", title: "Any Company Size", desc: "Whether you're a startup or an enterprise, find right-sized funding." },
  { img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600", title: "Flexible Amounts", desc: "Secure anywhere from $10k to $10M+ depending on your business needs." },
  { img: "https://images.unsplash.com/photo-1541888086925-0c1bb6789c09?auto=format&fit=crop&q=80&w=600", title: "Project Financing", desc: "Fund large-scale infrastructure or long-term industrial projects." },
  { img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600", title: "Mergers & Acquisitions", desc: "Capital to acquire competitors or merge for strategic market dominance." },
  { img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600", title: "Property Purchase", desc: "Commercial real estate loans to buy your own office or warehouse." },
  { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600", title: "Equipment Financing", desc: "Upgrade machinery, vehicles, and tech without massive upfront costs." },
  { img: "https://images.unsplash.com/photo-1580519542036-ed47f3ae3ca8?auto=format&fit=crop&q=80&w=600", title: "Working Capital", desc: "Cover daily operations, payroll, and unexpected expenses smoothly." },
  { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600", title: "Tech Startups", desc: "Specialized venture debt and revenue-based financing for SaaS." },
  { img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600", title: "Healthcare & Clinics", desc: "Expand medical practices and purchase advanced medical equipment." },
  { img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600", title: "Construction", desc: "Bridge loans and project finance to keep building without delays." },
  { img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600", title: "Agriculture", desc: "Seasonal funding for seeds, machinery, and agricultural expansion." },
  { img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600", title: "Retail & E-commerce", desc: "Inventory financing specifically designed for fast-moving consumer goods." },
  { img: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=600", title: "Manufacturing", desc: "Supply chain financing to meet massive production orders." },
  { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600", title: "Fast Application", desc: "A streamlined digital process that saves you weeks of paperwork." },
  { img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600", title: "No Upfront Fees", desc: "Apply and get matched without paying hidden application charges." },
  { img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600", title: "High Approval Rates", desc: "Our AI pre-qualification means you only apply where you fit." },
  { img: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&q=80&w=600", title: "Global Expansion", desc: "Funding to take your local business to the international market." },
  { img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600", title: "Franchise Financing", desc: "Capital to open your next franchise location quickly." },
  { img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=600", title: "Debt Consolidation", desc: "Refinance expensive short-term loans into manageable monthly payments." },
  { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600", title: "Fleet Financing", desc: "Expand your logistics capability with specialized vehicle loans." },
  { img: "https://images.unsplash.com/photo-1494412519320-ce68defdf29e?auto=format&fit=crop&q=80&w=600", title: "Import/Export", desc: "Trade finance solutions to keep international goods moving." },
  { img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600", title: "Invoice Factoring", desc: "Unlock tied-up cash instantly instead of waiting 90 days." },
  { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600", title: "Join Thousands", desc: "Be part of the growing network of businesses funded through our platform." }
];

function ShowcaseCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 bg-gray-900 border-y border-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 flex items-end justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Funding Solutions for Every Need</h2>
          <p className="text-gray-400 text-lg">Swipe through to discover the diverse industries, company sizes, and business purposes we support globally.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <button onClick={scrollPrev} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={scrollNext} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex cursor-grab active:cursor-grabbing px-4">
          {slidesData.map((slide, index) => (
            <div className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 pr-4 sm:pr-6" key={index}>
              <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col group relative">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={slide.img} 
                    alt={slide.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-900 text-xs font-bold px-2 py-1 rounded-md z-20 shadow-sm uppercase tracking-wider">
                    {String(index + 1).padStart(2, '0')} / 25
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{slide.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{slide.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 flex justify-center md:hidden gap-4">
          <button onClick={scrollPrev} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={scrollNext} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
                <Zap className="w-4 h-4" /> Powered by Upfrica.africa
              </span>
              <img src="/logo.png" alt="DealBridge AI Logo" className="h-16 md:h-20 w-auto mb-6 mx-auto object-contain" />
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Unlock Funding for Your Business with AI
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                We analyze your business eligibility and connect you directly to our network of partner lenders. No guesswork, just smart matching.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                  <Link to="/eligibility">
                    Check Eligibility Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                  <Link to="/membership">View Memberships</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                We do not provide capital. We connect you to trusted partners.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How DealBridge AI Works</h2>
            <p className="text-gray-600">A streamlined process to get your business funding-ready and matched with the right capital providers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "AI Eligibility Check",
                desc: "Tell us about your revenue, industry, and social presence. Our AI instantly analyzes your funding potential."
              },
              {
                step: "02",
                title: "Smart Decision Flow",
                desc: "Get a clear 'Qualified' or 'Not Qualified' result with a risk score, estimated funding range, and actionable insights."
              },
              {
                step: "03",
                title: "Match & Apply",
                desc: "Join the right membership tier to either improve your metrics or get direct priority access to partner lenders."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
              >
                <div className="text-5xl font-black text-gray-100 absolute top-6 right-6">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 relative z-10 mt-8">{item.title}</h3>
                <p className="text-gray-600 relative z-10 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 25 Slides Feature Carousel inserted here */}
      <ShowcaseCarousel />

      {/* Value Prop */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">More than just a matching platform</h2>
              <ul className="space-y-6">
                {[
                  "Instant AI-driven risk assessment",
                  "Actionable insights to improve eligibility",
                  "Structured application summaries for lenders",
                  "Access to loans, revenue-based financing, and advances"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8" size="lg">
                <Link to="/eligibility">Start Your Journey</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-emerald-50 rounded-3xl transform rotate-3 scale-105"></div>
              <div className="bg-white border border-gray-200 rounded-3xl p-8 relative shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Estimated Funding</p>
                    <p className="text-3xl font-bold text-gray-900">$50k - $150k</p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Qualified
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-3/4 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600">Risk Score: Low (78/100)</p>
                </div>
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800 font-medium">AI Insight</p>
                  <p className="text-sm text-blue-600 mt-1">Your consistent MRR growth makes you an excellent candidate for revenue-based financing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
