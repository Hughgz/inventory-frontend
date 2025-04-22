// ✅ Đã tích hợp API tạo phiếu nhập vào form JSX
import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  createImportReceipt,
  resetImportReceipt,
  fetchAllImportReceipts,
  approveImportReceipt,
  cancelImportReceipt,
  fetchImportReceiptById,
  resetCurrentReceipt
} from '../redux/ImportReceiptSlice';
import ImportReceiptDetailModal from '../components/DetailPopup';
import Loading from '../components/Loading';
import { fetchImportDetailsWithMaterialByReceiptId } from '../redux/ImportDetailSlice';
import { formatDateArray } from '../utils/DateTimeFormat';

function ImportReceipt() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [debtAccount, setDebtAccount] = useState('');
  const [creditAccount, setCreditAccount] = useState('');
  const [reason, setReason] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [materials, setMaterials] = useState([
    { materialId: '', quantityDoc: '', quantityActual: '', unitPrice: '', totalPrice: '', note: '' },
  ]);

  const dispatch = useDispatch();

  // Lấy thông tin người dùng hiện tại từ Redux store
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || 1; // Mặc định là 1 nếu không có user

  const {
    loading,
    error,
    createdReceipt,
    importReceipts,
    currentReceipt
  } = useSelector((state) => state.importReceipts);

  // Tải danh sách phiếu nhập khi component được mount
  useEffect(() => {
    dispatch(fetchAllImportReceipts());
  }, [dispatch]);

  // Loading effect
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Xử lý sau khi tạo phiếu nhập thành công
  useEffect(() => {
    if (createdReceipt) {
      alert('Tạo phiếu nhập thành công!');
      setShowModal(false);
      setDebtAccount('');
      setCreditAccount('');
      setReason('');
      setSupplierId('');
      setWarehouseId('');
      setMaterials([{ materialId: '', quantityDoc: '', quantityActual: '', unitPrice: '', totalPrice: '', note: '' }]);
      dispatch(resetImportReceipt());
      // Tải lại danh sách phiếu nhập
      dispatch(fetchAllImportReceipts());
    }
  }, [createdReceipt, dispatch]);

  const handleViewDetail = (receiptId) => {
    setSelectedReceipt(receiptId); // Chỉ cần set ID
    setDetailModalOpen(true);      // Mở modal
  };



  // Phê duyệt phiếu nhập
  const handleApprove = (receiptId) => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt phiếu nhập này không?')) {
      dispatch(approveImportReceipt({ id: receiptId, userId }));
    }
  };

  // Hiển thị modal hủy phiếu
  const handleShowCancelModal = (receiptId) => {
    setSelectedReceipt(receiptId);
    setShowCancelModal(true);
  };

  // Hủy phiếu nhập
  const handleCancel = () => {
    if (cancelReason.trim() === '') {
      alert('Vui lòng nhập lý do hủy phiếu!');
      return;
    }

    dispatch(cancelImportReceipt({
      id: selectedReceipt,
      userId,
      reason: cancelReason
    }));

    setShowCancelModal(false);
    setCancelReason('');
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
    setMaterials([...materials, { materialId: '', quantityDoc: '', quantityActual: '', unitPrice: '', totalPrice: '', note: '' }]);
  };

  const removeMaterialRow = (index) => {
    const updated = materials.filter((_, i) => i !== index);
    setMaterials(updated);
  };
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Không rõ';
    try {
      const str = String(dateValue);
      const cleaned = str.includes('T') ? str.split('.')[0] : str.replace(' ', 'T').split('.')[0];
      return new Date(cleaned).toLocaleString('vi-VN');
    } catch {
      return 'Không rõ';
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const dto = {
      enterprise_id: 1, // mặc định hoặc truyền động sau
      supplier_id: parseInt(supplierId),
      warehouse_id: parseInt(warehouseId),
      debtAccount,
      creditAccount,
      reason,
      importDetails: materials.map((item) => ({
        materialId: parseInt(item.materialId),
        quantityDoc: parseFloat(item.quantityDoc),
        quantityActual: parseFloat(item.quantityActual),
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice),
        note: item.note,
      })),
    };

    dispatch(createImportReceipt({ data: dto, userId }));
  };

  const receiptData = importReceipts;


  const filteredData = receiptData.filter(
    (item) =>
      item.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier?.name?.toLowerCase().includes(search.toLowerCase())
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
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Phiếu nhập kho</h1>
              <button
                onClick={() => setShowModal(true)}
                className="btn bg-violet-600 text-white hover:bg-violet-700"
              >
                + Tạo phiếu nhập kho
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã hóa đơn, nhà cung cấp..."
                className="w-full sm:w-96 px-4 py-2 border rounded shadow text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded">
              <table className="table-auto w-full text-left">
                <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-3 w-[15%] text-left">Ngày tạo</th>
                    <th className="p-3 w-[20%] text-left">Nhà cung cấp</th>
                    <th className="p-3 w-[15%] text-left">Kho</th>
                    <th className="p-3 w-[15%] text-right">Tổng tiền</th>
                    <th className="p-3 w-[10%] text-center">Trạng thái</th>
                    <th className="p-3 w-[25%] text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((entry) => (
                    <tr key={entry.id || entry.importReceiptId}>
                      <td className="p-3">{formatDateArray(entry.createdAt)}</td>
                      <td className="p-3">{entry.supplier?.name}</td>
                      <td className="p-3">{entry.warehouse?.name}</td>
                      <td className="p-3 text-right">{entry.totalAmount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entry.totalAmount) : "0 ₫"}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${entry.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : entry.status === "CANCELED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetail(entry.id || entry.importReceiptId)}
                            className="px-2 py-1 text-sm rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                          >
                            Chi tiết
                          </button>

                          {entry.status === "CREATED" && (
                            <>
                              <button
                                onClick={() => handleApprove(entry.id || entry.importReceiptId)}
                                className="px-2 py-1 text-sm rounded-lg text-white bg-green-500 hover:bg-green-600"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleShowCancelModal(entry.id || entry.importReceiptId)}
                                className="px-2 py-1 text-sm rounded-lg text-white bg-red-500 hover:bg-red-600"
                              >
                                Hủy
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button className="px-3 py-1 border rounded-l text-sm dark:bg-gray-700 dark:text-white">&laquo;</button>
              <button className="px-3 py-1 border-t border-b text-sm dark:bg-gray-700 dark:text-white">1</button>
              <button className="px-3 py-1 border rounded-r text-sm dark:bg-gray-700 dark:text-white">&raquo;</button>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8 relative z-10">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Tạo phiếu nhập kho</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Thông tin chung</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Tài khoản nợ" value={debtAccount} onChange={(e) => setDebtAccount(e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  <input type="text" placeholder="Tài khoản có" value={creditAccount} onChange={(e) => setCreditAccount(e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  <input type="text" placeholder="Lý do nhập kho" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white col-span-2" />
                  <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option value="">-- Chọn nhà cung cấp --</option>
                    <option value="1">Công ty ABC</option>
                    <option value="2">Công ty Gạo Việt</option>
                  </select>
                  <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option value="">-- Chọn kho --</option>
                    <option value="1">Kho trung tâm</option>
                    <option value="2">Kho miền Tây</option>
                  </select>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Chi tiết vật tư</legend>
                {materials.map((item, index) => (
                  <div key={index} className="mb-6 border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Vật tư {index + 1}</span>
                      <button type="button" onClick={() => removeMaterialRow(index)} className="text-red-500 text-sm">- Xóa</button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                      <select value={item.materialId} onChange={(e) => handleMaterialChange(index, 'materialId', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                        <option value="">Chọn vật tư</option>
                        <option value="1">Gạo Lúa</option>
                        <option value="2">Bao Gạo</option>
                        <option value="3">Lúa Tươi</option>
                      </select>
                      <input type="number" placeholder="SL chứng từ" value={item.quantityDoc} onChange={(e) => handleMaterialChange(index, 'quantityDoc', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                      <input type="number" placeholder="SL thực tế" value={item.quantityActual} onChange={(e) => handleMaterialChange(index, 'quantityActual', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                      <input type="number" placeholder="Đơn giá" value={item.unitPrice} onChange={(e) => handleMaterialChange(index, 'unitPrice', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                      <input type="number" placeholder="Thành tiền" value={item.totalPrice} disabled className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <textarea placeholder="Ghi chú" value={item.note} onChange={(e) => handleMaterialChange(index, 'note', e.target.value)} className="w-full mt-2 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  </div>
                ))}
                <button type="button" onClick={addMaterialRow} className="text-sm text-violet-600 hover:underline">+ Thêm dòng vật tư</button>
              </fieldset>

              <div className="flex justify-between">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  Hủy
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
                  {loading ? 'Đang xử lý...' : 'Lưu phiếu nhập kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Hủy phiếu nhập kho</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Vui lòng nhập lý do hủy phiếu nhập này:</p>
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

      {detailModalOpen && selectedReceipt && (
        <ImportReceiptDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedReceipt(null);
            dispatch(resetCurrentReceipt());
          }}
          receiptId={selectedReceipt}
        />
      )}


    </div>
  );
}

export default ImportReceipt;
