import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

function Enterprise() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Thông tin doanh nghiệp
              </h1>
            </div>

            {/* Thông tin doanh nghiệp */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tên công ty</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Công ty TNHH Gạo Việt</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mã số thuế</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">0301234567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Số 1 Đường Gạo, Quận 12, TP.HCM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">(028) 1234 5678</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">info@gaoviet.vn</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Người đại diện</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Nguyễn Văn A</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ngày thành lập</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">01/01/2010</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">www.gaoviet.vn</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Enterprise;
