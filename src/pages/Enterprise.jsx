import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { BriefcaseBusiness } from 'lucide-react';

function Enterprise() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-12 py-10 w-full max-w-6xl mx-auto">

            {/* Title */}
            <div className="mb-10 flex items-center gap-4">
              <BriefcaseBusiness className="w-8 h-8 text-violet-600" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Thông tin doanh nghiệp
              </h1>
            </div>

            {/* Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {[
                  { label: 'Tên công ty', value: 'Công ty TNHH Gạo Việt' },
                  { label: 'Mã số thuế', value: '0301234567' },
                  { label: 'Địa chỉ', value: 'Số 1 Đường Gạo, Quận 12, TP.HCM' },
                  { label: 'Điện thoại', value: '(028) 1234 5678' },
                  { label: 'Email', value: 'info@gaoviet.vn' },
                  { label: 'Người đại diện', value: 'Nguyễn Văn A' },
                  { label: 'Ngày thành lập', value: '01/01/2010' },
                  { label: 'Website', value: 'www.gaoviet.vn' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-base font-semibold text-gray-800 dark:text-white">{item.value}</p>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Enterprise;
