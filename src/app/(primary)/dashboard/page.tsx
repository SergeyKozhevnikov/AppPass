"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
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

  const news = [
    {
      id: 1,
      date: "15.03.2025",
      title: "Запущена новая система электронных пропусков",
      content: "Теперь сотрудники и гости предприятия могут подавать заявки на пропуски через удобный веб-интерфейс. Упрощён процесс согласования, а статус заявки можно отслеживать в реальном времени.",
      image: "/assets/images/sistemOfAccess.webp"
    },
    {
      id: 2,
      date: "18.03.2025",
      title: "Добавлена возможность прикрепления фото для пропусков",
      content: "В форму подачи заявки добавлена функция загрузки фотографии. Это ускорит процесс изготовления пропусков и исключит ошибки при идентификации.",
      image: "/assets/images/sistemOfAccess.webp"
    },
    {
      id: 3,
      date: "20.03.2025",
      title: "Внедрена двухэтапная система согласования для гостевых пропусков",
      content: "Теперь гостевые пропуски требуют подтверждения не только от службы безопасности, но и от принимающего сотрудника. Это повысит контроль доступа на территорию.",
      image: "/assets/images/sistemOfAccess.webp"
    }
  ];

  return (
    <main className="p-4 md:p-8 space-y-6">
      {/* Статусы */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card style={{ backgroundColor: '#3b82f6' }} className="text-white flex flex-col items-center py-6 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">✔️</div>
          <div className="text-4xl font-bold">98</div>
          <div className="mt-1 text-sm">Согласовано</div>
        </Card>
        <Card className="flex flex-col items-center py-6 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">🔔</div>
          <div className="text-4xl font-bold">22</div>
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
          {news.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
              <div className="flex-1">
                <div className="text-gray-400 text-sm mb-1">от {item.date}</div>
                <div className="font-bold mb-2">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.content}</div>
              </div>
              <div className="w-full sm:w-32 h-24 relative">
                <Image
                  src={item.image}
                  alt={item.title}
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
              <span>Всего за неделю</span>
              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[124px]"></div>
              </div>
              <span className="text-sm font-semibold">124</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Всего за месяц</span>
              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[532px]"></div>
              </div>
              <span className="text-sm font-semibold">532</span>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;