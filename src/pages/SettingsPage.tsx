
import MainLayout from "@/components/layout/MainLayout";
import SettingsForm from "@/components/settings/SettingsForm";

const SettingsPage = () => {
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Breathing Settings</h1>
        <div className="flex justify-center">
          <SettingsForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
