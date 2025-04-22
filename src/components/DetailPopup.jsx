import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImportDetailsWithMaterialByReceiptId } from "../redux/ImportDetailSlice";
import { fetchImportReceiptById } from "../redux/ImportReceiptSlice";
import { formatDateArray } from "../utils/DateTimeFormat";

const ImportReceiptDetailModal = ({ isOpen, onClose, receiptId }) => {
  const dispatch = useDispatch();
  const [detailsLoaded, setDetailsLoaded] = useState(false);

  const { importDetailsWithMaterial, loading, error } = useSelector(state => state.importDetails);
  const { currentReceipt } = useSelector(state => state.importReceipts);
  
  useEffect(() => {
    if (isOpen && receiptId) {
      dispatch(fetchImportReceiptById(receiptId));
      dispatch(fetchImportDetailsWithMaterialByReceiptId(receiptId))
        .then(() => setDetailsLoaded(true));
    }
  }, [dispatch, isOpen, receiptId]);

  if (!isOpen || !receiptId || !currentReceipt) return null;

  const details = importDetailsWithMaterial.length > 0 ? importDetailsWithMaterial : [];
  const hasDetails = details.length > 0;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết phiếu nhập kho</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3 text-sm text-gray-800 dark:text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Mã phiếu nhập:</strong> {currentReceipt.importReceiptId || currentReceipt.id}</p>
            <p><strong>Ngày tạo:</strong> {formatDateArray(currentReceipt.createdAt)}</p>
            <p><strong>Nhà cung cấp:</strong> {currentReceipt.supplier?.name}</p>
            <p><strong>Kho:</strong> {currentReceipt.warehouse?.name}</p>
            <p><strong>Tài khoản nợ:</strong> {currentReceipt.debtAccount}</p>
            <p><strong>Tài khoản có:</strong> {currentReceipt.creditAccount}</p>
            <p><strong>Lý do nhập:</strong> {currentReceipt.reason}</p>
            <p><strong>Trạng thái:</strong> 
              <span className={`px-2 py-1 rounded-full text-xs ${
                currentReceipt.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                currentReceipt.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {currentReceipt.status}
              </span>
            </p>
          </div>

          {/* Chi tiết vật tư */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-lg mb-2">Chi tiết vật tư</h3>
            <div className="max-h-64 overflow-y-auto mt-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2">Đang tải dữ liệu chi tiết...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  <p>Lỗi khi tải dữ liệu: {error.message || "Không thể tải dữ liệu"}</p>
                </div>
              ) : hasDetails ? (
                <table className="table-auto w-full text-left border-collapse bg-white dark:bg-gray-800">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2">Tên vật tư</th>
                      <th className="px-4 py-2">SL chứng từ</th>
                      <th className="px-4 py-2">SL thực tế</th>
                      <th className="px-4 py-2">Đơn giá</th>
                      <th className="px-4 py-2">Thành tiền</th>
                      <th className="px-4 py-2">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.material?.name || item.materialName || `#${item.materialId}`}</td>
                        <td className="px-4 py-2">{item.quantityDoc}</td>
                        <td className="px-4 py-2">{item.quantityActual}</td>
                        <td className="px-4 py-2">{typeof item.unitPrice === 'number' ? item.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : item.unitPrice}</td>
                        <td className="px-4 py-2">{typeof item.totalPrice === 'number' ? item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : item.totalPrice}</td>
                        <td className="px-4 py-2">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Không có dữ liệu chi tiết</p>
                </div>
              )}
            </div>

            {hasDetails && (
              <div className="text-right text-lg font-bold text-green-600 mt-4">
                Tổng tiền:{" "}
                {details.reduce((sum, item) => {
                  const totalPrice = typeof item.totalPrice === 'number' ? item.totalPrice : parseFloat(item.totalPrice) || 0;
                  return sum + totalPrice;
                }, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <button className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-gray-500 hover:bg-gray-600" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportReceiptDetailModal;
