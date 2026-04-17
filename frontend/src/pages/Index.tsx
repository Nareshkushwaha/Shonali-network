import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { services } from "@/data/services";

const stats = [
  { value: "200+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "15+", label: "Team Members" },
  { value: "4+", label: "Years Experience" },
];

const features = [
  { icon: Sparkles, title: "Creative Excellence", desc: "Designs that stand out and convert." },
  { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and performance." },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security standards." },
  { icon: Globe, title: "Global Reach", desc: "Solutions that scale worldwide." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Premium Digital Agency
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            We Build <span className="gradient-text">Digital Experiences</span> That Matter
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            From stunning websites to powerful apps, we craft digital solutions that drive growth for modern businesses.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/services">
              <Button size="lg" className="gap-2 rounded-xl">
                Explore Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="rounded-xl">
                Get in Touch
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16 max-w-2xl mx-auto"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center glass-card rounded-2xl p-5">
              <div className="font-display text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
          Why Choose <span className="gradient-text">Shonali Network</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-card rounded-2xl p-6 hover-lift group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:neon-glow transition-shadow">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Services preview */}
    <section className="section-padding bg-gradient-to-b from-transparent to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Our <span className="gradient-text">Services</span>
          </h2>
          <Link to="/services" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(0, 6).map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  to={`/services/${s.slug}`}
                  className="glass-card rounded-2xl p-6 block group hover-lift hover:neon-glow transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.shortDescription}</p>
                  <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
              Ready to Build Something <span className="gradient-text">Amazing</span>?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Let's discuss your next project and create something extraordinary together.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2 rounded-xl">
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
