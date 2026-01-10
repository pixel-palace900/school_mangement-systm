import SignupForm from '../../components/auth/SignupForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";

// Temporarily comment out lucide-react imports until dependencies are fixed
// import { BookOpen, Lock } from "lucide-react";
// Using placeholder components instead
const BookOpen = () => <span className="h-6 w-6 text-primary-foreground">📚</span>;
const Lock = () => <span className="h-3 w-3 mr-1">🔒</span>;

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to access the school management system
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SignupForm />
          </CardContent>

          <CardFooter className="flex flex-col border-t pt-4">
            <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
              <Lock className="h-3 w-3 mr-1" />
              Your information is securely stored
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
