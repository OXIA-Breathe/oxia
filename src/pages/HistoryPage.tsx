
import MainLayout from "@/components/layout/MainLayout";
import SessionHistory from "@/components/history/SessionHistory";

const HistoryPage = () => {
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Breathing History</h1>
        <SessionHistory />
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
