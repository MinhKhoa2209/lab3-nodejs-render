# Lab 3: Tạo ứng dụng Node.js và triển khai lên Render

## 1. Mục tiêu

Sau khi hoàn thành bài lab, bạn sẽ:

- Tạo một HTTP server đơn giản bằng Node.js.
- Chạy và kiểm tra ứng dụng trên máy cá nhân.
- Quản lý mã nguồn bằng Git.
- Đẩy mã nguồn lên tài khoản GitHub **MinhKhoa2209**.
- Kết nối repository GitHub với Render.
- Triển khai ứng dụng dưới dạng **Web Service**.
- Truy cập ứng dụng bằng URL HTTPS công khai do Render cung cấp.

> Tài liệu PDF gốc hướng dẫn triển khai lên Heroku. Hướng dẫn này giữ nguyên mục tiêu của bài lab nhưng thay toàn bộ phần Heroku bằng **Render**.
>
> Hướng dẫn giả định repository có tên `lab3-nodejs-render`. Nếu dùng tên khác, hãy thay tên này trong đường dẫn và các lệnh tương ứng.

---

## 2. Thông tin sử dụng trong bài

| Nội dung | Giá trị |
|---|---|
| Tài khoản GitHub | `MinhKhoa2209` |
| Trang GitHub | <https://github.com/MinhKhoa2209> |
| Tên repository đề xuất | `lab3-nodejs-render` |
| URL repository | <https://github.com/MinhKhoa2209/lab3-nodejs-render> |
| Nhánh triển khai | `main` |
| Nền tảng triển khai | Render |
| Loại dịch vụ | Web Service |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |

---

## 3. Chuẩn bị

Cần cài đặt hoặc đăng ký:

1. **Node.js và npm**
   - Tải tại: <https://nodejs.org/>
   - Nên chọn phiên bản LTS.
2. **Git**
   - Tải tại: <https://git-scm.com/downloads>
3. **Tài khoản GitHub**
   - Tài khoản sử dụng trong bài: <https://github.com/MinhKhoa2209>
4. **Tài khoản Render**
   - Đăng ký hoặc đăng nhập tại: <https://dashboard.render.com/>
   - Có thể đăng nhập bằng tài khoản GitHub để kết nối repository thuận tiện hơn.
5. Trình soạn thảo mã nguồn, ví dụ Visual Studio Code.

Kiểm tra Node.js, npm và Git trong terminal:

```bash
node --version
npm --version
git --version
```

Nếu cả ba lệnh đều hiển thị số phiên bản thì có thể tiếp tục.

---

## 4. Tạo thư mục dự án

Mở terminal và chạy:

```bash
mkdir lab3-nodejs-render
cd lab3-nodejs-render
```

Mở thư mục bằng Visual Studio Code nếu đã cài lệnh `code`:

```bash
code .
```

Cấu trúc thư mục hiện tại:

```text
lab3-nodejs-render/
```

---

## 5. Khởi tạo dự án Node.js

Trong thư mục `lab3-nodejs-render`, chạy:

```bash
npm init -y
```

Lệnh này tạo file `package.json` với các giá trị mặc định.

### 5.1. Chỉnh sửa `package.json`

Mở `package.json` và sửa thành:

```json
{
  "name": "lab3-nodejs-render",
  "version": "1.0.0",
  "description": "A simple Node.js application deployed to Render",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "author": "Dinh Minh Khoa",
  "license": "ISC"
}
```

Phần quan trọng nhất là script:

```json
"scripts": {
  "start": "node app.js"
}
```

Khi cấu hình **Start Command** là `npm start`, Render đọc script này và chạy:

```bash
node app.js
```

> **Lưu ý:** `package.json` phải là JSON hợp lệ. Không đặt dấu phẩy sau thuộc tính cuối cùng trong một object.

### 5.2. Tạo `package-lock.json`

Chạy:

```bash
npm install
```

Ứng dụng hiện tại chỉ dùng module `http` có sẵn của Node.js nên không cần cài thư viện bên ngoài. Tuy nhiên, lệnh trên tạo `package-lock.json`, giúp môi trường cài đặt trên Render nhất quán hơn.

