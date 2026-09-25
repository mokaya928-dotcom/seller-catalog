import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  FileDown,
  Sparkles,
  HelpCircle,
  Package,
  Layers,
  Check,
  RotateCcw,
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  parseProductsFile,
  downloadSampleExcel,
  downloadSampleCsv,
  exportProductsToExcel,
  exportProductsToCsv,
  exportFullStoreBackup,
  parseBackupFile
} from '../../services/bulkImportService';

export default function BulkUploadModal({
  isOpen,
  onClose,
  products = [],
  seller = {},
  todayOverrides = {},
  postedMap = {},
  onBulkImport,
  onRestoreBackup,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'export' | 'backup'
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Upload parsed state
  const [parsedResult, setParsedResult] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [importMode, setImportMode] = useState('append'); // 'append' | 'replace'
  const [parseError, setParseError] = useState(null);

  // Backup restore state
  const [backupRestoreData, setBackupRestoreData] = useState(null);
  const [backupError, setBackupError] = useState(null);

  const fileInputRef = useRef(null);
  const backupInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle spreadsheet file upload
  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setParseError('Please upload an Excel file (.xlsx, .xls) or CSV file (.csv)');
      return;
    }

    setParseError(null);
    setIsParsing(true);

    try {
      const result = await parseProductsFile(file);
      setParsedResult(result);
      // Select all valid products by default
      const allIds = new Set(result.validProducts.map((p) => p.id));
      setSelectedProductIds(allIds);
    } catch (err) {
      console.error('File parsing failed', err);
      setParseError(err.message || 'Could not parse spreadsheet. Please verify format.');
      setParsedResult(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Toggle selection for a product
  const toggleSelectProduct = (id) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select / Deselect all
  const toggleSelectAll = () => {
    if (!parsedResult) return;
    if (selectedProductIds.size === parsedResult.validProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(parsedResult.validProducts.map((p) => p.id)));
    }
  };

  // Confirm import
  const handleConfirmImport = async () => {
    if (!parsedResult || selectedProductIds.size === 0) return;

    const toImport = parsedResult.validProducts.filter((p) => selectedProductIds.has(p.id));
    setIsProcessing(true);

    try {
      await onBulkImport(toImport, importMode);
      onShowToast(
        importMode === 'replace'
          ? `✓ Successfully replaced catalogue with ${toImport.length} products!`
          : `✓ Successfully added ${toImport.length} products to catalogue!`,
        'success'
      );
      handleResetUpload();
      onClose();
    } catch (err) {
      console.error('Import failed', err);
      onShowToast('Import failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetUpload = () => {
    setParsedResult(null);
    setSelectedProductIds(new Set());
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Backup JSON upload
  const handleBackupFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackupError(null);
      try {
        const parsed = await parseBackupFile(file);
        setBackupRestoreData(parsed);
      } catch (err) {
        setBackupError(err.message);
        setBackupRestoreData(null);
      }
    }
  };

  // Confirm restore
  const handleConfirmRestore = async () => {
    if (!backupRestoreData) return;
    const confirmed = window.confirm(
      `Restore backup for "${backupRestoreData.seller?.shop_name || 'Store'}" with ${
        backupRestoreData.products?.length || 0
      } products? This will update your store profile and catalogue.`
    );
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await onRestoreBackup(backupRestoreData);
      onShowToast('✓ Store profile & catalogue restored successfully!', 'success');
      setBackupRestoreData(null);
      onClose();
    } catch (err) {
      console.error('Restore failed', err);
      onShowToast('Could not restore backup. Please verify file.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                Bulk Upload &amp; Store Backup
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                CSV / Excel spreadsheets, sample templates, and complete backups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/60'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/60'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Catalogue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/60'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Store Backup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* ============================================================== */}
          {/* TAB 1: BULK UPLOAD (CSV / EXCEL) */}
          {/* ============================================================== */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {!parsedResult ? (
                <>
                  {/* Download Template Strip */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-black text-amber-950">
                          Need a ready-made template?
                        </div>
                        <div className="text-[11px] text-amber-800/90 leading-tight">
                          Includes sample beauty &amp; retail products with all headers pre-formatted.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={downloadSampleExcel}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-lg flex items-center gap-1 shadow-2xs transition"
                      >
                        <Download className="w-3 h-3" />
                        <span>Excel (.xlsx)</span>
                      </button>
                      <button
                        type="button"
                        onClick={downloadSampleCsv}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-[11px] py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition"
                      >
                        <Download className="w-3 h-3" />
                        <span>CSV (.csv)</span>
                      </button>
                    </div>
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                        : 'border-gray-300 hover:border-emerald-500 hover:bg-gray-50/80'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-2xs">
                      {isParsing ? (
                        <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileSpreadsheet className="w-7 h-7" />
                      )}
                    </div>

                    <div className="text-sm font-extrabold text-gray-900 mb-1">
                      {isParsing ? 'Analyzing spreadsheet...' : 'Choose or drop your spreadsheet here'}
                    </div>
                    <p className="text-xs text-gray-500 max-w-sm mb-3">
                      Supports <span className="font-bold text-gray-700">Excel (.xlsx, .xls)</span> and{' '}
                      <span className="font-bold text-gray-700">CSV (.csv)</span> exported from POS, Shopify, WooCommerce, or Google Sheets.
                    </p>

                    <button
                      type="button"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition"
                    >
                      Browse Files
                    </button>
                  </div>

                  {/* Error Notification */}
                  {parseError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{parseError}</span>
                    </div>
                  )}

                  {/* Smart Column Auto-Detection Guidance */}
                  <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 space-y-2">
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Smart Column Auto-Detection</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Our importer intelligently recognizes your column headers. Headers can be in any order:
                    </p>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {[
                        'Product Name',
                        'Price (KES)',
                        'Regular Price',
                        'Category',
                        'Size',
                        'In Stock',
                        'Photo URL',
                        'Benefit Line',
                        'Badge',
                        'Highlights'
                      ].map((col) => (
                        <span
                          key={col}
                          className="bg-white border border-gray-200 px-2 py-0.5 rounded-md font-mono font-medium text-gray-700"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* PREVIEW OF PARSED PRODUCTS */
                <div className="space-y-4">
                  {/* File Summary Strip */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        <Check className="w-5 h-5 stroke-[3px]" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-emerald-950">
                          {parsedResult.validProducts.length} Products Ready to Import
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium">
                          From <span className="font-bold">{parsedResult.fileName}</span> (
                          {selectedProductIds.size} selected)
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetUpload}
                      className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2.5 py-1.5 rounded-xl transition"
                    >
                      Change File
                    </button>
                  </div>

                  {/* Warnings / Skipped Rows banner */}
                  {(parsedResult.warnings.length > 0 || parsedResult.invalidRows.length > 0) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-900 space-y-1">
                      {parsedResult.invalidRows.length > 0 && (
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            {parsedResult.invalidRows.length} row(s) skipped due to missing product name.
                          </span>
                        </div>
                      )}
                      {parsedResult.warnings.slice(0, 2).map((w, idx) => (
                        <div key={idx} className="text-amber-800 text-[10px] pl-5">
                          • {w}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Import Mode Radio */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 space-y-2">
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                      Import Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          importMode === 'append'
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="append"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-gray-900">
                            Add to Existing Catalogue
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Preserves existing items ({products.length} current). Recommended.
                          </div>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          importMode === 'replace'
                            ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="mt-0.5 text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-rose-900">
                            Replace All Products
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Overwrites inventory completely with this file.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Products Selection Header */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="font-extrabold text-gray-700">
                      Preview Items ({selectedProductIds.size} of {parsedResult.validProducts.length} selected)
                    </div>
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline text-[11px]"
                    >
                      {selectedProductIds.size === parsedResult.validProducts.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>

                  {/* Scrollable Item Preview List */}
                  <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-2xl p-2 bg-gray-50/50">
                    {parsedResult.validProducts.map((p) => {
                      const isSelected = selectedProductIds.has(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleSelectProduct(p.id)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                            isSelected
                              ? 'bg-white border-emerald-400 shadow-2xs'
                              : 'bg-white/60 border-gray-200 opacity-60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectProduct(p.id)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <img
                            src={p.photo || '/products/bbk-cerave-cream.jpg'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = '/products/bbk-cerave-cream.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-gray-900 truncate">
                              {p.name}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                              <span className="font-black text-emerald-700">
                                KES {Number(p.price).toLocaleString()}
                              </span>
                              {p.size && (
                                <>
                                  <span>•</span>
                                  <span>{p.size}</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="truncate">{p.category}</span>
                            </div>
                          </div>
                          {p.badge && (
                            <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded flex-shrink-0">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Confirm Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isProcessing || selectedProductIds.size === 0}
                      onClick={handleConfirmImport}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
                      style={{ minHeight: '48px' }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Importing Products...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3px]" />
                          <span>
                            Confirm Import ({selectedProductIds.size} Products)
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: EXPORT INVENTORY (EXCEL / CSV) */}
          {/* ============================================================== */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              {/* Inventory Overview Card */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                      Active Inventory
                    </span>
                    <h3 className="text-xl font-black mt-0.5">{products.length} Products</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-emerald-800/80 px-2.5 py-1 rounded-full font-bold">
                      {products.filter((p) => p.in_stock).length} In Stock
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-2">
                  Exports include all product details: names, prices, regular prices, sizes, categories,
                  stock status, photo URLs, badges, ingredients, and usage guides.
                </p>
              </div>

              {/* Export Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Excel Option */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-900">Microsoft Excel (.xlsx)</h4>
                    <p className="text-[11px] text-gray-600 leading-tight">
                      Styled workbook with formatted columns and headers. Perfect for inventory counts, price updates, and spreadsheets.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      exportProductsToExcel(products, seller.shop_name);
                      onShowToast('✓ Excel spreadsheet downloaded!', 'success');
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel (.xlsx)</span>
                  </button>
                </div>

                {/* CSV Option */}
                <div className="border border-gray-200 bg-gray-50/70 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center shadow-xs">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-900">Standard CSV (.csv)</h4>
                    <p className="text-[11px] text-gray-600 leading-tight">
                      Universal CSV with UTF-8 encoding. Compatible with all POS software, Google Sheets, WooCommerce, and accounting tools.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      exportProductsToCsv(products, seller.shop_name);
                      onShowToast('✓ CSV file downloaded!', 'success');
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV (.csv)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: FULL STORE BACKUP & RESTORE */}
          {/* ============================================================== */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              {/* Backup Card */}
              <div className="border border-emerald-300 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">
                      Download Full Store Backup (JSON Snapshot)
                    </h4>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                      Saves an offline snapshot of your entire shop: seller profile ({seller.shop_name}),
                      M-Pesa till ({seller.mpesa_till || 'N/A'}), brand colors, phone number, all {products.length} products,
                      and custom schedule settings.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    exportFullStoreBackup(seller, products, todayOverrides, postedMap);
                    onShowToast('✓ Full store backup file created & downloaded!', 'success');
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Download className="w-4 h-4 stroke-[2.5px]" />
                  <span>Download Store Backup File (.json)</span>
                </button>
              </div>

              {/* Restore Card */}
              <div className="border border-gray-200 bg-gray-50/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900">Restore Store from Backup</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                      Restore your shop profile and products from a previously downloaded `.json` backup file.
                      Useful when setting up a new device or recovering data.
                    </p>
                  </div>
                </div>

                <input
                  ref={backupInputRef}
                  type="file"
                  accept=".json, application/json"
                  onChange={handleBackupFileChange}
                  className="hidden"
                />

                {!backupRestoreData ? (
                  <button
                    type="button"
                    onClick={() => backupInputRef.current?.click()}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Backup File (.json) to Restore</span>
                  </button>
                ) : (
                  <div className="bg-white border border-emerald-400 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900">
                        📦 Backup Identified:
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBackupRestoreData(null);
                          if (backupInputRef.current) backupInputRef.current.value = '';
                        }}
                        className="text-[10px] text-gray-500 hover:text-gray-900 underline"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="text-[11px] text-gray-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200">
                      <div>
                        Shop: <span className="font-bold">{backupRestoreData.seller?.shop_name || 'Store'}</span>
                      </div>
                      <div>
                        Products: <span className="font-bold">{backupRestoreData.products?.length || 0}</span>
                      </div>
                      {backupRestoreData.exportedAt && (
                        <div className="text-[10px] text-gray-500">
                          Exported: {new Date(backupRestoreData.exportedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleConfirmRestore}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      {isProcessing ? 'Restoring...' : 'Confirm Restore Store Profile & Catalog'}
                    </button>
                  </div>
                )}

                {backupError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{backupError}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
