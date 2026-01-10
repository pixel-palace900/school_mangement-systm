import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

const PlaceholderPage = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop();
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Map of page names to their descriptions
  const pageDescriptions = {
    timetable: "View your weekly class schedule with subject and teacher details.",
    attendance: "Track your attendance records and view your attendance percentage.",
    assignments: "Manage your pending and completed assignments.",
    exams: "View upcoming exams and past exam results.",
    grades: "Check your academic performance across different subjects and terms.",
    fees: "View fee payment details and pending payments.",
    library: "Browse and borrow books from the school library.",
    circulars: "Stay updated with school announcements and notices.",
    profile: "View and update your personal information."
  };

  // Map of page names to their icons
  const pageIcons = {
    timetable: "🕒",
    attendance: "📋",
    assignments: "📚",
    exams: "📝",
    grades: "🏆",
    fees: "💰",
    library: "📖",
    circulars: "📢",
    profile: "👤"
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{formattedPageName}</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="text-4xl mr-4">{pageIcons[pageName] || "📄"}</div>
            <div>
              <CardTitle>{formattedPageName}</CardTitle>
              <CardDescription>
                {pageDescriptions[pageName] || "This page is under development."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-gray-500 text-center max-w-md">
              The {formattedPageName} page is currently being developed. 
              Check back soon for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
