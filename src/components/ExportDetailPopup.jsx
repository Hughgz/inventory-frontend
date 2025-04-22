import React from "react";

const exportReceiptMock = {
  enterprise_id: 1,
  customer_id: 2,
  warehouse_id: 3,
  debtAccount: "DEBT789",
  creditAccount: "CREDIT567",
  createdAt: "2025-06-01T09:00:00",
  updatedAt: "2025-06-01T09:00:00",
  status: "CREATED",
  exportDetails: [
    {
      materialId: 1,
      materialName: "Gạo Lúa",
      quantityRequested: 100,
      quantityActual: 95,
      unitPrice: 12.0,
      totalPrice: 1140.0,
      note: "Xuất cho khách hàng A"
    },
    {
      materialId: 2,
      materialName: "Bao Gạo",
      quantityRequested: 150,
      quantityActual: 150,
      unitPrice: 22.0,
      totalPrice: 3300.0,
      note: "Xuất đủ số lượng"
    },
    {
      materialId: 3,
      materialName: "Lúa Tươi",
      quantityRequested: 200,
      quantityActual: 190,
      unitPrice: 15.0,
      totalPrice: 2850.0,
      note: "Thiếu 10 đơn vị"
    }
  ]
};

const ExportReceiptDetailModal = ({ isOpen, onClose, receipt = exportReceiptMock }) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Chi tiết phiếu xuất kho</h2>
        </div>

        <div className="p-6 space-y-3 text-sm text-gray-800 dark:text-white">
          <p><strong>Mã doanh nghiệp:</strong> {receipt.enterprise_id}</p>
          <p><strong>Mã khách hàng:</strong> {receipt.customer_id}</p>
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
                  <th className="px-4 py-2">SL yêu cầu</th>
                  <th className="px-4 py-2">SL thực tế</th>
                  <th className="px-4 py-2">Đơn giá</th>
                  <th className="px-4 py-2">Thành tiền</th>
                  <th className="px-4 py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {receipt.exportDetails.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{item.materialName}</td>
                    <td className="px-4 py-2">{item.quantityRequested}</td>
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
            {receipt.exportDetails.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 dark:bg-gray-700">
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

export default ExportReceiptDetailModal; 