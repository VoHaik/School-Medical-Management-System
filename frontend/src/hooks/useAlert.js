import { useNotification } from '../components/notifications';

// Hook để thay thế alert() và confirm() cũ
export const useAlert = () => {
  const { showSuccess, showError, showWarning, showInfo, showConfirm } = useNotification();

  // Thay thế alert() với showSuccess hoặc showInfo
  const alert = (message, type = 'info') => {
    switch (type) {
      case 'success':
        showSuccess(message);
        break;
      case 'error':
        showError(message);
        break;
      case 'warning':
        showWarning(message);
        break;
      default:
        showInfo(message);
        break;
    }
  };

  // Thay thế window.confirm()
  const confirm = async (message, title = 'Xác nhận', options = {}) => {
    return await showConfirm({
      title,
      message,
      confirmText: options.confirmText || 'Xác nhận',
      cancelText: options.cancelText || 'Hủy',
      severity: options.severity || 'info'
    });
  };

  // Các helper methods chuyên dụng
  const successAlert = (message) => showSuccess(message);
  const errorAlert = (message) => showError(message);
  const warningAlert = (message) => showWarning(message);
  const infoAlert = (message) => showInfo(message);

  const deleteConfirm = async (itemName = 'mục này') => {
    return await confirm(
      `Bạn có chắc chắn muốn xóa ${itemName}? Hành động này không thể hoàn tác.`,
      'Xác nhận xóa',
      { 
        severity: 'error',
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    );
  };

  const cancelConfirm = async (actionName = 'hành động này') => {
    return await confirm(
      `Bạn có chắc chắn muốn hủy ${actionName}? Tất cả thay đổi chưa lưu sẽ bị mất.`,
      'Xác nhận hủy',
      { 
        severity: 'warning',
        confirmText: 'Hủy bỏ',
        cancelText: 'Tiếp tục'
      }
    );
  };

  const submitConfirm = async (actionName = 'gửi dữ liệu này') => {
    return await confirm(
      `Bạn có chắc chắn muốn ${actionName}?`,
      'Xác nhận gửi',
      { 
        severity: 'info',
        confirmText: 'Gửi',
        cancelText: 'Hủy'
      }
    );
  };

  return {
    alert,
    confirm,
    successAlert,
    errorAlert,
    warningAlert,
    infoAlert,
    deleteConfirm,
    cancelConfirm,
    submitConfirm
  };
};
