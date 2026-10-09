@echo off
chcp 65001 > nul
echo ========================================================
echo   KHỞI ĐỘNG WEBSITE NHÔM KÍNH HUY HOÀNG (THANH HÓA)
echo ========================================================
echo.
echo [1/2] Đang khởi động Backend API tại http://localhost:5000 ...
start "Huy Hoang Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo [2/2] Đang khởi động Frontend Web tại http://localhost:5173 ...
start "Huy Hoang Frontend React" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo ✅ Cả Backend và Frontend đã được khởi động thành công!
echo 🌐 Website khách hàng : http://localhost:5173
echo 🔑 Trang quản trị Admin: http://localhost:5173/admin/login
echo 👤 Tài khoản mặc định  : admin / admin@123
echo ========================================================
pause
