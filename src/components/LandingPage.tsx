import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Trophy, 
  Timer, 
  Target, 
  Zap, 
  BookOpen, 
  Users, 
  Smartphone,
  Star,
  CheckCircle,
  TrendingUp,
  Shield
} from "lucide-react";
import heroImage from "@/assets/hero-study.jpg";

const LandingPage = () => {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Study Coach",
      description: "Free AI na tutulong sa pag-summarize ng topics at mag-suggest ng study tips",
      badge: "100% FREE"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Gamification",
      description: "Earn XP, level up, at makakuha ng achievements sa bawat study session",
      badge: "MOTIVATING"
    },
    {
      icon: <Timer className="h-6 w-6" />,
      title: "Pomodoro Timer",
      description: "Focus mode na mag-lo-lock ng distractions para sa productive study",
      badge: "FOCUS BOOST"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Smart Planner",
      description: "Intelligent task scheduling na mag-a-adapt sa study habits mo",
      badge: "ADAPTIVE"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leaderboard",
      description: "Makipag-compete sa friends at makita ang progress rankings",
      badge: "SOCIAL"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "PWA Ready",
      description: "Install as app, works offline, accessible kahit walang internet",
      badge: "OFFLINE"
    }
  ];

  const benefits = [
    "100% Free Forever - Walang hidden fees or subscriptions",
    "Local AI Models - Privacy-first, data mo ay sa'yo lang",
    "Offline Capable - Study anywhere, anytime",
    "Gamified Learning - Make studying fun and rewarding",
    "Filipino-Friendly - Built for Pinoy students",
    "No Signup Required - Start agad, optional lang ang account"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">StudyPlan AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/auth'}>Sign In</Button>
              <Button variant="hero" onClick={() => window.location.href = '/auth'}>Get Started Free</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="animate-float">
                  <Zap className="h-3 w-3 mr-1" />
                  100% Free AI Study Planner
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Study Smarter,{" "}
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Not Harder
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Ang ultimate study companion na may AI coach, gamification, at distraction management. 
                  Walang bayad, walang subscription - puro productivity lang!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" className="animate-slide-up" onClick={() => window.location.href = '/auth'}>
                  <Star className="h-5 w-5 mr-2" />
                  Start Learning Free
                </Button>
                <Button variant="outline" size="xl" className="animate-slide-up" onClick={() => window.location.href = '/auth'}>
                  <BookOpen className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  No Credit Card
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-success mr-2" />
                  Privacy First
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-success mr-2" />
                  Instant Access
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="AI Study Planner Hero"
                className="relative z-10 rounded-2xl shadow-2xl w-full h-auto animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything You Need to{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Excel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete study ecosystem na designed para sa Filipino students - 
              from AI coaching hanggang sa gamified learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute top-0 right-0">
                  <Badge variant="secondary" className="m-4">
                    {feature.badge}
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 bg-gradient-hero rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Why Choose StudyPlan AI?
              </h2>
              <p className="text-xl text-muted-foreground">
                Built specifically for Filipino students na gustong mag-excel without breaking the bank
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-card hover:bg-muted/50 transition-colors duration-300">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-card-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Transform Your Study Game?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of Filipino students na naging successful gamit ang StudyPlan AI.
              Start your journey today - completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" className="text-primary" onClick={() => window.location.href = '/auth'}>
                <Trophy className="h-5 w-5 mr-2" />
                Start Learning Now
              </Button>
              <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => window.location.href = '/auth'}>
                <Users className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">StudyPlan AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StudyPlan AI. Made with ❤️ for Filipino students. 100% Free Forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;