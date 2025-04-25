"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar"; // Если у тебя своего нет — могу отдельно скинуть календарь
import Image from "next/image";

const Dashboard = () => {
  const weekData = [
    { day: "Пн", requests: 12 },
    { day: "Вт", requests: 10 },
    { day: "Ср", requests: 15 },
    { day: "Чт", requests: 11 },
    { day: "Пт", requests: 17 },
    { day: "Сб", requests: 8 },
    { day: "Вс", requests: 1 },
  ];

  return (
    <main className="p-4 md:p-8 space-y-6">
      {/* Статусы */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card  style={{ backgroundColor: '#3b82f6' }} className="text-white flex flex-col items-center py-6 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">✔️</div>
          <div className="text-4xl font-bold">4</div>
          <div className="mt-1 text-sm">Согласовано</div>
        </Card>
        <Card className="flex flex-col items-center py-6 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">🔔</div>
          <div className="text-4xl font-bold">2</div>
          <div className="mt-1 text-sm">В ожидании</div>
        </Card>
        <Card className="flex flex-col items-center py-6 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">❌</div>
          <div className="text-4xl font-bold">4</div>
          <div className="mt-1 text-sm">Отклонено</div>
        </Card>
      </section>

      {/* Новости и Календарь */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Новости проекта */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Новости проекта</h2>
          {[1, 2].map((id) => (
            <Card key={id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
              <div className="flex-1">
                <div className="text-gray-400 text-sm mb-1">от 11.03.2025</div>
                <div className="font-bold mb-2">Заголовок новость {id}</div>
                <div className="text-gray-600 text-sm">Текст новости</div>
              </div>
              <div className="w-full sm:w-32 h-24 relative">
                <Image
                  src="/assets/images/unknown.png" // реальный путь
                  alt="Новость"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Календарь */}
        <div>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Март 2025</h2>
            <Calendar />
          </Card>
        </div>
      </section>

      {/* Графики */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График по неделе */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Всего заявок за текущую неделю</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <XAxis dataKey="day" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="requests" fill="#00CFFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Общее количество заявок */}
        <Card className="p-4 flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-4">Общее количество заявок</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span>Заявки</span>
              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div className="bg-primary h-full rounded-full w-2/5"></div>
              </div>
              <span className="text-sm font-semibold">1024</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Заявки</span>
              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div className="bg-primary h-full rounded-full w-4/5"></div>
              </div>
              <span className="text-sm font-semibold">1983</span>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;