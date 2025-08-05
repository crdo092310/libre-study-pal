import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Medal, 
  Star, 
  Target,
  TrendingUp,
  Crown
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading leaderboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Leaderboard
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Top performers in the study community
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {/* 2nd Place */}
          <Card className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-700 order-2 md:order-1">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Medal className="h-12 w-12 text-gray-400" />
              </div>
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarImage src={leaderboard[1]?.avatar_url || ''} />
                <AvatarFallback className="bg-gray-500/20 text-lg">
                  {leaderboard[1]?.display_name?.[0] || leaderboard[1]?.username?.[0] || '2'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{leaderboard[1]?.display_name || leaderboard[1]?.username || 'Anonymous'}</h3>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{leaderboard[1]?.total_xp} XP</p>
              <p className="text-sm text-muted-foreground">Level {leaderboard[1]?.level}</p>
            </CardContent>
          </Card>

          {/* 1st Place */}
          <Card className="bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 border-yellow-300 dark:border-yellow-700 order-1 md:order-2 transform md:scale-105 relative">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Crown className="h-16 w-16 text-yellow-500" />
              </div>
              <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-yellow-400">
                <AvatarImage src={leaderboard[0]?.avatar_url || ''} />
                <AvatarFallback className="bg-yellow-500/20 text-xl">
                  {leaderboard[0]?.display_name?.[0] || leaderboard[0]?.username?.[0] || '1'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-xl">{leaderboard[0]?.display_name || leaderboard[0]?.username || 'Anonymous'}</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{leaderboard[0]?.total_xp} XP</p>
              <p className="text-sm text-muted-foreground">Level {leaderboard[0]?.level}</p>
              <Badge className="mt-2 bg-yellow-500 text-white">🏆 Champion</Badge>
            </CardContent>
          </Card>

          {/* 3rd Place */}
          <Card className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900 border-amber-300 dark:border-amber-700 order-3">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Medal className="h-12 w-12 text-amber-600" />
              </div>
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarImage src={leaderboard[2]?.avatar_url || ''} />
                <AvatarFallback className="bg-amber-500/20 text-lg">
                  {leaderboard[2]?.display_name?.[0] || leaderboard[2]?.username?.[0] || '3'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{leaderboard[2]?.display_name || leaderboard[2]?.username || 'Anonymous'}</h3>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{leaderboard[2]?.total_xp} XP</p>
              <p className="text-sm text-muted-foreground">Level {leaderboard[2]?.level}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Full Rankings
          </CardTitle>
          <CardDescription>Complete leaderboard with all participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                  index < 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(index + 1)}
                </div>

                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.display_name?.[0] || user.username?.[0] || (index + 1).toString()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">
                    {user.display_name || user.username || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Level {user.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {user.current_streak} day streak
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">{user.total_xp} XP</p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getRankBadgeColor(index + 1)}`}
                  >
                    Rank #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rankings yet</h3>
              <p className="text-muted-foreground">
                Start studying and earning XP to appear on the leaderboard!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}