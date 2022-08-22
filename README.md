# CI CD With Github Action
## Định nghĩa
### CI 
- CI là Continuous Intergration. Có nghĩa là quá trình tích hợp liên tục. 
- Mỗi khi các thành viên tích hợp công việc, nó sẽ được build tự động, chạy test case nhằm phát hiện lỗi nhanh nhất có thể
- CI sẽ tránh trường hợp build ở local OK nhưng môi trường khác thì lại không 
- Ngoài ra nó cũm giúp giảm rủi ro, tăng chất lượng phần mềm, giảm những quy trình thủ công, sinh ra phần mềm có thể deploy ở bất kỳ thời gian địa điểm nào 

### CD
- CD là Continuous Delivery. 
- Hơn CI ở chỗ, nó triển khai tất cả thay đổi về code đến môi trường testing hoặc staging. 
- CD cho phép developer tự động hoá phần testing bên cạch việc sử dụng unitest, kiểm tra phần mềm qua nhiều thước đo trước khi triển khai cho kahcsh hàng.
- Nó tự động hoàn toàn quy trình release sản phầm

## Github Action
### Định nghĩa 
- Hỗ trợ việc tự động hoá các tác vụ trong vòng đời sản phẩm.
- Hoạt động theo hướng sự kiên

### Các thành phần 
#### Workflows
- Tập các hành động thêm vào repo để định nghĩa các hành động. Một workflow có thể được định nghĩa bằng file yaml.
#### Events
- Là các sự kiện, trigger để các Workflow bắt đầu. Trong Repo này thì là việc new push lên branch main
#### Jobs
- Là tập hợp các bước thực hiện một công việc của runner.
- Mặc định thì các job trong một workflow được chạy song song 
- Có thể cấu hình để nó chạy tuần tự
#### Steps
- Một tác vụ độc lập, và có thể là một command trong jobs.
- Mỗi steps có thể là một action hoặc command 
- Có thể chia sẻ dữ liệu giữa các steps
#### Actions
- Một conmmand độc lập khi kếp hợp tạo thành một steps
- Là đơn vị nhỏ nhất 
#### Runners
- Là một server được cài đặt sẵn Github Action runner application.
- Có thể sử dụng host của github hoặc tự host

### Các bước setup việc tự động deploy code và chạy thông qua SSH
- Trước hết tạo 1 thư mục .github/workflows, thư mục này sẽ chứa tất cả workflows để sử dụng github action ( Tên thư mục phải chuẩn )
#### Sinh khoá SSH 
- Truy cập thông qua SSH vào server
- Sinh một khoá RSA thông qua ssh-keygen với câu lệnh 
```
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
- Lưu khoá này vào file github-actions
- Sau đó sẽ có 2 file ở trong .ssh folder là github-actions để lưu private key và github-actions.pub để lưu public key
#### Thêm pulic key vào authorized_keys
- Phải them github-actions.pub vào authorized_keys để những máy có private key github-actions có thể truy cập vào server
- Sử dụng câu lệnh sau : 
```
cat github-actions.pub >> ~/.ssh/authorized_keys
```
#### Thêm private key github action vào secrets repo
- Vài repo => truy cập secrets => truy cập actions => truy cập add new secret
- coppy private key được lưu trong github-actions và lưu vào secret repo với tên SSH_PRIVATE_KEY

#### Thêm private key vào Github Action Workflow
- Sử dụng shimataro/ssh-key-action để cài đặt ssh key
```
    - name: Install SSH Key
      uses: shimataro/ssh-key-action@v2
      with:
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        known_hosts: unnecessary
```
- key là SSH_PRIVATE_KEY được lưu trong secret hay github-actions private key 
- known_hosts là bất cứ thứ gì, mình sẽ thêm vào bước tiếp theo

#### Thêm known_hosts
- Thêm SSH_HOST biến vào Github Secrets với địa chỉ IP
- Sau đó ta thêm known_hosts 
```
 - name: Adding Known Hosts
      run: ssh-keyscan -H ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts
```
#### Thực hiện pull từ github thông qua appleboy/ssh-action
- Cần đủ 3 biến để có thể truy cập vào SSH 
- host : là địa chỉ IP hay SSH_HOST
- key : là private key hay SSH_PRIVATE_KEY
- username: là user để đăng nhập ( có thể là root ... ) và được lưu trong SSH_USERNAME trong secret
- Câu lệnh :
```
cd backend-cicd
git pull origin main
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
nvm ls
node --version
yarn --version
yarn install
yarn stop 
yarn build
```

