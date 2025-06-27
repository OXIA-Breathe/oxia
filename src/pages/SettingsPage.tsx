
import MainLayout from "@/components/layout/MainLayout";
import NotificationSettings from "@/components/settings/NotificationSettings";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, isLoading } = useAuth();

  // If not loading and no user, redirect to auth page
  if (!isLoading && !user) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
        <div className="flex flex-col items-center space-y-6">
          {user && (
            <div className="bg-white rounded-lg shadow-md p-6 w-full text-gray-800">
              <NotificationSettings />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
