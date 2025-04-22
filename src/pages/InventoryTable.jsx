import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { 
  fetchInventorySummary, 
  setDateRange, 
  clearError, 
  getDateFromTimestamp 
} from '../redux/InventorySummarySlice';
import Loading from '../components/Loading';

function InventoryTable() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Replace local state with Redux state
  const dispatch = useDispatch();
  const { summaryData, loading: isLoading, error, dateRange } = useSelector((state) => state.inventorySummary);
  
  const rowsPerPage = 10;
  
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = summaryData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(summaryData.length / rowsPerPage);

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchInventorySummaryData();
  }, []);

  const fetchInventorySummaryData = () => {
    dispatch(fetchInventorySummary({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }));
  };

  const handleDateChange = (field, value) => {
    // Chuyển đổi chuỗi ngày thành timestamp
    const newDate = new Date(value).getTime();
    dispatch(setDateRange({
      ...dateRange,
      [field]: newDate
    }));
  };

  const handleRefresh = () => {
    fetchInventorySummaryData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm helper để format timestamp thành chuỗi ngày YYYY-MM-DD cho input date
  const formatDateForInput = (timestamp) => {
    const date = getDateFromTimestamp(timestamp);
    return date.toISOString().substring(0, 10);
  };

  const handleExportReport = () => {
    // Implement export functionality here
    alert('Chức năng xuất báo cáo đang được phát triển');
  };

  if (isLoading && summaryData.length === 0) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Bảng tổng hợp xuất nhập tồn</h1>
            </div>
            
            {/* Date filters */}
            <div className="p-4 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formatDateForInput(dateRange.startDate)}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={formatDateForInput(dateRange.endDate)}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors mr-2"
                    onClick={handleRefresh}
                  >
                    Cập nhật
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    onClick={handleExportReport}
                  >
                    Xuất báo cáo
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
                {error}
                <button 
                  className="ml-4 text-sm underline"
                  onClick={() => dispatch(clearError())}
                >
                  Đóng
                </button>
              </div>
            )}
            
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-violet-600 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
              </div>
            ) : summaryData.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Không có dữ liệu tổng hợp xuất nhập tồn trong khoảng thời gian đã chọn.
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <table className="w-full text-sm table-auto">
                    <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap">Mã VT</th>
                        <th className="px-4 py-3 whitespace-nowrap">Tên vật tư</th>
                        <th className="px-4 py-3 whitespace-nowrap">Đơn vị</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-blue-50 dark:bg-blue-900/20">Tồn đầu kỳ (SL)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-blue-50 dark:bg-blue-900/20">Tồn đầu kỳ (TT)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-green-50 dark:bg-green-900/20">Nhập trong kỳ (SL)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-green-50 dark:bg-green-900/20">Nhập trong kỳ (TT)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-red-50 dark:bg-red-900/20">Xuất trong kỳ (SL)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-red-50 dark:bg-red-900/20">Xuất trong kỳ (TT)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-yellow-50 dark:bg-yellow-900/20">Tồn cuối kỳ (SL)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right bg-yellow-50 dark:bg-yellow-900/20">Tồn cuối kỳ (TT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentRows.map((item, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-4 py-3 whitespace-nowrap font-medium">{item.materialCode}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.materialName}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.unit}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-blue-50/50 dark:bg-blue-900/10">{item.beginningQuantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-blue-50/50 dark:bg-blue-900/10">{formatCurrency(item.beginningValue)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-green-50/50 dark:bg-green-900/10">{item.importQuantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-green-50/50 dark:bg-green-900/10">{formatCurrency(item.importValue)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-red-50/50 dark:bg-red-900/10">{item.exportQuantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-red-50/50 dark:bg-red-900/10">{formatCurrency(item.exportValue)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-yellow-50/50 dark:bg-yellow-900/10 font-medium">{item.endingQuantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right bg-yellow-50/50 dark:bg-yellow-900/10 font-medium">{formatCurrency(item.endingValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hiển thị {indexOfFirstRow + 1} đến {Math.min(indexOfLastRow, summaryData.length)} trong tổng số {summaryData.length} mục
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                      >
                        «
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                      >
                        ‹
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = currentPage > 2 ? currentPage - 2 + i : i + 1;
                        if (pageNumber <= totalPages) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-3 py-1 rounded-md border ${
                                currentPage === pageNumber 
                                  ? 'bg-violet-600 text-white border-violet-600' 
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                      >
                        ›
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default InventoryTable;
