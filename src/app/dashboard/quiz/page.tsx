// Quiz page
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";

export default function QuizPage() {
  return (
    <DashboardLayout title="Quiz" description="Luyện tập với các dạng câu hỏi đa dạng">
      <Card>
        <p className="text-slate-500">Quiz module — sắp ra mắt</p>
      </Card>
    </DashboardLayout>
  );
}