---

## 6. Tạo HTTP server

Trong cùng thư mục với `package.json`, tạo file `app.js`:

```javascript
const http = require('http');

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>Hello World</h1>');
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
```

### 6.1. Giải thích mã nguồn

- `require('http')`: nạp module HTTP có sẵn của Node.js.
- `host = '0.0.0.0'`: cho phép server nhận kết nối từ bên ngoài container của Render.
- `process.env.PORT || 3000`:
  - Render tự cấp cổng cho Web Service thông qua biến môi trường `PORT`.
  - Khi chạy trên máy cá nhân, nếu không có biến `PORT`, ứng dụng dùng cổng `3000`.
- `http.createServer(...)`: tạo HTTP server.
- `res.statusCode = 200`: trả về trạng thái `HTTP 200 OK`.
- `Content-Type: text/html; charset=utf-8`: khai báo nội dung phản hồi là HTML sử dụng UTF-8.
- `res.end(...)`: gửi nội dung HTML và kết thúc phản hồi.
- `server.listen(port, host, ...)`: bắt đầu server trên host và cổng đã cấu hình.

> **Quan trọng:** Web Service của Render phải lắng nghe trên `0.0.0.0` và nên sử dụng cổng từ `process.env.PORT`. Không viết cố định chỉ `localhost` hoặc `127.0.0.1` khi triển khai.

---

## 7. Tạo `.gitignore`

Tạo file `.gitignore` trong thư mục dự án:

```gitignore
node_modules/
.env
npm-debug.log*
.DS_Store
```

Ý nghĩa:

- `node_modules/`: không đưa thư viện đã cài trên máy lên GitHub.
- `.env`: không công khai biến môi trường hoặc thông tin bí mật.
- `npm-debug.log*`: bỏ qua log lỗi của npm.
- `.DS_Store`: bỏ qua file hệ thống của macOS nếu có.

Không thêm `package-lock.json` vào `.gitignore`; file này nên được commit lên GitHub.

---

## 8. Kiểm tra ứng dụng trên máy cá nhân

### 8.1. Khởi động server

Chạy:

```bash
npm start
```

Terminal sẽ hiển thị nội dung tương tự:

```text
Server running at http://0.0.0.0:3000
```

### 8.2. Mở ứng dụng

Mở trình duyệt và truy cập:

<http://localhost:3000/>

Kết quả mong đợi:

```text
Hello World
```

Mặc dù terminal hiển thị `0.0.0.0`, khi kiểm tra trên trình duyệt vẫn nên dùng `localhost`.

### 8.3. Dừng server

Quay lại terminal và nhấn:

```text
Ctrl + C
```

### 8.4. Lỗi thường gặp khi chạy cục bộ

#### Lỗi `node: command not found` hoặc `'node' is not recognized`

Node.js chưa được cài hoặc chưa có trong biến môi trường `PATH`. Cài Node.js LTS, đóng terminal, mở terminal mới rồi thử lại.

#### Lỗi `EADDRINUSE`

Cổng `3000` đang được chương trình khác sử dụng. Hãy dừng server cũ hoặc dùng cổng khác.

Git Bash/macOS/Linux:

```bash
PORT=3001 npm start
```

Windows PowerShell:

```powershell
$env:PORT=3001; npm start
```

Sau đó truy cập <http://localhost:3001/>.

#### Trình duyệt không hiển thị nội dung

Kiểm tra:

- Terminal có còn chạy server hay không.
- URL có đúng là `http://localhost:3000/` hay không.
- `app.js` có lỗi cú pháp hay không.
- Cổng hiển thị trong terminal có đúng với cổng trên URL hay không.

---

## 9. Khởi tạo Git repository

Trong terminal, bảo đảm đang đứng trong thư mục chứa `app.js` và `package.json`, sau đó chạy:

```bash
git init
git branch -M main
git add .
git commit -m "Create Node.js application for Render"
```

Giải thích:

- `git init`: khởi tạo repository Git cục bộ.
- `git branch -M main`: đặt tên nhánh hiện tại là `main`.
- `git add .`: đưa các file vào staging area.
- `git commit ...`: tạo commit đầu tiên.

