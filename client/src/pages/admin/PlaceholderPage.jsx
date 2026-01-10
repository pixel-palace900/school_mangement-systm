import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

const PlaceholderPage = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop();
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Map of page names to their descriptions
  const pageDescriptions = {
    subjects: "Manage school subjects, curriculum, and subject assignments.",
    exams: "Schedule and manage examinations, set exam dates and manage exam results.",
    fees: "Manage fee structure, track payments, and generate fee reports.",
    attendance: "View and manage attendance records across all classes and students.",
    settings: "Configure system settings, user permissions, and school preferences."
  };

  const pageIcons = {
    subjects: "📚",
    exams: "📝",
    fees: "💰",
    attendance: "📋",
    settings: "⚙️"
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
