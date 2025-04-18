import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

function ExportReceipt() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState([
    { materialId: '', quantityRequested: '', quantityActual: '', unitPrice: '', totalPrice: '', note: '' },
  ]);

  const mockData = [
    {
      id: 1,
      invoiceNumber: 'HD001',
      invoiceDate: '2025-04-15',
      supplier: 'Công ty ABC',
      warehouse: 'Kho trung tâm',
      status: 'CREATED',
    },
    {
      id: 2,
      invoiceNumber: 'HD002',
      invoiceDate: '2025-04-14',
      supplier: 'Gạo Miền Tây',
      warehouse: 'Kho miền Tây',
      status: 'APPROVED',
    },
  ];

  const filteredData = mockData.filter(
    (item) =>
      item.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase())
  );

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
                    <th className="p-3 w-1/6">Mã HĐ</th>
                    <th className="p-3 w-1/6">Ngày hóa đơn</th>
                    <th className="p-3 w-1/4">Khách hàng</th>
                    <th className="p-3 w-1/4">Kho</th>
                    <th className="p-3 w-1/6">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((entry) => (
                    <tr key={entry.id}>
                      <td className="p-3">{entry.invoiceNumber}</td>
                      <td className="p-3">{entry.invoiceDate}</td>
                      <td className="p-3">{entry.supplier}</td>
                      <td className="p-3">{entry.warehouse}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          entry.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status}
                        </span>
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
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Tạo phiếu xuất kho</h2>
            <form className="space-y-6">
              <fieldset>
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Thông tin chung</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Mã hóa đơn" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  <input type="date" placeholder="Ngày hóa đơn" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  <input type="text" placeholder="Tài khoản nợ" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  <input type="text" placeholder="Tài khoản có" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  <input type="text" placeholder="Lý do xuất kho" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white col-span-2" />
                  <select className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option>-- Chọn khách hàng --</option>
                    <option value="1">Công ty ABC</option>
                    <option value="2">Gạo Miền Tây</option>
                  </select>
                  <select className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option>-- Chọn kho --</option>
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
                      <input type="number" placeholder="SL yêu cầu" value={item.quantityRequested} onChange={(e) => handleMaterialChange(index, 'quantityRequested', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                      <input type="number" placeholder="SL thực tế" value={item.quantityActual} onChange={(e) => handleMaterialChange(index, 'quantityActual', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                      <input type="number" placeholder="Đơn giá" value={item.unitPrice} onChange={(e) => handleMaterialChange(index, 'unitPrice', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                      <input type="number" placeholder="Thành tiền" value={item.totalPrice} disabled className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white" />
                    </div>
                    <textarea placeholder="Ghi chú" value={item.note} onChange={(e) => handleMaterialChange(index, 'note', e.target.value)} className="w-full mt-2 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                  </div>
                ))}
                <button type="button" onClick={addMaterialRow} className="text-sm text-violet-600 hover:underline">+ Thêm dòng vật tư</button>
              </fieldset>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                >
                  Lưu phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportReceipt;
