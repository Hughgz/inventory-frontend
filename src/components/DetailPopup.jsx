// ✅ Popup xem chi tiết 1 import receipt
import React from "react";

const importReceiptMock = {
  enterprise_id: 1,
  supplier_id: 2,
  warehouse_id: 3,
  debtAccount: "DEBT567",
  creditAccount: "CREDIT789",
  createdAt: "2025-06-01T09:00:00",
  updatedAt: "2025-06-01T09:00:00",
  status: "CREATED",
  importDetails: [
    {
      materialId: 1,
      materialName: "Gạo Lúa",
      quantityDoc: 100,
      quantityActual: 100,
      unitPrice: 10.0,
      totalPrice: 1000.0,
      note: "Batch of Gạo Lúa"
    },
    {
      materialId: 2,
      materialName: "Bao Gạo",
      quantityDoc: 150,
      quantityActual: 150,
      unitPrice: 20.0,
      totalPrice: 3000.0,
      note: "Batch of Bao Gạo"
    },
    {
      materialId: 3,
      materialName: "Lúa Tươi",
      quantityDoc: 200,
      quantityActual: 200,
      unitPrice: 12.0,
      totalPrice: 2400.0,
      note: "Batch of Lúa Tươi"
    }
  ]
};

const ImportReceiptDetailModal = ({ isOpen, onClose, receipt = importReceiptMock }) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết phiếu nhập kho</h2>
        </div>

        <div className="p-6 space-y-3 text-sm text-gray-800 dark:text-white">
          <p><strong>Mã doanh nghiệp:</strong> {receipt.enterprise_id}</p>
          <p><strong>Mã nhà cung cấp:</strong> {receipt.supplier_id}</p>
          <p><strong>Mã kho:</strong> {receipt.warehouse_id}</p>
          <p><strong>Tài khoản nợ:</strong> {receipt.debtAccount}</p>
          <p><strong>Tài khoản có:</strong> {receipt.creditAccount}</p>
          <p><strong>Ngày tạo:</strong> {new Date(receipt.createdAt).toLocaleString()}</p>
          <p><strong>Trạng thái:</strong> {receipt.status}</p>

          <div className="max-h-64 overflow-y-auto mt-4">
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
                {receipt.importDetails.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{item.materialName}</td>
                    <td className="px-4 py-2">{item.quantityDoc}</td>
                    <td className="px-4 py-2">{item.quantityActual}</td>
                    <td className="px-4 py-2">{item.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td className="px-4 py-2">{item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td className="px-4 py-2">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right text-lg font-bold text-green-600 mt-4">
            Tổng tiền:{" "}
            {receipt.importDetails.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <button
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-gray-500 hover:bg-gray-600"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportReceiptDetailModal;
