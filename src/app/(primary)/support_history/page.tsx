// src/app/(primary)/support/page.tsx
'use client';

import { useState } from 'react';
import FilterForm from './FilterForm';
import SupportTable from './SupportTable';
import { supportTickets } from './supportData';

export default function SupportPage() {
  const [filteredTickets, setFilteredTickets] = useState(supportTickets);

  const handleFilterChange = (filters: {
    fullName?: string;
    problem?: string;
    email?: string;
    phoneNumber?: string;
  }) => {
    const filtered = supportTickets.filter((ticket) => {
      return (
        (!filters.fullName || ticket.fullName.includes(filters.fullName)) &&
        (!filters.problem || ticket.problem.includes(filters.problem)) &&
        (!filters.email || ticket.email.includes(filters.email)) &&
        (!filters.phoneNumber || ticket.phoneNumber.includes(filters.phoneNumber))
      );
    });
    setFilteredTickets(filtered);
  };

  return (
    <div className="p-6 space-y-6">
      {/* === Заголовок страницы с синим фоном и центром === */}
      <div className="bg-blue-500 text-white text-center py-4 rounded-md shadow-md">
        <h1 className="text-xl md:text-2xl font-bold">Заявки в техническую поддержку</h1>
      </div>

      {/* === Блок фильтрации === */}
      <div className="space-y-2">
        {/* Заголовок "Фильтрация" */}
        <h2 className="text-lg font-semibold text-gray-700">Фильтрация</h2>

        {/* Форма фильтрации в одной строке */}
        <FilterForm onFilterChange={handleFilterChange} />
      </div>

      {/* === Таблица заявок === */}
      <SupportTable tickets={filteredTickets} />
    </div>
  );
}