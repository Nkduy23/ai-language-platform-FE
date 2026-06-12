// Profile page
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <DashboardLayout title="Hồ sơ" description="Thông tin tài khoản và tiến trình">
      <Card>
        <p className="text-slate-500">Profile — sắp ra mắt</p>
      </Card>
    </DashboardLayout>
  );
}
