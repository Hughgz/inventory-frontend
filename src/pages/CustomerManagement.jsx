import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCustomers, 
  createCustomerAsync, 
  updateCustomerAsync, 
  toggleCustomerStatusAsync,
  clearError
} from '../redux/CustomerSlice';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

function CustomerManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    taxCode: '',
    isActive: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const dispatch = useDispatch();
  const { customers, status, error } = useSelector((state) => state.customers);

  // Fetch customers on component mount
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // Filter customers based on search term and activity status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchTerm)) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = showInactive ? true : customer.isActive;
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setCurrentCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      note: '',
      taxCode: '',
      isActive: true
    });
    setEditMode(false);
  };

  const handleAddNewClick = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (customer) => {
    setCurrentCustomer(customer);
    setEditMode(true);
    setShowModal(true);
  };

  const handleToggleStatus = (customerId, isActive) => {
    dispatch(toggleCustomerStatusAsync({ 
      customerId, 
      isActive: !isActive 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      dispatch(updateCustomerAsync({
        customerId: currentCustomer.customerId,
        customerData: currentCustomer
      }));
    } else {
      dispatch(createCustomerAsync(currentCustomer));
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({
      ...currentCustomer,
      [name]: value
    });
  };

  // Show loading spinner when fetching data
  if (status === 'loading' && customers.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-4">Quản lý khách hàng</h1>
              
              {/* Error message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <span>{error}</span>
                  <button 
                    className="float-right"
                    onClick={() => dispatch(clearError())}
                  >
                    <span className="sr-only">Đóng</span>
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M10 8.586l3.293-3.293a1 1 0 011.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 011.414-1.414L10 8.586z" 
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Search and filters */}
              <div className="sm:flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                {/* Search box */}
                <div className="relative w-full sm:w-80">
                  <input 
                    className="form-input pl-9 focus:border-slate-300 w-full" 
                    type="search" 
                    placeholder="Tìm kiếm khách hàng..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg 
                      className="h-4 w-4 fill-current text-slate-400"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                      <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                    </svg>
                  </span>
                </div>

                {/* Filter button */}
                <div className="flex items-center">
                  <div className="mr-2 text-sm text-gray-600 dark:text-gray-400">Hiển thị không hoạt động:</div>
                  <div className="form-switch">
                    <input 
                      type="checkbox" 
                      id="show-inactive" 
                      className="sr-only" 
                      checked={showInactive}
                      onChange={() => setShowInactive(!showInactive)}
                    />
                    <label className="bg-slate-400 dark:bg-slate-700" htmlFor="show-inactive">
                      <span className="bg-white shadow-sm" aria-hidden="true"></span>
                      <span className="sr-only">Hiển thị không hoạt động</span>
                    </label>
                  </div>
                </div>

                {/* Add customer button */}
                <div className="ml-auto">
                  <button 
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={handleAddNewClick}
                  >
                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Thêm khách hàng</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">ID</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Tên khách hàng</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Số điện thoại</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Email</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Mã số thuế</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Địa chỉ</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Trạng thái</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-center">Thao tác</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredCustomers.map(customer => (
                      <tr key={customer.customerId}>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left font-medium text-slate-800 dark:text-slate-100">{customer.customerId}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left font-medium text-slate-800 dark:text-slate-100">{customer.name}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">{customer.phone}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">{customer.email}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">{customer.taxCode}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">{customer.address}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">
                            <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${customer.isActive ? 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-400/30 text-rose-500 dark:text-rose-400'}`}>
                              {customer.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-center flex justify-center space-x-1">
                            <button 
                              className="text-indigo-500 hover:text-indigo-600 rounded-full"
                              onClick={() => handleEditClick(customer)}
                            >
                              <span className="sr-only">Sửa</span>
                              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                              </svg>
                            </button>
                            <button 
                              className={`${customer.isActive ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'} rounded-full`}
                              onClick={() => handleToggleStatus(customer.customerId, customer.isActive)}
                            >
                              <span className="sr-only">{customer.isActive ? 'Ẩn' : 'Hiện'}</span>
                              {customer.isActive ? (
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                  <path d="M16 20c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-10 6c.5 0 1-.1 1.4-.4.3-.2.6-.5.8-.9C8.9 17.9 9.7 17 11 16c-1.3-1-2.1-1.9-2.8-2.7-.2-.4-.5-.7-.8-.9-.4-.3-.9-.4-1.4-.4-1.1 0-2 .9-2 2s.9 2 2 2zm20-4c0-1.1-.9-2-2-2-.5 0-1 .1-1.4.4-.3.2-.6.5-.8.9-.7.8-1.5 1.7-2.8 2.7 1.3 1 2.1 1.9 2.8 2.7.2.4.5.7.8.9.4.3.9.4 1.4.4 1.1 0 2-.9 2-2s-.9-2-2-2-2-.9-2-2 .9-2 2-2zm-20 4c0 1.1.9 2 2 2 .5 0 1-.1 1.4-.4.3-.2.6-.5.8-.9.7-.8 1.5-1.7 2.8-2.7-1.3-1-2.1-1.9-2.8-2.7-.2-.4-.5-.7-.8-.9-.4-.3-.9-.4-1.4-.4-1.1 0-2 .9-2 2s.9 2 2 2-2 .9-2 2z" />
                                </svg>
                              ) : (
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                  <path d="M16 12c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10-6c-.5 0-1 .1-1.4.4-.3.2-.6.5-.8.9-.7.8-1.5 1.7-2.8 2.7 1.3 1 2.1 1.9 2.8 2.7.2.4.5.7.8.9.4.3.9.4 1.4.4 1.1 0 2-.9 2-2s-.9-2-2-2-2-.9-2-2 .9-2 2-2zm-20 4c0 1.1.9 2 2 2 .5 0 1-.1 1.4-.4.3-.2.6-.5.8-.9.7-.8 1.5-1.7 2.8-2.7-1.3-1-2.1-1.9-2.8-2.7-.2-.4-.5-.7-.8-.9-.4-.3-.9-.4-1.4-.4-1.1 0-2 .9-2 2s.9 2 2 2-2 .9-2 2z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-2 first:pl-5 last:pr-5 py-6 whitespace-nowrap">
                          <div className="text-center text-slate-500 dark:text-slate-400">Không tìm thấy khách hàng nào</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal backdrop */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"></div>
      )}
      
      {/* Modal dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg overflow-auto max-w-lg w-full max-h-full">
            {/* Modal header */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  {editMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-500" 
                  onClick={() => setShowModal(false)}
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal content */}
            <div className="px-5 py-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Tên khách hàng <span className="text-rose-500">*</span></label>
                    <input
                      id="name"
                      name="name"
                      className="form-input w-full"
                      type="text"
                      required
                      value={currentCustomer.name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone">Số điện thoại <span className="text-rose-500">*</span></label>
                    <input
                      id="phone"
                      name="phone"
                      className="form-input w-full"
                      type="text"
                      required
                      value={currentCustomer.phone || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email <span className="text-rose-500">*</span></label>
                    <input
                      id="email"
                      name="email"
                      className="form-input w-full"
                      type="email"
                      required
                      value={currentCustomer.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="taxCode">Mã số thuế</label>
                    <input
                      id="taxCode"
                      name="taxCode"
                      className="form-input w-full"
                      type="text"
                      value={currentCustomer.taxCode || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="address">Địa chỉ <span className="text-rose-500">*</span></label>
                    <input
                      id="address"
                      name="address"
                      className="form-input w-full"
                      type="text"
                      required
                      value={currentCustomer.address || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="note">Ghi chú</label>
                    <textarea
                      id="note"
                      name="note"
                      className="form-textarea w-full"
                      rows="3"
                      value={currentCustomer.note || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mt-6 space-x-3">
                  <button 
                    type="button" 
                    className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      editMode ? 'Cập nhật' : 'Thêm mới'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement; 