Kiểm tra trạng thái:

```bash
git status
```

Kết quả mong đợi:

```text
On branch main
nothing to commit, working tree clean
```

### 9.1. Cấu hình danh tính Git nếu cần

Nếu Git báo chưa biết tên hoặc email, chạy:

```bash
git config --global user.name "Dinh Minh Khoa"
git config --global user.email "EMAIL_GITHUB_CUA_BAN"
```

Thay `EMAIL_GITHUB_CUA_BAN` bằng email đã liên kết với tài khoản GitHub `MinhKhoa2209`, sau đó commit lại:

```bash
git commit -m "Create Node.js application for Render"
```

---

## 10. Tạo repository trên GitHub

1. Đăng nhập tài khoản GitHub **MinhKhoa2209** tại <https://github.com/MinhKhoa2209>.
2. Nhấn dấu **+** ở góc trên bên phải.
3. Chọn **New repository**.
4. Trong **Repository name**, nhập:

   ```text
   lab3-nodejs-render
   ```

5. Có thể nhập Description:

   ```text
   Lab 3 - Create a Node.js app and deploy it to Render
   ```

6. Chọn **Public** để Render và giảng viên dễ truy cập, trừ khi bài tập yêu cầu repository riêng tư.
7. Vì mã nguồn đã được tạo trên máy, **không chọn**:
   - Add a README file;
   - Add `.gitignore`;
   - Choose a license.
8. Nhấn **Create repository**.

Repository sau khi tạo có địa chỉ:

<https://github.com/MinhKhoa2209/lab3-nodejs-render>

URL dùng làm Git remote là:

```text
https://github.com/MinhKhoa2209/lab3-nodejs-render.git
```

> Nếu bạn chọn tên repository khác, thay `lab3-nodejs-render` trong tất cả URL và lệnh bên dưới bằng tên thực tế.

---

## 11. Đẩy mã nguồn lên GitHub

Kết nối repository cục bộ với repository GitHub của bạn:

```bash
git remote add origin https://github.com/MinhKhoa2209/lab3-nodejs-render.git
```

Đẩy nhánh `main` lên GitHub:

```bash
git push -u origin main
```

Trong đó:

- `origin` là tên remote repository.
- `-u` liên kết nhánh cục bộ `main` với `origin/main`.
- Ở những lần cập nhật sau, chỉ cần chạy `git push`.

Kiểm tra URL remote:

```bash
git remote -v
```

Kết quả phải tương tự:

```text
origin  https://github.com/MinhKhoa2209/lab3-nodejs-render.git (fetch)
origin  https://github.com/MinhKhoa2209/lab3-nodejs-render.git (push)
```

Tải lại trang:

<https://github.com/MinhKhoa2209/lab3-nodejs-render>

Repository phải có tối thiểu:

```text
.gitignore
app.js
package-lock.json
package.json
```

### 11.1. Xác thực GitHub

GitHub không chấp nhận mật khẩu tài khoản thông thường cho thao tác Git qua HTTPS. Nếu được yêu cầu đăng nhập, có thể:

- Đăng nhập bằng cửa sổ trình duyệt qua Git Credential Manager.
- Dùng Personal Access Token thay cho mật khẩu.
- Cấu hình SSH và sử dụng URL SSH.

### 11.2. Lỗi `remote origin already exists`

Kiểm tra remote hiện tại:

```bash
git remote -v
```

Nếu URL không đúng, sửa bằng:

```bash
git remote set-url origin https://github.com/MinhKhoa2209/lab3-nodejs-render.git
```

Sau đó chạy:

```bash
git push -u origin main
```

### 11.3. Lỗi `src refspec main does not match any`

Nguyên nhân thường là chưa có commit hoặc nhánh chưa có tên `main`. Chạy:

```bash
git add .
git commit -m "Create Node.js application for Render"
git branch -M main
git push -u origin main
```

### 11.4. Repository GitHub đã có README hoặc commit khác

Nếu đã khởi tạo README trên GitHub, lịch sử cục bộ và từ xa có thể khác nhau. Với bài lab mới, cách đơn giản nhất là xóa repository vừa tạo nếu không có dữ liệu cần giữ, tạo lại repository rỗng, rồi thực hiện lại bước kết nối.

