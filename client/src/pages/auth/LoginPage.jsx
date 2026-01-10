import LoginForm from '../../components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import DebugAuth from '../../components/DebugAuth';
// Temporarily comment out lucide-react imports until dependencies are fixed
// import { BookOpen, Lock } from "lucide-react";
// Using placeholder components instead
const BookOpen = () => <span className="h-6 w-6 text-white">📚</span>;
const Lock = () => <span className="h-3 w-3 mr-1">🔒</span>;

const LoginPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/login-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8 animate-scale-in">
          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border-2 border-white/30">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Glassmorphism Card */}
        <Card className="w-full glass-strong shadow-2xl border-white/30 animate-slide-up">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-white">School Management</CardTitle>
            <CardDescription className="text-white/80 text-base">
              Sign in to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="flex flex-col border-t border-white/20 pt-4">
            <div className="text-xs text-white/70 text-center flex items-center justify-center">
              <Lock className="h-3 w-3 mr-1" />
              This is a secure system. Unauthorized access is prohibited.
            </div>
          </CardFooter>
        </Card>

        {/* Debug component - remove this in production */}
        <div className="mt-8">
          <DebugAuth />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
