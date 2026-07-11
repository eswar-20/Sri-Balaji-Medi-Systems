import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { ownerAPI, orderAPI, productAPI, ownerServiceAPI, handleApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  Users, 
  Wrench, 
  UserCheck, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ClipboardList,
  Bell,
  BarChart3,
  Search,
  Trash2,
  Edit,
  X,
  Printer,
  Download,
  Upload,
  FileText,
  RefreshCw,
  Copy,
  PlusCircle,
  FileDown
} from 'lucide-react';

const OwnerDashboardPage = () => {
  const { user, logout, isSuperOwner } = useAuth();
  const navigate = useNavigate();
  
  // Tabs
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Base Data States
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [servicesSummary, setServicesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Product Form State (Add/Edit)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    productType: 'EQUIPMENT',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
    sku: '',
    hsnCode: '',
    gstPercent: '18.00',
    manufacturer: '',
    brand: '',
    modelNumber: '',
    countryOfOrigin: '',
    warrantyMonths: '12',
    youtubeUrl: '',
    brochureUrl: '',
    thumbnailUrl: '',
    damagedStock: '0',
    returnedStock: '0',
    incomingStock: '0',
    specsInput: '',
    featuresInput: ''
  });

  // Website Settings CMS State
  const [cmsSettings, setCmsSettings] = useState({
    heroTitle: '',
    bannerUrl: '',
    deliveryCharge: '',
    gstRate: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    fbLink: '',
    twitterLink: '',
    aboutUs: '',
    privacyPolicy: '',
    termsConditions: ''
  });

  // Notifications State
  const [notificationForm, setNotificationForm] = useState({
    type: 'OFFER', // OFFER, ORDER, AMC, SERVICE
    title: '',
    message: '',
    recipientType: 'ALL' // ALL, CUSTOMERS, TECHNICIANS
  });
  const [notificationLogs, setNotificationLogs] = useState([
    { id: 1, type: 'AMC', title: 'AMC Renewal Trigger', message: 'Annual calibration renewals dispatched for ECG machines.', sentAt: '2026-07-10 14:30' }
  ]);

  // Stock Adjustment Modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedAdjustProduct, setSelectedAdjustProduct] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    quantity: '',
    type: 'INCREASE', // INCREASE, DECREASE, DAMAGE, RETURN, SET_INCOMING
    reason: ''
  });

  // Modal print view states
  const [activePrintOrder, setActivePrintOrder] = useState(null);
  const [printLayoutType, setPrintLayoutType] = useState('INVOICE'); // INVOICE, SHIPPING, ADDRESS, PACKING

  // Load all dashboard records from the real endpoints
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [
        dashResp, 
        ordersResp, 
        productsResp,
        usersResp,
        serviceRequestsResp,
        engineersResp,
        servicesSummaryResp,
        stockHistoryResp
      ] = await Promise.all([
        ownerAPI.getDashboard(),
        orderAPI.getAllOrders(),
        ownerAPI.getInventory(), // returns all products including soft-deleted ones
        ownerAPI.getUsers(),
        ownerServiceAPI.getRequests(),
        ownerServiceAPI.getEngineers(),
        ownerServiceAPI.getSummary(),
        ownerAPI.getStockHistory()
      ]);

      setDashboard(dashResp.data);
      setOrders(Array.isArray(ordersResp.data) ? ordersResp.data : []);
      setProducts(Array.isArray(productsResp.data) ? productsResp.data : []);
      setUsers(Array.isArray(usersResp.data) ? usersResp.data : []);
      setServiceRequests(Array.isArray(serviceRequestsResp.data) ? serviceRequestsResp.data : []);
      setEngineers(Array.isArray(engineersResp.data) ? engineersResp.data : []);
      setServicesSummary(servicesSummaryResp.data);
      setStockHistory(Array.isArray(stockHistoryResp.data) ? stockHistoryResp.data : []);

      // Load website settings from public endpoint
      const settingsResp = await productAPI.getSettings();
      if (settingsResp.data) {
        setCmsSettings(settingsResp.data);
      }

      // If current user is super owner, load audit logs
      const isSuper = usersResp.data.find(u => u.id === user.id)?.isSuperOwner;
      if (isSuper || user?.isSuperOwner) {
        const auditResp = await ownerAPI.getAuditLogs();
        setAuditLogs(Array.isArray(auditResp.data) ? auditResp.data : []);
      }
    } catch (err) {
      setError(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Order Operations
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleReturnOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to process a customer return for this order?')) return;
    try {
      await orderAPI.returnOrder(orderId);
      alert('Return process completed. Stock levels updated.');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleRefundOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to trigger a payment refund?')) return;
    try {
      await orderAPI.refundOrder(orderId);
      alert('Refund processed successfully.');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  // Product Operations (Add/Edit/Delete/Restore/Duplicate)
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: '',
      productType: 'EQUIPMENT',
      price: '',
      stock: '',
      description: '',
      imageUrl: '',
      sku: '',
      hsnCode: '',
      gstPercent: '18.00',
      manufacturer: '',
      brand: '',
      modelNumber: '',
      countryOfOrigin: '',
      warrantyMonths: '12',
      youtubeUrl: '',
      brochureUrl: '',
      thumbnailUrl: '',
      damagedStock: '0',
      returnedStock: '0',
      incomingStock: '0',
      specsInput: '',
      featuresInput: ''
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    const specsStr = product.specifications 
      ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join('\n')
      : '';
    const featsStr = product.features ? product.features.join(', ') : '';

    let catName = '';
    if (product.category) {
      if (typeof product.category === 'object') {
        catName = product.category.name || '';
      } else {
        catName = String(product.category);
      }
    }

    setProductForm({
      name: product.name || '',
      category: catName,
      productType: product.productType || 'EQUIPMENT',
      price: product.price || '',
      stock: product.stock || '0',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      sku: product.sku || '',
      hsnCode: product.hsnCode || '',
      gstPercent: product.gstPercent || '18.00',
      manufacturer: product.manufacturer || '',
      brand: product.brand || '',
      modelNumber: product.modelNumber || '',
      countryOfOrigin: product.countryOfOrigin || '',
      warrantyMonths: product.warrantyMonths || '12',
      youtubeUrl: product.youtubeUrl || '',
      brochureUrl: product.brochureUrl || '',
      thumbnailUrl: product.thumbnailUrl || '',
      damagedStock: product.damagedStock || '0',
      returnedStock: product.returnedStock || '0',
      incomingStock: product.incomingStock || '0',
      specsInput: specsStr,
      featuresInput: featsStr
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const specifications = {};
      if (productForm.specsInput) {
        productForm.specsInput.split('\n').forEach(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            specifications[parts[0].trim()] = parts.slice(1).join(':').trim();
          }
        });
      }
      const features = productForm.featuresInput 
        ? productForm.featuresInput.split(',').map(f => f.trim()).filter(f => f)
        : [];

      const payload = {
        name: productForm.name,
        category: productForm.category,
        productType: productForm.productType,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        description: productForm.description,
        imageUrl: productForm.imageUrl,
        sku: productForm.sku,
        hsnCode: productForm.hsnCode,
        gstPercent: Number(productForm.gstPercent),
        manufacturer: productForm.manufacturer,
        brand: productForm.brand,
        modelNumber: productForm.modelNumber,
        countryOfOrigin: productForm.countryOfOrigin,
        warrantyMonths: Number(productForm.warrantyMonths),
        youtubeUrl: productForm.youtubeUrl,
        brochureUrl: productForm.brochureUrl,
        thumbnailUrl: productForm.thumbnailUrl,
        damagedStock: Number(productForm.damagedStock),
        returnedStock: Number(productForm.returnedStock),
        incomingStock: Number(productForm.incomingStock),
        specifications,
        features,
        enabled: true
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, payload);
        alert('Product details successfully updated!');
      } else {
        await productAPI.createProduct(payload);
        alert('Product successfully added to the catalog!');
      }
      setShowProductModal(false);
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to soft-delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      alert('Product soft-deleted successfully.');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleRestoreProduct = async (id) => {
    try {
      await productAPI.restoreProduct(id);
      alert('Product successfully restored to catalog!');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleDuplicateProduct = async (id) => {
    try {
      await productAPI.duplicateProduct(id);
      alert('Product successfully cloned!');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleToggleProductEnabled = async (product) => {
    try {
      const payload = { ...product, enabled: !product.enabled };
      await productAPI.updateProduct(product.id, payload);
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  // Promotion & Block/Unblock Operations
  const handlePromoteUser = async (userId, role) => {
    try {
      await ownerAPI.promoteUser(userId, role);
      alert('User role successfully updated.');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleToggleBlockUser = async (userId, currentBlocked) => {
    try {
      await ownerAPI.blockUser(userId, !currentBlocked);
      alert(currentBlocked ? 'User successfully unblocked!' : 'User account suspended.');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user record?')) return;
    try {
      await ownerAPI.deleteUser(userId);
      alert('User successfully deleted.');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  // Stock adjustments
  const openAdjustStockModal = (product) => {
    setSelectedAdjustProduct(product);
    setAdjustForm({ quantity: '', type: 'INCREASE', reason: '' });
    setShowAdjustModal(true);
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    try {
      await ownerAPI.adjustStock(
        selectedAdjustProduct.id,
        Number(adjustForm.quantity),
        adjustForm.type,
        adjustForm.reason
      );
      alert('Stock successfully adjusted!');
      setShowAdjustModal(false);
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  // CMS Parameters save
  const handleSaveCMS = async (e) => {
    e.preventDefault();
    try {
      await ownerAPI.updateSettings(cmsSettings);
      alert('Website configurations updated successfully.');
      loadData();
    } catch (err) {
      alert(handleApiError(err).message);
    }
  };

  // Send Alert Broadcast
  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notificationForm.title || !notificationForm.message) return;
    const newLog = {
      id: Date.now(),
      type: notificationForm.type,
      title: notificationForm.title,
      message: notificationForm.message,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotificationLogs([newLog, ...notificationLogs]);
    alert(`Alert notification broadcasted via ${notificationForm.type} successfully!`);
    setNotificationForm({ type: 'OFFER', title: '', message: '', recipientType: 'ALL' });
  };

  // CSV Import/Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Brand', 'Price', 'Stock', 'Damaged', 'Returned', 'Incoming', 'Available', 'Reserved'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku || 'N/A',
      p.brand || 'N/A',
      p.price,
      p.stock,
      p.damagedStock,
      p.returnedStock,
      p.incomingStock,
      p.availableStock,
      p.reservedStock
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `medi_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length <= 1) return;

        // Skip header
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 6) {
            const id = Number(cols[0]);
            const newStock = Number(cols[5]);
            if (!isNaN(id) && !isNaN(newStock)) {
              await ownerAPI.adjustStock(id, newStock, 'INCREASE', 'Bulk Import Adjust');
              count++;
            }
          }
        }
        alert(`Successfully imported inventory values for ${count} items!`);
        loadData();
      } catch (err) {
        alert('Failed parsing inventory CSV file.');
      }
    };
    reader.readAsText(file);
  };


  // Print view triggers
  const triggerPrintWindow = (order, type) => {
    setActivePrintOrder(order);
    setPrintLayoutType(type);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  if (loading) return <Loader size="large" text="Reading Admin Dashboard registries..." />;

  // Filter computations
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase())) ||
                          (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesType = productTypeFilter === 'ALL' || p.productType === productTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.phone && u.phone.includes(userSearch))
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          `ME-${o.id}`.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'ALL' || o.status.toUpperCase() === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const isCurrentUserSuper = isSuperOwner;

  return (
    <div className="min-h-screen bg-[#071A2F] text-white flex">
      
      {/* Sidebar Navigation */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0F2745] border-r border-white/[0.06] flex flex-col justify-between shrink-0 font-sans transition-all duration-300 relative print:hidden`}>
        
        {/* Toggle Trigger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-[#142F52] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white shadow-md z-20"
        >
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        <div>
          <div className="p-6 border-b border-white/[0.06]">
            {sidebarOpen ? (
              <>
                <h1 className="text-sm font-extrabold tracking-widest text-[#D4AF37] uppercase">Sri Balaji Suite</h1>
                <p className="text-[9px] text-[#C8D3E0] font-bold uppercase tracking-wider mt-1">Management Portal</p>
              </>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#071A2F] font-black text-xs mx-auto">SB</div>
            )}
          </div>
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
              { id: 'orders', label: 'Store Orders', icon: <Receipt className="w-4 h-4" /> },
              { id: 'customers', label: 'Client Ledger', icon: <Users className="w-4 h-4" /> },
              { id: 'technicians', label: 'Technician Board', icon: <UserCheck className="w-4 h-4" /> },
              { id: 'services', label: 'Service Pipeline', icon: <Wrench className="w-4 h-4" /> },
              { id: 'settings', label: 'Website CMS', icon: <Settings className="w-4 h-4" />, requiresSuper: true },
              { id: 'audit-logs', label: 'Audit Trail', icon: <ClipboardList className="w-4 h-4" />, requiresSuper: true },
              { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'notifications', label: 'Alert Center', icon: <Bell className="w-4 h-4" /> }
            ].map(tab => {
              if (tab.requiresSuper && !isCurrentUserSuper) return null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={!sidebarOpen ? tab.label : undefined}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-3 ${
                    activeTab === tab.id 
                      ? 'bg-[#1D9BF0] text-[#071A2F]' 
                      : 'text-slate-300 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {sidebarOpen && <span>{tab.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/[0.06] bg-[#071A2F]/30 text-xs">
          {sidebarOpen ? (
            <>
              <p className="font-extrabold text-white truncate">{user?.name}</p>
              <p className="text-[#C8D3E0] mt-0.5 text-[10px] font-bold uppercase tracking-wider truncate">
                {isCurrentUserSuper ? 'Super Owner' : 'Owner'}
              </p>
              <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="text-red-400 hover:text-red-300 font-black mt-4 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout Suite
              </button>
            </>
          ) : (
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              title="Logout"
              className="mx-auto text-red-400 hover:text-red-300 p-2 hover:bg-white/[0.03] rounded-lg block"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Workspace Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full font-sans print:p-0 print:m-0">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold mb-6 flex justify-between items-center print:hidden">
            <span>Error connecting to dashboard registries: {error}</span>
            <button onClick={() => setError('')} className="p-1 hover:bg-white/5 rounded"><X className="w-4 h-4" /></button>
          </div>
        )}
        
        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 print:hidden">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Management Dashboard</h2>
                <p className="text-[#C8D3E0] text-xs mt-1">Platform-wide transactional telemetry</p>
              </div>
              <button onClick={loadData} className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
              </button>
            </div>

            {/* Dynamic Notifications Bar */}
            <div className="space-y-3">
              {dashboard?.lowStockCount > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs font-bold flex justify-between items-center">
                  <span className="flex items-center gap-2">⚠️ <strong>Low Stock Alert:</strong> {dashboard.lowStockCount} inventory lines require immediate replenishment.</span>
                  <button onClick={() => setActiveTab('inventory')} className="text-white underline uppercase text-[10px] font-black">Restock</button>
                </div>
              )}
              {orders.some(o => o.status.toUpperCase() === 'PENDING') && (
                <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 p-4 rounded-xl text-xs font-bold flex justify-between items-center animate-pulse">
                  <span className="flex items-center gap-2">📦 <strong>New Orders:</strong> Store orders are awaiting confirmation.</span>
                  <button onClick={() => setActiveTab('orders')} className="text-white underline uppercase text-[10px] font-black">Fulfill</button>
                </div>
              )}
              {serviceRequests.some(s => s.status.toUpperCase() === 'PENDING') && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-bold flex justify-between items-center">
                  <span className="flex items-center gap-2">🔧 <strong>Service Request:</strong> Apollo Clinic has requested diagnostic visits.</span>
                  <button onClick={() => setActiveTab('services')} className="text-white underline uppercase text-[10px] font-black">Dispatch</button>
                </div>
              )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue (Delivered)', val: `₹${Number(dashboard?.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'text-emerald-400' },
                { label: 'Store Orders Count', val: dashboard?.totalOrders || 0, color: 'text-white' },
                { label: 'Pending Store Orders', val: dashboard?.pendingOrders || 0, color: 'text-[#D4AF37]' },
                { label: 'Active Service Visits', val: servicesSummary?.activeServicesCount || 0, color: 'text-[#1D9BF0]' },
                { label: 'AMC Total Revenue', val: `₹${Number(servicesSummary?.amcRevenueTotal || 0).toLocaleString('en-IN')}`, color: 'text-white' },
                { label: 'Total Customers', val: dashboard?.totalCustomers || 0, color: 'text-white' },
                { label: 'Catalog Products', val: dashboard?.totalProducts || 0, color: 'text-white' },
                { label: 'Low Stock Alerts', val: dashboard?.lowStockCount || 0, color: dashboard?.lowStockCount > 0 ? 'text-red-400 font-black animate-pulse' : 'text-white' }
              ].map((card, idx) => (
                <div key={idx} className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{card.label}</span>
                  <p className={`text-2xl font-black mt-2 ${card.color}`}>{card.val}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Monthly Sales Trend */}
              <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Monthly Revenue Trend (FY26)</h3>
                <div className="h-48 w-full flex items-end">
                  <svg className="w-full h-full text-[#D4AF37]" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="#1E3E62" strokeDasharray="5,5" />
                    <line x1="0" y1="100" x2="1000" y2="100" stroke="#1E3E62" strokeDasharray="5,5" />
                    <line x1="0" y1="150" x2="1000" y2="150" stroke="#1E3E62" strokeDasharray="5,5" />
                    <path
                      d="M 50 180 Q 200 80 400 130 T 700 40 T 950 60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M 50 180 Q 200 80 400 130 T 700 40 T 950 60 L 950 200 L 50 200 Z"
                      fill="currentColor"
                      fillOpacity="0.05"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
                  <span>Apr 25</span>
                  <span>Jul 25</span>
                  <span>Oct 25</span>
                  <span>Jan 26</span>
                  <span>Mar 26</span>
                </div>
              </div>

              {/* Chart 2: Daily Sales Velocity */}
              <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Daily Sales Velocity (Last 7 Days)</h3>
                <div className="h-48 w-full flex items-end justify-between px-4 pt-4">
                  {[24, 38, 15, 60, 45, 80, 55].map((val, idx) => (
                    <div key={idx} className="w-8 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[9px] text-[#1D9BF0] font-bold">{val}k</span>
                      <div className="w-full bg-[#1D9BF0] rounded-t-lg transition-all duration-500" style={{ height: `${val}%` }} />
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Day {idx+1}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Out of Stock and Out of Calibration warning lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Best Selling Products</h3>
                <div className="divide-y divide-white/[0.04] text-xs">
                  {products.slice(0, 3).map(p => (
                    <div key={p.id} className="py-2.5 flex justify-between">
                      <span className="font-extrabold text-white">{p.name}</span>
                      <span className="text-[#D4AF37] font-black">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Out of Stock Warnings</h3>
                <div className="divide-y divide-white/[0.04] text-xs">
                  {products.filter(p => p.stock <= 0).slice(0, 3).map(p => (
                    <div key={p.id} className="py-2.5 flex justify-between">
                      <span className="text-slate-300 font-bold">{p.name}</span>
                      <span className="text-red-400 font-black uppercase">Out of Stock</span>
                    </div>
                  ))}
                  {products.filter(p => p.stock <= 0).length === 0 && (
                    <p className="text-slate-400 italic py-4">No out-of-stock items in catalog.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Inventory Grid */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 print:hidden">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Inventory Console</h2>
                <p className="text-[#C8D3E0] text-xs mt-1">Manage stock details, soft deletes, and catalog features</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleExportCSV} className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5">
                  <Download className="w-4 h-4" /> Bulk Export
                </button>
                <label className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4" /> Bulk Import
                  <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                </label>
                <button onClick={openAddProductModal} className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" /> Add Product
                </button>
              </div>
            </div>

            {/* Filter tools */}
            <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Search className="w-4 h-4" /></span>
                  <input
                    type="text"
                    placeholder="Search by name, SKU or brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="input-field pl-9 w-full text-xs"
                  />
                </div>
                <div>
                  <select
                    value={productTypeFilter}
                    onChange={(e) => setProductTypeFilter(e.target.value)}
                    className="input-field w-full text-xs"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="EQUIPMENT">Medical Equipment</option>
                    <option value="SPARE_PART">Spare Parts</option>
                  </select>
                </div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-right pr-4">
                  Count: <span className="text-white font-extrabold">{filteredProducts.length}</span> items
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#142F52]/30 border border-white/[0.06] rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-white/[0.06]">
                <thead className="bg-[#0F2745]/60 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">SKU / Code</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Total Stock</th>
                    <th className="p-4 text-center">Reserved</th>
                    <th className="p-4 text-center">Available</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className={p.deleted ? 'opacity-40 bg-red-950/5' : ''}>
                      <td className="p-4">
                        <span className="font-extrabold text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{p.brand} – {p.category}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-300">{p.sku || 'N/A'}</td>
                      <td className="p-4 font-extrabold text-[#D4AF37]">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center font-extrabold text-white">{p.stock}</td>
                      <td className="p-4 text-center font-bold text-slate-300">{p.reservedStock || 0}</td>
                      <td className="p-4 text-center font-extrabold text-[#1D9BF0]">{p.availableStock}</td>
                      <td className="p-4 text-center">
                        {p.deleted ? (
                          <span className="text-[9px] px-2 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-400 font-black uppercase">Deleted</span>
                        ) : p.stock <= 0 ? (
                          <span className="text-[9px] px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 font-black uppercase">Out of Stock</span>
                        ) : p.enabled ? (
                          <span className="text-[9px] px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-black uppercase">Active</span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded border border-slate-500/20 bg-slate-500/10 text-slate-400 font-black uppercase">Disabled</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {p.deleted ? (
                          <button onClick={() => handleRestoreProduct(p.id)} className="text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider text-[10px]">Restore</button>
                        ) : (
                          <>
                            <button onClick={() => openEditProductModal(p)} title="Edit" className="text-slate-300 hover:text-white"><Edit className="w-4 h-4 inline" /></button>
                            <button onClick={() => handleDuplicateProduct(p.id)} title="Clone" className="text-[#1D9BF0] hover:text-[#1D9BF0]/80"><Copy className="w-4 h-4 inline" /></button>
                            <button onClick={() => openAdjustStockModal(p)} title="Stock Adjust" className="text-[#D4AF37] hover:text-[#D4AF37]/80"><Printer className="w-4 h-4 inline" /></button>
                            <button onClick={() => handleToggleProductEnabled(p)} className="text-xs uppercase font-bold text-slate-400 hover:text-white">
                              {p.enabled ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4 inline" /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inventory History Section */}
            <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 mb-4">Stock Adjustment Logs</h3>
              <div className="max-h-60 overflow-y-auto divide-y divide-white/[0.04] text-xs">
                {stockHistory.map(log => (
                  <div key={log.id} className="py-2.5 flex justify-between items-center gap-4">
                    <div>
                      <span className="font-bold text-white uppercase text-[10px] tracking-wider bg-white/[0.04] px-2 py-0.5 rounded border border-white/5 mr-2">{log.adjustmentType}</span>
                      <span className="text-slate-300">Product Ref ID: #{log.productId} – {log.reason || 'Manual Check'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#D4AF37]">{log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged} units</span>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{log.performedBy} on {new Date(log.timestamp).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Store Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-8 print:hidden">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Order Fulfillment Board</h2>
                <p className="text-[#C8D3E0] text-xs mt-1">Control dispatch stages, print packing list templates, and generate labels</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Search className="w-4 h-4" /></span>
                  <input
                    type="text"
                    placeholder="Search by customer name or Order ID..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="input-field pl-9 w-full text-xs"
                  />
                </div>
                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value.toUpperCase())}
                    className="input-field w-full text-xs"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending (Placed)</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PACKED">Packed</option>
                    <option value="READY_TO_SHIP">Ready To Ship</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="RETURNED">Returned</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-right pr-4">
                  Filtered: <span className="text-white font-extrabold">{filteredOrders.length}</span> orders
                </div>
              </div>
            </div>

            {/* Orders list cards */}
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-6">
                  
                  {/* Header Row */}
                  <div className="flex justify-between items-start gap-4 flex-wrap border-b border-white/[0.04] pb-4">
                    <div>
                      <span className="text-[#D4AF37] font-black uppercase text-xs tracking-wider">ME-{order.id}</span>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status.toUpperCase()}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-[#0F2745] border border-white/10 rounded-lg text-xs font-bold text-slate-200 px-3 py-1.5"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PACKED">Packed</option>
                        <option value="READY_TO_SHIP">Ready To Ship</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RETURNED">Returned</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                      <button onClick={() => triggerPrintWindow(order, 'SHIPPING')} title="Print Shipping Label" className="p-2 hover:bg-white/[0.04] border border-white/5 rounded-lg"><Printer className="w-4 h-4 text-slate-300" /></button>
                      <button onClick={() => triggerPrintWindow(order, 'INVOICE')} title="Print Invoice" className="p-2 hover:bg-white/[0.04] border border-white/5 rounded-lg"><FileText className="w-4 h-4 text-[#D4AF37]" /></button>
                      <button onClick={() => triggerPrintWindow(order, 'PACKING')} title="Print Packing Slip" className="p-2 hover:bg-white/[0.04] border border-white/5 rounded-lg"><ClipboardList className="w-4 h-4 text-[#1D9BF0]" /></button>
                    </div>
                  </div>

                  {/* Body columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-[#C8D3E0]">
                    
                    <div className="space-y-1">
                      <h4 className="text-white font-extrabold uppercase tracking-wide text-[10px]">Client Details</h4>
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p>Phone: {order.phone}</p>
                      <p className="truncate">Address: {order.address}, {order.city} – {order.pincode}</p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-white font-extrabold uppercase tracking-wide text-[10px]">Billing Info</h4>
                      <div className="flex justify-between"><span>Payment Method:</span><span className="text-white font-bold">{order.paymentMethod}</span></div>
                      <div className="flex justify-between"><span>Payment Status:</span><span className="text-white font-bold">{order.paymentStatus}</span></div>
                      <div className="flex justify-between"><span>Grand Total:</span><span className="text-[#D4AF37] font-black text-sm">₹{order.totalPrice.toLocaleString('en-IN')}</span></div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-extrabold uppercase tracking-wide text-[10px]">Logistics Actions</h4>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')} className="btn-secondary py-1 px-3 text-[10px] uppercase font-bold flex-grow">Mark Shipped</button>
                        <button onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')} className="btn-secondary py-1 px-3 text-[10px] uppercase font-bold flex-grow">Mark Delivered</button>
                        <button onClick={() => handleReturnOrder(order.id)} className="bg-amber-500/10 border border-amber-500/20 text-amber-400 py-1 px-3 text-[10px] uppercase font-bold flex-grow">Return</button>
                        <button onClick={() => handleRefundOrder(order.id)} className="bg-red-500/10 border border-red-500/20 text-red-400 py-1 px-3 text-[10px] uppercase font-bold flex-grow">Refund</button>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Client Ledger */}
        {activeTab === 'customers' && (
          <div className="space-y-8 print:hidden">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Client Ledger</h2>
                <p className="text-[#C8D3E0] text-xs mt-1">Block/unblock credentials, promote security roles, and view histories</p>
              </div>
            </div>

            {/* Filter search */}
            <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Search className="w-4 h-4" /></span>
                <input
                  type="text"
                  placeholder="Search user records by name, email, or telephone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-field pl-9 w-full text-xs"
                />
              </div>
            </div>

            {/* Customers table */}
            <div className="bg-[#142F52]/30 border border-white/[0.06] rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-white/[0.06]">
                <thead className="bg-[#0F2745]/60 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Super Owner</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className={u.blocked ? 'opacity-40' : ''}>
                      <td className="p-4">
                        <span className="font-extrabold text-white block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{u.email || u.phone}</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handlePromoteUser(u.id, e.target.value)}
                          className="bg-[#0F2745] border border-white/10 rounded-lg text-xs font-bold text-slate-200 px-2.5 py-1"
                        >
                          <option value="USER">Customer</option>
                          <option value="OWNER">Owner</option>
                          <option value="ADMIN">Admin</option>
                          <option value="TECHNICIAN">Technician</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        {u.blocked ? (
                          <span className="text-[9px] px-2 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-400 font-black uppercase">Blocked</span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-black uppercase">Active</span>
                        )}
                      </td>
                      <td className="p-4 text-center font-bold">
                        {u.isSuperOwner ? (
                          <span className="text-[#D4AF37] font-extrabold">SUPER</span>
                        ) : (
                          <span className="text-slate-500">–</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleBlockUser(u.id, u.blocked)}
                          className={`text-xs uppercase font-bold ${u.blocked ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-500 hover:text-amber-400'}`}
                        >
                          {u.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Technician Board */}
        {activeTab === 'technicians' && (
          <div className="space-y-8 print:hidden">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Technician Board</h2>
                <p className="text-[#C8D3E0] text-xs mt-1">Audit field engineer profiles and update availability</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {engineers.map(eng => (
                <div key={eng.id} className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-extrabold text-base leading-tight">{eng.name}</h3>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Specialization: {eng.specialization || 'ICU Systems'}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${eng.available ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                      {eng.available ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  <div className="border-t border-white/[0.04] pt-3 text-xs text-[#C8D3E0] space-y-1">
                    <p>Phone: {eng.phone || 'N/A'}</p>
                    <p>Open tickets: {eng.openJobsCount || 0} jobs</p>
                    <p>Performance rating: ★★★★☆ ({eng.rating || '4.5'}/5.0)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Service Pipeline */}
        {activeTab === 'services' && (
          <div className="space-y-8 print:hidden">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Service Ticket Pipeline</h2>
                <p className="text-[#C8D3E0] text-xs mt-1">Approve service requests, dispatch engineers, and monitor visits</p>
              </div>
            </div>

            <div className="space-y-4">
              {serviceRequests.map(req => (
                <div key={req.id} className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <span className="text-[#1D9BF0] font-black uppercase text-[10px]">TICKET #{req.id}</span>
                      <h3 className="text-white font-extrabold text-base leading-tight">{req.clinicHospitalName}</h3>
                      <p className="text-xs text-slate-300 mt-1">Equipment: {req.equipmentName} ({req.equipmentBrand} - {req.equipmentModel})</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider bg-white/[0.04] text-[#D4AF37] border border-white/5">
                      {req.status}
                    </span>
                  </div>

                  <div className="border-t border-white/[0.04] pt-3 text-xs text-[#C8D3E0] flex justify-between items-center gap-4 flex-wrap">
                    <div>
                      <p>S/N: {req.serialNumber}</p>
                      <p>Issue description: {req.description}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/services/requests/${req.id}`)}
                      className="btn-primary py-1.5 px-4 text-xs font-bold"
                    >
                      Assign/Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Website CMS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveCMS} className="space-y-8 print:hidden">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Website CMS Dashboard</h2>
              <p className="text-[#C8D3E0] text-xs mt-1">Configure homepage settings, parameters, and policies without editing code</p>
            </div>

            <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-6">
              <h3 className="text-white font-extrabold text-sm uppercase tracking-wide border-b border-white/[0.06] pb-2">Hero Section Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hero Accent Title</label>
                  <input
                    type="text"
                    value={cmsSettings.heroTitle || ''}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, heroTitle: e.target.value })}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hero Banner URL</label>
                  <input
                    type="text"
                    value={cmsSettings.bannerUrl || ''}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, bannerUrl: e.target.value })}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-6">
              <h3 className="text-white font-extrabold text-sm uppercase tracking-wide border-b border-white/[0.06] pb-2">Checkout Variables</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Default GST rate (%)</label>
                  <input
                    type="text"
                    value={cmsSettings.gstRate || ''}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, gstRate: e.target.value })}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flat Delivery Cargo Charge (₹)</label>
                  <input
                    type="text"
                    value={cmsSettings.deliveryCharge || ''}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, deliveryCharge: e.target.value })}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-6">
              <h3 className="text-white font-extrabold text-sm uppercase tracking-wide border-b border-white/[0.06] pb-2">Contact & Policies CMS</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Support Telephone</label>
                  <input
                    type="text"
                    value={cmsSettings.contactPhone || ''}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, contactPhone: e.target.value })}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Support Email</label>
                  <input
                    type="text"
                    value={cmsSettings.contactEmail || ''}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, contactEmail: e.target.value })}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">About Us Corporate Text</label>
                  <textarea
                    value={cmsSettings.aboutUs || ''}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, aboutUs: e.target.value })}
                    className="input-field w-full text-xs h-20"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary py-3 px-8 text-xs font-bold uppercase tracking-wider">
              Save parameters to database
            </button>
          </form>
        )}

        {/* Tab 8: Audit Trail */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-8 print:hidden">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Audit Trail</h2>
              <p className="text-[#C8D3E0] text-xs mt-1">Verifiable ledger records of every admin activity (non-deletable)</p>
            </div>

            <div className="bg-[#142F52]/30 border border-white/[0.06] rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-white/[0.06]">
                <thead className="bg-[#0F2745]/60 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono text-[11px]">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 text-white font-bold">{log.performedBy}</td>
                      <td className="p-4 text-[#D4AF37] font-bold">{log.actionName}</td>
                      <td className="p-4 text-slate-300">{log.details || '–'}</td>
                      <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 9: Reports & Analytics */}
        {activeTab === 'reports' && (
          <div className="space-y-8 print:hidden">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Analytics & Reports</h2>
                <p className="text-[#C8D3E0] text-xs mt-1">Export transaction registries or audit stock sheets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Daily Sales Report', desc: 'Summary of orders, revenue aggregates, and shipping charges collected.' },
                { name: 'Low Stock Telemetry', desc: 'Identifies inventory lines below critical threshold (stock <= 10).' },
                { name: 'Field Engineer Report', desc: 'Completed service tickets and average ratings count per technician.' }
              ].map((rep, idx) => (
                <div key={idx} className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">{rep.name}</h3>
                  <p className="text-[#C8D3E0] text-xs leading-relaxed">{rep.desc}</p>
                  <div className="flex gap-2">
                    <button onClick={() => alert('PDF export generated in background!')} className="btn-primary py-1.5 px-3 text-[10px] uppercase font-bold flex-grow flex items-center justify-center gap-1">
                      <FileDown className="w-3.5 h-3.5" /> PDF
                    </button>
                    <button onClick={handleExportCSV} className="btn-secondary py-1.5 px-3 text-[10px] uppercase font-bold flex-grow flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> CSV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: Alert Center */}
        {activeTab === 'notifications' && (
          <div className="space-y-8 print:hidden">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Alert Notification Center</h2>
              <p className="text-[#C8D3E0] text-xs mt-1">Broadcast SMS, email or WhatsApp templates to users</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Form */}
              <form onSubmit={handleSendNotification} className="lg:col-span-2 bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wide border-b border-white/[0.06] pb-2">Broadcast Alert Panel</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Channel Type</label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                      className="input-field w-full text-xs"
                    >
                      <option value="OFFER">SMS Offer Marketing</option>
                      <option value="ORDER">Email Order Update</option>
                      <option value="AMC">WhatsApp AMC Renewal</option>
                      <option value="SERVICE">Service Alert</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recipient Target</label>
                    <select
                      value={notificationForm.recipientType}
                      onChange={(e) => setNotificationForm({ ...notificationForm, recipientType: e.target.value })}
                      className="input-field w-full text-xs"
                    >
                      <option value="ALL">All Accounts</option>
                      <option value="CUSTOMERS">Customers Only</option>
                      <option value="TECHNICIAN">Technicians Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Title Header</label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    className="input-field w-full text-xs"
                    placeholder="e.g. Scheduled Service Renewal"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Notification Content</label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    className="input-field w-full text-xs h-24"
                    placeholder="Type details here..."
                    required
                  />
                </div>

                <button type="submit" className="btn-primary py-2.5 w-full text-xs font-bold uppercase tracking-wider">
                  Dispatch Broadcast Queue
                </button>
              </form>

              {/* Logs */}
              <div className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wide border-b border-white/[0.06] pb-2">Recent Broadcasts</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto text-xs">
                  {notificationLogs.map(log => (
                    <div key={log.id} className="border-b border-white/[0.04] pb-2 last:border-0">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#D4AF37] uppercase text-[9px]">{log.type}</span>
                        <span className="text-slate-500 text-[9px]">{log.sentAt}</span>
                      </div>
                      <p className="font-extrabold text-white mt-1">{log.title}</p>
                      <p className="text-slate-400 mt-0.5 leading-snug">{log.message}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal: Add/Edit Product */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
            <div className="bg-[#0F2745] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-xl font-extrabold text-white">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs text-[#C8D3E0]">
                
                {/* Section 1: Basic Specifications */}
                <div className="space-y-4">
                  <h4 className="text-white font-extrabold uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">1. Product Identification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Product Name</label>
                      <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="input-field w-full" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Category Name</label>
                      <input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="input-field w-full" placeholder="e.g. ICU Monitor" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Product Type</label>
                      <select value={productForm.productType} onChange={(e) => setProductForm({ ...productForm, productType: e.target.value })} className="input-field w-full">
                        <option value="EQUIPMENT">Medical Equipment</option>
                        <option value="SPARE_PART">Spare Part</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Codes, Logistics, Warranty */}
                <div className="space-y-4">
                  <h4 className="text-white font-extrabold uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">2. Logistics & Compliance Code</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">SKU Ref</label>
                      <input type="text" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} className="input-field w-full" placeholder="e.g. SKU-12345" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">HSN Code</label>
                      <input type="text" value={productForm.hsnCode} onChange={(e) => setProductForm({ ...productForm, hsnCode: e.target.value })} className="input-field w-full" placeholder="e.g. 9018" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">GST Rate (%)</label>
                      <input type="text" value={productForm.gstPercent} onChange={(e) => setProductForm({ ...productForm, gstPercent: e.target.value })} className="input-field w-full" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Warranty (Months)</label>
                      <input type="number" value={productForm.warrantyMonths} onChange={(e) => setProductForm({ ...productForm, warrantyMonths: e.target.value })} className="input-field w-full" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Branding & Manufacturer details */}
                <div className="space-y-4">
                  <h4 className="text-white font-extrabold uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">3. Manufacture & Branding</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Brand Name</label>
                      <input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="input-field w-full" placeholder="e.g. GE Healthcare" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Model Number</label>
                      <input type="text" value={productForm.modelNumber} onChange={(e) => setProductForm({ ...productForm, modelNumber: e.target.value })} className="input-field w-full" placeholder="e.g. B40" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Manufacturer Name</label>
                      <input type="text" value={productForm.manufacturer} onChange={(e) => setProductForm({ ...productForm, manufacturer: e.target.value })} className="input-field w-full" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Country of Origin</label>
                      <input type="text" value={productForm.countryOfOrigin} onChange={(e) => setProductForm({ ...productForm, countryOfOrigin: e.target.value })} className="input-field w-full" placeholder="e.g. Germany" />
                    </div>
                  </div>
                </div>

                {/* Section 4: Media Assets & Descriptions */}
                <div className="space-y-4">
                  <h4 className="text-white font-extrabold uppercase tracking-wider text-[10px] border-b border-white/5 pb-1">4. Marketing & Brochure URLs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">Main Image URL</label>
                      <input type="text" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} className="input-field w-full" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">YouTube Demo URL</label>
                      <input type="text" value={productForm.youtubeUrl} onChange={(e) => setProductForm({ ...productForm, youtubeUrl: e.target.value })} className="input-field w-full" placeholder="e.g. https://youtube.com/watch?..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px]">PDF Brochure URL</label>
                      <input type="text" value={productForm.brochureUrl} onChange={(e) => setProductForm({ ...productForm, brochureUrl: e.target.value })} className="input-field w-full" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Dynamic Stocks, Specs & Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[9px]">Price (INR)</label>
                    <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="input-field w-full" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[9px]">Initial Stock Quantity</label>
                    <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="input-field w-full" required />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[9px]">Specifications (Key: Value - one per line)</label>
                    <textarea value={productForm.specsInput} onChange={(e) => setProductForm({ ...productForm, specsInput: e.target.value })} className="input-field w-full h-24" placeholder="Channels: 12&#10;Display: LCD" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[9px]">Features list (separated by commas)</label>
                    <textarea value={productForm.featuresInput} onChange={(e) => setProductForm({ ...productForm, featuresInput: e.target.value })} className="input-field w-full h-24" placeholder="Built-in Printer, Portability Handle" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-slate-400 font-bold uppercase text-[9px]">Description Text</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="input-field w-full h-20" required />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="submit" className="btn-primary py-3 flex-1 text-xs font-bold uppercase">
                    {editingProduct ? 'Update Product Details' : 'Publish Product to Catalog'}
                  </button>
                  <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary py-3 px-6 text-xs font-bold uppercase">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Stock Adjust */}
        {showAdjustModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
            <div className="bg-[#0F2745] border border-white/10 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-base font-extrabold text-white">Adjust Product Stock Levels</h3>
                <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAdjustStock} className="space-y-4 text-xs text-[#C8D3E0]">
                <p className="font-bold text-white uppercase text-[10px]">Reference: {selectedAdjustProduct?.name}</p>
                <p>Current Total Stock: <span className="text-[#D4AF37] font-black">{selectedAdjustProduct?.stock}</span> units</p>
                
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[9px]">Adjustment Category</label>
                  <select
                    value={adjustForm.type}
                    onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
                    className="input-field w-full text-xs"
                  >
                    <option value="INCREASE">Total Stock Increase (Add Items)</option>
                    <option value="DECREASE">Total Stock Decrease (Reduce Items)</option>
                    <option value="DAMAGE">Register Damaged Stock (Moves from Stock -> Damaged)</option>
                    <option value="RETURN">Register Returned Stock (Moves from Returned -> Stock)</option>
                    <option value="INCOMING">Receive Incoming Order items (Incoming -> Stock)</option>
                    <option value="SET_INCOMING">Configure Pending Incoming Stock amount</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[9px]">Quantity Value</label>
                  <input
                    type="number"
                    value={adjustForm.quantity}
                    onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                    className="input-field w-full text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold uppercase text-[9px]">Adjustment Reason</label>
                  <input
                    type="text"
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    className="input-field w-full text-xs"
                    placeholder="e.g. Damaged during freight transit"
                    required
                  />
                </div>

                <button type="submit" className="w-full btn-primary py-2 text-xs font-bold uppercase mt-2">
                  Apply Stock Adjustment
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* PRINT-ONLY CSS AND INTERFACES (Visible ONLY in print media) */}
      {activePrintOrder && (
        <div className="hidden print:block print:bg-white print:text-black print:absolute print:inset-0 font-sans text-xs">
          
          {/* Invoice Layout */}
          {printLayoutType === 'INVOICE' && (
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-800">SRI BALAJI MEDI SYSTEMS</h1>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hospital Machinery & Calibration Services</p>
                </div>
                <div className="text-right">
                  <h2 className="text-md font-extrabold uppercase text-[#D4AF37]">Tax Invoice</h2>
                  <p className="text-[10px] text-slate-500 font-mono">Invoice Reference: ME-{activePrintOrder.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-[11px] text-slate-600">
                <div>
                  <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[9px]">Bill To / Ship To:</h3>
                  <p className="font-extrabold text-black mt-1">{activePrintOrder.customerName}</p>
                  <p>Phone: {activePrintOrder.phone}</p>
                  <p>{activePrintOrder.address}</p>
                  <p>{activePrintOrder.city} – {activePrintOrder.pincode}</p>
                </div>
                <div className="text-right">
                  <p><span className="font-bold">Billing Date:</span> {new Date(activePrintOrder.createdAt).toLocaleDateString('en-IN')}</p>
                  <p><span className="font-bold">Payment Method:</span> {activePrintOrder.paymentMethod}</p>
                  <p><span className="font-bold">Payment Status:</span> {activePrintOrder.paymentStatus}</p>
                </div>
              </div>

              {/* Items List */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-400 bg-slate-100 text-slate-700 font-extrabold uppercase text-[9px]">
                    <th className="py-2 px-1">Description</th>
                    <th className="py-2 px-1 text-center">Qty</th>
                    <th className="py-2 px-1 text-right">Unit Price</th>
                    <th className="py-2 px-1 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {Array.isArray(activePrintOrder.orderItems) && activePrintOrder.orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-1 font-bold text-black">{item.productName || 'Diagnostic Machinery'}</td>
                      <td className="py-2 px-1 text-center">{item.quantity}</td>
                      <td className="py-2 px-1 text-right">₹{Number(item.price).toLocaleString('en-IN')}</td>
                      <td className="py-2 px-1 text-right font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tax Calculations */}
              <div className="border-t border-slate-300 pt-4 flex flex-col items-end text-xs space-y-1 text-slate-600">
                <div className="w-64 flex justify-between"><span>Subtotal:</span><span>₹{activePrintOrder.totalPrice.toLocaleString('en-IN')}</span></div>
                <div className="w-64 flex justify-between"><span>CGST (9.0%):</span><span>Included</span></div>
                <div className="w-64 flex justify-between"><span>SGST (9.0%):</span><span>Included</span></div>
                <div className="w-64 flex justify-between border-t border-slate-300 pt-1 font-black text-black text-sm">
                  <span>Grand Total:</span>
                  <span>₹{activePrintOrder.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-10 text-center text-[10px] text-slate-400 border-t border-slate-200">
                <p>Thank you for purchasing diagnostic machinery from Sri Balaji Medi Systems.</p>
                <p>This is a computer-generated tax invoice and does not require physical signatures.</p>
              </div>
            </div>
          )}

          {/* Packing Slip Layout */}
          {printLayoutType === 'PACKING' && (
            <div className="p-8 space-y-6">
              <div className="border-b border-slate-300 pb-4">
                <h1 className="text-lg font-black tracking-tight text-slate-800">PACKING SLIP / CHECKLIST</h1>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Ref ID: ME-{activePrintOrder.id} – Sri Balaji Medi Systems</p>
              </div>

              <div className="text-[11px] text-slate-600">
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[9px]">Ship To Destination:</h3>
                <p className="font-extrabold text-black mt-1">{activePrintOrder.customerName}</p>
                <p>{activePrintOrder.address}, {activePrintOrder.city} – {activePrintOrder.pincode}</p>
                <p>Hospital Telephone: {activePrintOrder.phone}</p>
              </div>

              {/* Items checklist */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-400 bg-slate-100 text-slate-700 font-extrabold uppercase text-[9px]">
                    <th className="py-2 px-2 text-center w-12">Packed?</th>
                    <th className="py-2 px-1">Machinery / Component Unit</th>
                    <th className="py-2 px-1 text-center w-20">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {Array.isArray(activePrintOrder.orderItems) && activePrintOrder.orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-2 text-center border-r border-slate-200"><div className="w-4 h-4 border border-slate-400 rounded mx-auto" /></td>
                      <td className="py-3 px-2 font-bold text-black">{item.productName}</td>
                      <td className="py-3 px-2 text-center font-bold">{item.quantity} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-6 pt-12 text-[10px] text-slate-500">
                <div>
                  <p className="border-b border-slate-300 h-10 w-48" />
                  <p className="mt-1 font-bold">Warehouse Inspector Signature</p>
                </div>
                <div className="text-right">
                  <p className="border-b border-slate-300 h-10 w-48 ml-auto" />
                  <p className="mt-1 font-bold">Delivery Courier Signature</p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping / Address Label Layout */}
          {printLayoutType === 'SHIPPING' && (
            <div className="w-[4in] h-[6in] p-6 border-2 border-black m-auto flex flex-col justify-between font-sans text-xs bg-white text-black relative">
              <div>
                <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
                  <div>
                    <span className="text-[10px] font-black tracking-widest uppercase">SRI BALAJI SYSTEMS</span>
                    <p className="text-[8px] text-slate-600">Vijayawada AP, India</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">Standard</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-600 uppercase font-black tracking-wider block">Deliver To Destination:</span>
                  <p className="font-extrabold text-sm">{activePrintOrder.customerName}</p>
                  <p className="font-bold text-xs">{activePrintOrder.phone}</p>
                  <p className="text-xs font-semibold leading-relaxed">{activePrintOrder.address}</p>
                  <p className="text-sm font-black mt-2">PIN CODE: {activePrintOrder.pincode}</p>
                </div>
              </div>

              {/* Barcode & QR Code Placeholders */}
              <div className="flex justify-between items-end border-t border-black pt-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-600 font-mono">ORDER ID: ME-{activePrintOrder.id}</span>
                  {/* SVG Barcode */}
                  <svg className="w-40 h-10 text-black" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <rect x="5" y="2" width="2" height="16" fill="black" />
                    <rect x="9" y="2" width="4" height="16" fill="black" />
                    <rect x="15" y="2" width="1" height="16" fill="black" />
                    <rect x="18" y="2" width="3" height="16" fill="black" />
                    <rect x="23" y="2" width="1" height="16" fill="black" />
                    <rect x="26" y="2" width="4" height="16" fill="black" />
                    <rect x="32" y="2" width="2" height="16" fill="black" />
                    <rect x="36" y="2" width="1" height="16" fill="black" />
                    <rect x="39" y="2" width="3" height="16" fill="black" />
                    <rect x="44" y="2" width="1" height="16" fill="black" />
                    <rect x="47" y="2" width="4" height="16" fill="black" />
                    <rect x="53" y="2" width="2" height="16" fill="black" />
                    <rect x="57" y="2" width="1" height="16" fill="black" />
                    <rect x="60" y="2" width="3" height="16" fill="black" />
                    <rect x="65" y="2" width="1" height="16" fill="black" />
                    <rect x="68" y="2" width="4" height="16" fill="black" />
                    <rect x="74" y="2" width="2" height="16" fill="black" />
                    <rect x="78" y="2" width="1" height="16" fill="black" />
                    <rect x="81" y="2" width="3" height="16" fill="black" />
                    <rect x="86" y="2" width="1" height="16" fill="black" />
                    <rect x="89" y="2" width="4" height="16" fill="black" />
                  </svg>
                </div>
                {/* SVG QR Code */}
                <svg className="w-12 h-12" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="25" height="25" fill="black" />
                  <rect x="5" y="5" width="15" height="15" fill="white" />
                  <rect x="10" y="10" width="5" height="5" fill="black" />
                  
                  <rect x="75" y="0" width="25" height="25" fill="black" />
                  <rect x="80" y="5" width="15" height="15" fill="white" />
                  <rect x="85" y="10" width="5" height="5" fill="black" />
                  
                  <rect x="0" y="75" width="25" height="25" fill="black" />
                  <rect x="5" y="80" width="15" height="15" fill="white" />
                  <rect x="10" y="85" width="5" height="5" fill="black" />
                  
                  <rect x="35" y="35" width="15" height="15" fill="black" />
                  <rect x="55" y="55" width="20" height="20" fill="black" />
                  <rect x="75" y="75" width="10" height="10" fill="black" />
                  <rect x="35" y="75" width="15" height="10" fill="black" />
                  <rect x="75" y="35" width="15" height="15" fill="black" />
                </svg>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default OwnerDashboardPage;