Không dùng `git push --force` nếu repository chứa dữ liệu cần giữ.

---

## 12. Đăng nhập Render và kết nối GitHub

1. Truy cập <https://dashboard.render.com/>.
2. Đăng ký hoặc đăng nhập Render.
3. Nên chọn đăng nhập bằng **GitHub**.
4. Khi Render yêu cầu quyền truy cập GitHub, cấp quyền cho repository:

   ```text
   MinhKhoa2209/lab3-nodejs-render
   ```

5. Nếu có lựa chọn quyền truy cập:
   - Có thể chọn **Only select repositories** rồi chọn `lab3-nodejs-render` để giới hạn quyền.
   - Hoặc chọn quyền truy cập tất cả repository nếu bạn thực sự muốn.

> Không cần cài Render CLI cho quy trình này. Toàn bộ phần triển khai được thực hiện trên Render Dashboard từ mã nguồn GitHub.

---

## 13. Tạo Web Service trên Render

### 13.1. Bắt đầu tạo dịch vụ

Trong Render Dashboard:

1. Nhấn **New +**.
2. Chọn **Web Service**.
3. Trong danh sách repository, tìm:

   ```text
   MinhKhoa2209 / lab3-nodejs-render
   ```

4. Nhấn **Connect**.

Nếu repository không xuất hiện, xem phần [18.4. Render không tìm thấy repository GitHub](#184-render-không-tìm-thấy-repository-github).

### 13.2. Điền thông tin cấu hình

Thiết lập các trường như sau:

| Trường trên Render | Giá trị đề xuất | Giải thích |
|---|---|---|
| **Name** | `lab3-nodejs-render` | Tên Web Service và là một phần của URL |
| **Region** | Chọn region gần người dùng nhất | Giảm độ trễ truy cập |
| **Branch** | `main` | Nhánh chứa mã nguồn cần deploy |
| **Root Directory** | Để trống | `package.json` nằm ở thư mục gốc repository |
| **Runtime/Language** | `Node` | Môi trường chạy ứng dụng Node.js |
| **Build Command** | `npm install` | Cài dependency theo `package.json`/`package-lock.json` |
| **Start Command** | `npm start` | Thực thi script `start` trong `package.json` |
| **Instance Type** | `Free` nếu tùy chọn này khả dụng | Phù hợp cho bài lab và demo |

Nếu Render tự điền Build Command hoặc Start Command, vẫn cần kiểm tra lại cho đúng:

```text
Build Command: npm install
Start Command: npm start
```

### 13.3. Tạo Web Service

1. Kiểm tra lại repository và nhánh `main`.
2. Chọn loại instance phù hợp; với bài lab có thể chọn **Free** nếu Render đang cung cấp tùy chọn này cho tài khoản.
3. Nhấn **Create Web Service** hoặc **Deploy Web Service**.
4. Render bắt đầu clone repository, chạy Build Command, rồi chạy Start Command.

Không cần cấu hình Node.js buildpack như Heroku. Render nhận diện môi trường **Node** từ cấu hình dịch vụ và `package.json`.

---

## 14. Theo dõi quá trình triển khai

Sau khi tạo Web Service, Render chuyển đến trang dịch vụ và hiển thị log triển khai.

Quá trình thông thường gồm:

1. Clone repository GitHub.
2. Checkout nhánh `main`.
3. Chạy:

   ```bash
   npm install
   ```

4. Chạy:

   ```bash
   npm start
   ```

5. Phát hiện ứng dụng đang lắng nghe trên cổng được cấp.
6. Công bố phiên bản mới.

Log thành công sẽ có dòng từ ứng dụng tương tự:

```text
Server running at http://0.0.0.0:10000
```

Cổng thực tế do Render cấp có thể khác; không cần cấu hình cố định giá trị này.

Khi triển khai thành công, trạng thái dịch vụ sẽ chuyển sang **Live** hoặc hiển thị thông báo deploy thành công.

---

## 15. Mở URL công khai của ứng dụng

Render cung cấp một URL HTTPS có dạng:

```text
https://lab3-nodejs-render.onrender.com
```

Nếu tên dịch vụ đã tồn tại, Render có thể yêu cầu một tên khác; URL thực tế sẽ tương ứng với tên dịch vụ đã chọn.

Có thể mở ứng dụng bằng cách:

1. Nhấn URL ở đầu trang Web Service; hoặc
2. Nhấn **Open** nếu Dashboard hiển thị nút này; hoặc
3. Sao chép URL `onrender.com` và dán vào trình duyệt.

Kết quả mong đợi:

```text
Hello World
```

Ứng dụng hoàn thành nếu:

- Render báo trạng thái **Live**.
- URL sử dụng HTTPS và kết thúc bằng `.onrender.com`.
- Trang hiển thị `Hello World`.
- Runtime log không có lỗi crash.

---

## 16. Triển khai tự động từ GitHub

Khi Render được kết nối trực tiếp với repository GitHub, tính năng tự động triển khai thường được bật cho nhánh đã liên kết.

Kiểm tra trong phần **Settings** của Web Service:

- **Branch**: `main`.
- **Auto-Deploy** hoặc **Auto Deploy**: bật.

Khi Auto-Deploy được bật, quy trình cập nhật là:

```text
Sửa mã nguồn → Commit → Push lên GitHub → Render tự build và deploy
```

### 16.1. Thử cập nhật nội dung

Trong `app.js`, đổi:

```javascript
res.end('<h1>Hello World</h1>');
```

thành:

```javascript
res.end('<h1>Hello from Node.js on Render!</h1>');
```

Lưu file rồi chạy:

```bash
git add app.js
git commit -m "Update home page message"
git push
```

Sau khi push:

1. Mở Render Dashboard.
2. Chọn Web Service `lab3-nodejs-render`.
3. Theo dõi deploy mới trong mục **Events**, **Deploys** hoặc log triển khai.
4. Chờ trạng thái trở lại **Live**.
5. Tải lại URL ứng dụng.

Kết quả mới:

```text
Hello from Node.js on Render!
```

### 16.2. Triển khai thủ công khi cần

Nếu Auto-Deploy đang tắt hoặc cần chạy lại phiên bản mới nhất:

1. Mở Web Service trên Render.
2. Tìm nút **Manual Deploy**.
3. Chọn triển khai commit mới nhất, thường là **Deploy latest commit**.
4. Theo dõi log cho đến khi deploy thành công.

---

## 17. Lưu ý về Free Web Service của Render

Nếu sử dụng **Free instance**, cần lưu ý:

- Web Service miễn phí sẽ tạm dừng sau **15 phút không nhận lưu lượng truy cập**.
- Lần truy cập đầu tiên sau khi tạm dừng có thể mất khoảng **một phút** để dịch vụ khởi động lại.
- Trong thời gian khởi động, Render có thể hiển thị trang loading.
- Mỗi workspace hiện có hạn mức **750 giờ Free instance mỗi tháng** theo tài liệu Render.
- Khi hết hạn mức, các Free Web Service có thể bị tạm ngưng đến đầu tháng tiếp theo.
- Hệ thống file cục bộ của Free Web Service là tạm thời; dữ liệu ghi trực tiếp vào ổ đĩa có thể mất khi deploy, restart hoặc spin down.
- Render có thể restart Free Web Service khi cần.

Ứng dụng của bài lab chỉ trả về HTML tĩnh từ mã nguồn nên không bị ảnh hưởng bởi việc mất dữ liệu trên filesystem.

> Trước khi trình bày hoặc nộp bài, hãy truy cập URL Render trước vài phút để dịch vụ có thời gian khởi động lại.

---

## 18. Xử lý lỗi triển khai trên Render

### 18.1. Lỗi `No open ports detected` hoặc không phát hiện cổng

Kiểm tra `app.js` phải sử dụng:

```javascript
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
```

và:

```javascript
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
```

Không bind server vào `localhost` hoặc `127.0.0.1` trên Render.

Sau khi sửa:

```bash
git add app.js
git commit -m "Fix Render port binding"
git push
```

### 18.2. Lỗi `Missing script: start`

Kiểm tra `package.json` có:

```json
"scripts": {
  "start": "node app.js"
}
```

Kiểm tra Start Command trên Render là:

```text
npm start
```

Sau khi sửa `package.json`:

```bash
git add package.json
git commit -m "Add start script"
git push
```

### 18.3. Lỗi `Cannot find module` hoặc không tìm thấy `app.js`

Kiểm tra:

- File có tên chính xác là `app.js`, không phải `App.js` hoặc `app.js.txt`.
- `app.js` đã được commit và push lên nhánh `main`.
- `package.json` và `app.js` cùng nằm tại thư mục gốc repository.
- **Root Directory** trên Render đang để trống.

Tên file trên môi trường Linux của Render có phân biệt chữ hoa và chữ thường.

### 18.4. Render không tìm thấy repository GitHub

Kiểm tra lần lượt:

1. Repository đã tồn tại tại:
   <https://github.com/MinhKhoa2209/lab3-nodejs-render>
2. Mã nguồn đã được push lên GitHub.
3. Render đã kết nối đúng tài khoản `MinhKhoa2209`.
4. Render GitHub App đã được cấp quyền truy cập repository `lab3-nodejs-render`.
5. Nếu repository là private, Render phải được cấp quyền đọc repository private đó.

Nếu thiếu quyền, mở phần quản lý kết nối GitHub trong Render hoặc phần cài đặt GitHub Apps trên GitHub, sau đó cấp quyền cho repository.

### 18.5. Build thất bại do `package.json`

Chạy trên máy:

```bash
npm install
npm start
```

Nếu npm báo lỗi JSON, kiểm tra:

- Dấu ngoặc kép `"..."`.
- Dấu phẩy giữa các thuộc tính.
- Dấu ngoặc nhọn `{}`.
- Script `start`.

Sau khi sửa:

```bash
git add package.json package-lock.json
git commit -m "Fix package configuration"
git push
```

### 18.6. Deploy thành công nhưng URL chưa phản hồi ngay

Nếu đang dùng Free instance:

- Dịch vụ có thể đang khởi động lại sau thời gian không hoạt động.
- Chờ khoảng một phút rồi tải lại trang.
- Kiểm tra trạng thái dịch vụ và runtime log trên Render.

Nếu log có lỗi, sửa mã nguồn rồi push lại.

### 18.7. Chọn sai nhánh

Trong phần Settings của Web Service, kiểm tra Branch là:

```text
main
```

Nếu repository thực tế dùng nhánh khác, chọn đúng nhánh đang chứa `app.js` và `package.json`, sau đó chạy Manual Deploy.

### 18.8. Build Command hoặc Start Command sai

Cấu hình đúng:

```text
Build Command: npm install
Start Command: npm start
```

Sau khi sửa cài đặt, chọn **Manual Deploy → Deploy latest commit** nếu Render không tự triển khai lại.

### 18.9. Xem log để tìm nguyên nhân

Trong trang Web Service, mở **Logs**, **Events** hoặc **Deploys** tùy giao diện hiện tại. Tìm các dòng có từ khóa:

- `error`
- `failed`
- `Cannot find module`
- `Missing script`
- `No open ports detected`
- `SyntaxError`

Đọc dòng lỗi đầu tiên và các dòng ngay trước/sau nó để xác định nguyên nhân. Log do `console.log` trong `app.js` cũng xuất hiện tại đây.

---

## 19. Cấu trúc dự án hoàn chỉnh

Sau khi hoàn thành, dự án có cấu trúc:

```text
lab3-nodejs-render/
├── .gitignore
├── app.js
├── package-lock.json
└── package.json
```

Không đưa thư mục `node_modules` lên GitHub.

Có thể kiểm tra các file sắp commit bằng:

```bash
git status
```

---

## 20. Quy trình thực hiện ngắn gọn

### 20.1. Thực hiện trên máy cá nhân

```bash
# Tạo dự án
mkdir lab3-nodejs-render
cd lab3-nodejs-render
npm init -y

# Tạo/chỉnh sửa package.json, app.js và .gitignore
# Sau đó tạo package-lock.json
npm install

# Kiểm tra cục bộ
npm start

# Truy cập http://localhost:3000/
# Sau khi kiểm tra xong, nhấn Ctrl+C

# Khởi tạo Git và tạo commit
git init
git branch -M main
git add .
git commit -m "Create Node.js application for Render"

# Kết nối với GitHub của MinhKhoa2209
git remote add origin https://github.com/MinhKhoa2209/lab3-nodejs-render.git
git push -u origin main
```

### 20.2. Thực hiện trên Render Dashboard

1. Truy cập <https://dashboard.render.com/>.
2. Chọn **New + → Web Service**.
3. Kết nối repository `MinhKhoa2209/lab3-nodejs-render`.
4. Chọn branch `main`.
5. Chọn Runtime/Language `Node`.
6. Đặt Build Command là `npm install`.
7. Đặt Start Command là `npm start`.
8. Chọn Free instance nếu khả dụng và phù hợp.
9. Nhấn **Create Web Service**.
10. Chờ trạng thái **Live**.
11. Mở URL `.onrender.com` và kiểm tra `Hello World`.
12. Kiểm tra Auto-Deploy đã bật cho nhánh `main`.

---

## 21. Checklist nộp bài

Trước khi nộp, kiểm tra:

- [ ] `node --version`, `npm --version` và `git --version` hoạt động.
- [ ] `package.json` có script `"start": "node app.js"`.
- [ ] `app.js` sử dụng `process.env.PORT || 3000`.
- [ ] Server lắng nghe trên `0.0.0.0`.
- [ ] `npm start` chạy thành công trên máy cá nhân.
- [ ] <http://localhost:3000/> hiển thị `Hello World`.
- [ ] Đã commit mã nguồn bằng Git.
- [ ] Repository tồn tại tại <https://github.com/MinhKhoa2209/lab3-nodejs-render>.
- [ ] GitHub có `app.js`, `package.json` và `package-lock.json`.
- [ ] Render đã kết nối đúng repository `MinhKhoa2209/lab3-nodejs-render`.
- [ ] Render đang deploy nhánh `main`.
- [ ] Runtime/Language là Node.
- [ ] Build Command là `npm install`.
- [ ] Start Command là `npm start`.
- [ ] Quá trình deploy hoàn tất và dịch vụ có trạng thái **Live**.
- [ ] URL `.onrender.com` truy cập được.
- [ ] Trang công khai hiển thị đúng nội dung.
- [ ] Đã lưu URL GitHub và URL Render để nộp.

---

## 22. Nội dung nên chụp màn hình làm minh chứng

Nếu giảng viên yêu cầu báo cáo, nên chụp:

1. Kết quả `node --version`, `npm --version` và `git --version`.
2. Nội dung `package.json` có script `start`.
3. Nội dung `app.js` có `process.env.PORT` và `0.0.0.0`.
4. Trang <http://localhost:3000/> hiển thị `Hello World`.
5. Terminal sau khi chạy `git push -u origin main` thành công.
6. Repository GitHub của `MinhKhoa2209` chứa đầy đủ mã nguồn.
7. Trang cấu hình Render thể hiện:
   - repository;
   - branch `main`;
   - Build Command;
   - Start Command.
8. Log Render báo deploy thành công.
9. Web Service có trạng thái **Live**.
10. URL công khai `.onrender.com` hiển thị `Hello World`.

Mỗi ảnh nên có chú thích ngắn, ví dụ:

```text
Hình 1. Chạy ứng dụng Node.js thành công trên localhost.
Hình 2. Mã nguồn đã được đẩy lên GitHub MinhKhoa2209.
Hình 3. Render triển khai Web Service thành công.
Hình 4. Ứng dụng hoạt động tại URL công khai của Render.
```

---

## 23. Thông tin cần ghi lại để nộp

Sau khi hoàn tất, điền URL thực tế:

```text
GitHub repository:
https://github.com/MinhKhoa2209/lab3-nodejs-render

Render Web Service:
https://TEN-DICH-VU-THUC-TE.onrender.com
```

Không ghi URL Render mẫu nếu URL thực tế khác. Hãy sao chép chính xác URL được hiển thị trong Render Dashboard.
