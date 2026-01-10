import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

const PlaceholderPage = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop();
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{formattedPageName}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This page is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold mb-2">Under Construction</h2>
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
