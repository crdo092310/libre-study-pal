import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import Settings from './Settings';
import AICoach from './AICoach';
import { 
  GraduationCap, 
  Plus, 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Trophy, 
  Star,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Play,
  Pause,
  CheckCircle,
  Brain,
  BarChart3,
  Medal
} from 'lucide-react';

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: string;
  status: string;
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Profile {
  id: string;
  username: string;
  display_name: string;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'leaderboard' | 'settings' | 'coach'>('dashboard');
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(1);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          window.location.href = '/auth';
        } else {
          setTimeout(() => {
            loadUserData(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        window.location.href = '/auth';
      } else {
        loadUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(profileData);

      // Load study plans
      const { data: plansData, error: plansError } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setStudyPlans(plansData || []);

    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .insert([{
          user_id: user.id,
          title,
          description,
          subject,
          priority,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          estimated_hours: estimatedHours,
        }])
        .select()
        .single();

      if (error) throw error;

      setStudyPlans([data, ...studyPlans]);
      resetForm();
      setShowAddForm(false);

      toast({
        title: "Study plan created!",
        description: "Your new study plan has been added successfully.",
      });

    } catch (error: any) {
      toast({
        title: "Error creating study plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateStudyPlanStatus = async (planId: string, status: StudyPlan['status']) => {
    try {
      const { error } = await supabase
        .from('study_plans')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', planId);

      if (error) throw error;

      setStudyPlans(studyPlans.map(plan => 
        plan.id === planId 
          ? { ...plan, status, completed_at: status === 'completed' ? new Date().toISOString() : null }
          : plan
      ));

      if (status === 'completed' && user) {
        // Award XP and update profile
        await awardXP(user.id, 50);
        toast({
          title: "Congratulations!",
          description: "Study plan completed! You earned 50 XP points.",
        });
      }

    } catch (error: any) {
      toast({
        title: "Error updating study plan",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const awardXP = async (userId: string, xpAmount: number) => {
    try {
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('total_xp, level, current_streak')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const newTotalXP = (currentProfile.total_xp || 0) + xpAmount;
      const newLevel = Math.floor(newTotalXP / 100) + 1; // Level up every 100 XP
      const newStreak = (currentProfile.current_streak || 0) + 1;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          total_xp: newTotalXP,
          level: newLevel,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, currentProfile.current_streak || 0)
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Update local profile state
      setProfile(prev => prev ? {
        ...prev,
        total_xp: newTotalXP,
        level: newLevel,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, prev.longest_streak)
      } : null);

      // Create study session record
      await supabase
        .from('study_sessions')
        .insert([{
          user_id: userId,
          duration_minutes: 30, // Default duration
          xp_earned: xpAmount,
          session_type: 'study'
        }]);

    } catch (error: any) {
      console.error('Error awarding XP:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubject('');
    setPriority('medium');
    setDueDate('');
    setEstimatedHours(1);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">StudyPlan AI</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {profile?.display_name || user?.email?.split('@')[0]}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {profile && (
                <div className="hidden md:flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>Level {profile.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-blue-500" />
                    <span>{profile.total_xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-green-500" />
                    <span>{profile.current_streak} day streak</span>
                  </div>
                </div>
              )}
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2"
          >
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
          <Button 
            variant={activeTab === 'leaderboard' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('leaderboard')}
            className="flex items-center gap-2"
          >
            <Medal className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </Button>
          <Button 
            variant={activeTab === 'coach' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('coach')}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Coach</span>
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>

        {/* Render content based on active tab */}
        {activeTab === 'profile' && user && session && <Profile user={user} session={session} />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'settings' && <Settings onSignOut={handleSignOut} />}
        {activeTab === 'coach' && <AICoach />}

        {activeTab === 'dashboard' && (
          <div className="grid gap-6 lg:grid-cols-4">
          {/* Stats Cards */}
          <div className="lg:col-span-4 grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Plans</p>
                    <p className="text-2xl font-bold text-blue-900">{studyPlans.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Completed</p>
                    <p className="text-2xl font-bold text-green-900">
                      {studyPlans.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">In Progress</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {studyPlans.filter(p => p.status === 'in_progress').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Current Level</p>
                    <p className="text-2xl font-bold text-purple-900">{profile?.level || 1}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Study Plans Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">My Study Plans</h2>
              <Button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-primary to-primary-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Study Plan
              </Button>
            </div>

            {/* Add Study Plan Form */}
            {showAddForm && (
              <Card className="bg-card/95 backdrop-blur-sm animate-scale-in">
                <CardHeader>
                  <CardTitle>Create New Study Plan</CardTitle>
                  <CardDescription>Add a new subject or topic to your study schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createStudyPlan} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Math Chapter 5"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="e.g., Mathematics"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what you'll study..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                          id="due_date"
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimated_hours">Estimated Hours</Label>
                        <Input
                          id="estimated_hours"
                          type="number"
                          min="1"
                          value={estimatedHours}
                          onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                            Creating...
                          </>
                        ) : (
                          'Create Study Plan'
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Study Plans List */}
            <div className="space-y-4">
              {studyPlans.length === 0 ? (
                <Card className="bg-card/95 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No study plans yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first study plan to get started with your learning journey!
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Study Plan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                studyPlans.map((plan) => (
                  <Card key={plan.id} className="bg-card/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{plan.title}</h3>
                            <Badge className={`${getPriorityColor(plan.priority)} text-white`}>
                              {plan.priority}
                            </Badge>
                            <Badge className={`${getStatusColor(plan.status)} text-white`}>
                              {plan.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{plan.subject}</p>
                          {plan.description && (
                            <p className="text-sm mb-3">{plan.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {plan.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Due: {new Date(plan.due_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{plan.estimated_hours}h estimated</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {plan.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateStudyPlanStatus(plan.id, 'in_progress')}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {plan.status === 'in_progress' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateStudyPlanStatus(plan.id, 'completed')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStudyPlanStatus(plan.id, 'paused')}
                              >
                                <Pause className="h-4 w-4 mr-1" />
                                Pause
                              </Button>
                            </>
                          )}
                          {plan.status === 'paused' && (
                            <Button
                              size="sm"
                              onClick={() => updateStudyPlanStatus(plan.id, 'in_progress')}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Coach Card */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Study Coach
                </CardTitle>
                <CardDescription>Get personalized study recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
                  Ask AI Coach
                </Button>
              </CardContent>
            </Card>

            {/* Progress Card */}
            {profile && (
              <Card className="bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Level Progress</span>
                      <span>{profile.total_xp % 100}/100 XP</span>
                    </div>
                    <Progress value={profile.total_xp % 100} className="h-2" />
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Current Streak:</span>
                      <span className="font-semibold">{profile.current_streak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Streak:</span>
                      <span className="font-semibold">{profile.longest_streak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total XP:</span>
                      <span className="font-semibold">{profile.total_xp}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}