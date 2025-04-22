import React, { useEffect, useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import Loading from '../components/Loading';
import ExportReceiptDetailModal from '../components/ExportDetailPopup';
import { useDispatch, useSelector } from 'react-redux';
import {
  createExportReceipt,
  resetExportReceipt,
  fetchAllExportReceipts,
  fetchExportReceiptById,
  approveExportReceipt,
  cancelExportReceipt,
  fetchExportReceiptsByStatus
} from '../redux/ExportReceiptSlice';
import { formatDateArray } from '../utils/DateTimeFormat';

function ExportReceipt() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [showOnlyCreated, setShowOnlyCreated] = useState(true);

  const [debtAccount, setDebtAccount] = useState('');
  const [creditAccount, setCreditAccount] = useState('');
  const [reason, setReason] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [materials, setMaterials] = useState([
    { materialId: '', quantityRequested: '', quantityActual: '', unitPrice: '', totalPrice: '', note: '' },
  ]);

  const dispatch = useDispatch();

  // Lấy thông tin người dùng hiện tại từ Redux store
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || 1; // Mặc định là 1 nếu không có user

  const { 
    loading, 
    error, 
    createdReceipt, 
    exportReceipts, 
    currentReceipt 
  } = useSelector((state) => state.exportReceipts);

  // Tải danh sách phiếu xuất khi component được mount hoặc khi toggle thay đổi
  useEffect(() => {
    if (showOnlyCreated) {
      console.log('Fetching receipts with status CREATED');
      dispatch(fetchExportReceiptsByStatus('CREATED'))
        .then((action) => {
          console.log('Fetched CREATED receipts:', action.payload);
        })
        .catch((err) => {
          console.error('Error fetching CREATED receipts:', err);
        });
    } else {
      console.log('Fetching all receipts');
      dispatch(fetchAllExportReceipts())
        .then((action) => {
          console.log('Fetched all receipts:', action.payload);
        })
        .catch((err) => {
          console.error('Error fetching all receipts:', err);
        });
    }
  }, [dispatch, showOnlyCreated]);

  // Loading effect
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Xử lý sau khi tạo phiếu xuất thành công
  useEffect(() => {
    if (createdReceipt) {
      alert('Tạo phiếu xuất kho thành công!');
      setShowModal(false);
      setDebtAccount('');
      setCreditAccount('');
      setReason('');
      setCustomerId('');
      setWarehouseId('');
      setMaterials([{ materialId: '', quantityRequested: '', quantityActual: '', unitPrice: '', totalPrice: '', note: '' }]);
      dispatch(resetExportReceipt());
      // Tải lại danh sách phiếu xuất
      if (showOnlyCreated) {
        dispatch(fetchExportReceiptsByStatus('CREATED'));
      } else {
        dispatch(fetchAllExportReceipts());
      }
    }
  }, [createdReceipt, dispatch, showOnlyCreated]);

  // Xem chi tiết phiếu xuất
  const handleViewDetail = (receiptId) => {
    dispatch(fetchExportReceiptById(receiptId))
      .then(() => {
        setDetailModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching receipt details:", error);
        // Hiển thị thông báo lỗi từ API nếu có
        alert(error.message || "Không thể tải chi tiết phiếu xuất. Vui lòng thử lại sau.");
      });
  };

  // Phê duyệt phiếu xuất
  const handleApprove = (receiptId) => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt phiếu xuất này không?')) {
      dispatch(approveExportReceipt({ id: receiptId, userId }))
        .then(() => {
          // Tải lại danh sách phiếu sau khi phê duyệt
          if (showOnlyCreated) {
            dispatch(fetchExportReceiptsByStatus('CREATED'));
          } else {
            dispatch(fetchAllExportReceipts());
          }
        });
    }
  };

  // Hiển thị modal hủy phiếu
  const handleShowCancelModal = (receiptId) => {
    setSelectedReceipt(receiptId);
    setShowCancelModal(true);
  };

  // Hủy phiếu xuất
  const handleCancel = () => {
    if (cancelReason.trim() === '') {
      alert('Vui lòng nhập lý do hủy phiếu!');
      return;
    }
    
    dispatch(cancelExportReceipt({ 
      id: selectedReceipt, 
      userId, 
      reason: cancelReason 
    }))
    .then(() => {
      // Tải lại danh sách phiếu sau khi hủy
      if (showOnlyCreated) {
        dispatch(fetchExportReceiptsByStatus('CREATED'));
      } else {
        dispatch(fetchAllExportReceipts());
      }
    });
    
    setShowCancelModal(false);
    setCancelReason('');
  };

  // Toggle hiển thị tất cả phiếu hoặc chỉ phiếu có trạng thái CREATED
  const toggleReceiptDisplay = () => {
    setShowOnlyCreated(!showOnlyCreated);
  };

  const handleMaterialChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    if (field === 'quantityActual' || field === 'unitPrice') {
      const qty = parseFloat(updated[index].quantityActual) || 0;
      const price = parseFloat(updated[index].unitPrice) || 0;
      updated[index].totalPrice = (qty * price).toFixed(2);
    }
    setMaterials(updated);
  };

  const addMaterialRow = () => {
    setMaterials([...materials, { materialId: '', quantityRequested: '', quantityActual: '', unitPrice: '', totalPrice: '', note: '' }]);
  };

  const removeMaterialRow = (index) => {
    const updated = materials.filter((_, i) => i !== index);
    setMaterials(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      enterprise_id: 1, // mặc định hoặc truyền động sau
      customerId: parseInt(customerId),
      warehouseId: parseInt(warehouseId),
      debtAccount,
      creditAccount,
      reason,
      status: 'CREATED',
      exportDetails: materials.map((item) => ({
        materialId: parseInt(item.materialId),
        quantityRequested: parseFloat(item.quantityRequested),
        quantityActual: parseFloat(item.quantityActual),
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice),
        note: item.note,
      })),
    };

    dispatch(createExportReceipt({ data: payload, userId }));
  };

  // Dữ liệu phiếu xuất từ Redux store hoặc fallback vào mockData
  const receiptData = exportReceipts && exportReceipts.length > 0 ? exportReceipts : [];

  const filteredData = receiptData.filter(
    (item) =>
      item.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Phiếu xuất kho</h1>
              <button
                onClick={() => setShowModal(true)}
                className="btn bg-violet-600 text-white hover:bg-violet-700"
              >
                + Tạo phiếu xuất kho
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="mb-4 flex justify-between items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã hóa đơn, khách hàng..."
                className="w-full sm:w-96 px-4 py-2 border rounded shadow text-sm dark:bg-gray-700 dark:text-white"
              />
              
              <div className="flex items-center ml-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showOnlyCreated}
                    onChange={toggleReceiptDisplay}
                    className="sr-only peer" 
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {showOnlyCreated ? "Chỉ hiện phiếu chờ duyệt" : "Hiện tất cả phiếu"}
                  </span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded">
              <table className="table-auto w-full text-left">
                <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-3 w-[15%]">Ngày tạo</th>
                    <th className="p-3 w-[20%]">Khách hàng</th>
                    <th className="p-3 w-[15%]">Kho</th>
                    <th className="p-3 w-[15%] text-right">Tổng tiền</th>
                    <th className="p-3 w-[10%] text-center">Trạng thái</th>
                    <th className="p-3 w-[25%] text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center">
                        <div className="flex justify-center items-center">
                          <svg className="animate-spin h-5 w-5 mr-3 text-violet-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang tải dữ liệu...
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p className="text-lg font-medium">Không tìm thấy phiếu xuất kho nào</p>
                          <p className="text-sm text-gray-500">
                            {showOnlyCreated ? 
                              "Không có phiếu xuất kho nào đang chờ duyệt." : 
                              "Không có phiếu xuất kho nào trong hệ thống."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((entry) => (
                      <tr key={entry.id}>
                        <td className="p-3">{formatDateArray(entry.createdAt)}</td>
                        <td className="p-3">{entry.customer?.name}</td>
                        <td className="p-3">{entry.warehouse?.name}</td>
                        <td className="p-3 text-right">{entry.totalAmount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entry.totalAmount) : "0 ₫"}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            entry.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : entry.status === 'CANCELED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetail(entry.id)}
                              className="px-2 py-1 text-sm rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                            >
                              Chi tiết
                            </button>
                            
                            {(entry.status === "CREATED" || entry.status === "Created") && (
                              <>
                                <button
                                  onClick={() => handleApprove(entry.id)}
                                  className="px-2 py-1 text-sm rounded-lg text-white bg-green-500 hover:bg-green-600"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => handleShowCancelModal(entry.id)}
                                  className="px-2 py-1 text-sm rounded-lg text-white bg-red-500 hover:bg-red-600"
                                >
                                  Hủy
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-end mt-4">
              <button className="px-3 py-1 border rounded-l text-sm dark:bg-gray-700 dark:text-white">&laquo;</button>
              <button className="px-3 py-1 border-t border-b text-sm dark:bg-gray-700 dark:text-white">1</button>
              <button className="px-3 py-1 border rounded-r text-sm dark:bg-gray-700 dark:text-white">&raquo;</button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal tạo phiếu xuất kho */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Tạo phiếu xuất kho</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Thông tin chung */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Thông tin chung</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={debtAccount}
                    onChange={(e) => setDebtAccount(e.target.value)}
                    placeholder="Tài khoản nợ"
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={creditAccount}
                    onChange={(e) => setCreditAccount(e.target.value)}
                    placeholder="Tài khoản có"
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Lý do xuất kho"
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white col-span-2"
                  />
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    <option value="1">Công ty ABC</option>
                    <option value="2">Gạo Miền Tây</option>
                  </select>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">-- Chọn kho --</option>
                    <option value="1">Kho trung tâm</option>
                    <option value="2">Kho miền Tây</option>
                  </select>
                </div>
              </fieldset>

              {/* Chi tiết vật tư */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Chi tiết vật tư</legend>
                {materials.map((item, index) => (
                  <div key={index} className="mb-6 border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Vật tư {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeMaterialRow(index)}
                        disabled={materials.length === 1}
                        className="text-red-500 text-sm disabled:opacity-50"
                      >
                        - Xóa
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                      <select
                        value={item.materialId}
                        onChange={(e) => handleMaterialChange(index, 'materialId', e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Chọn vật tư</option>
                        <option value="1">Gạo Lúa</option>
                        <option value="2">Bao Gạo</option>
                        <option value="3">Lúa Tươi</option>
                      </select>
                      <input
                        type="number"
                        placeholder="SL yêu cầu"
                        value={item.quantityRequested}
                        onChange={(e) => handleMaterialChange(index, 'quantityRequested', e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="SL thực tế"
                        value={item.quantityActual}
                        onChange={(e) => handleMaterialChange(index, 'quantityActual', e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Đơn giá"
                        value={item.unitPrice}
                        onChange={(e) => handleMaterialChange(index, 'unitPrice', e.target.value)}
                        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Thành tiền"
                        value={item.totalPrice}
                        disabled
                        className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <textarea
                      placeholder="Ghi chú"
                      value={item.note}
                      onChange={(e) => handleMaterialChange(index, 'note', e.target.value)}
                      className="w-full mt-2 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMaterialRow}
                  className="text-sm text-violet-600 hover:underline"
                >
                  + Thêm dòng vật tư
                </button>
              </fieldset>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Lưu phiếu xuất kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal hủy phiếu */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Hủy phiếu xuất kho</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Vui lòng nhập lý do hủy phiếu xuất này:</p>
            <textarea 
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded resize-none h-32 dark:bg-gray-700 dark:text-white"
              placeholder="Lý do hủy..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Đóng
              </button>
              <button 
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết phiếu xuất */}
      {detailModalOpen && (
        <ExportReceiptDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          receipt={currentReceipt}
        />
      )}
    </div>
  );
}

export default ExportReceipt;
