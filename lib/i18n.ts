export type Language = 'vi' | 'en';
export interface Translations {
  home: string;
  taxiCompanies: string;
  drivers: string;
  services: string;
  feedback: string;
  login: string;
  register: string;
  downloadApp: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  searchButton: string;
  pickupPoint: string;
  destination: string;
  pickupTime: string;
  registerCompany: string;
  registerDriver: string;
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  videoTitle: string;
  videoSubtitle: string;
  pricingTitle: string;
  pricingSubtitle: string;
  basicPlan: string;
  premiumPlan: string;
  enterprisePlan: string;
  partnersTitle: string;
  partnersSubtitle: string;
  featuredTaxis: string;
  partners: string;
  viewAll: string;
  details: string;
  call: string;
  online: string;
  featured: string;
  getStarted: string;
  learnMore: string;
  contactUs: string;
  listingTitle: string;
  listingSubtitle: string;
  registerCompanyTab: string;
  searchCompanyTab: string;
  companyRegistrationTitle: string;
  companyRegistrationDesc: string;
  companyInfo: string;
  contactInfo: string;
  membershipType: string;
  paymentMethod: string;
  companyName: string;
  companyId: string;
  password: string;
  contactPerson: string;
  designation: string;
  address: string;
  mobile: string;
  telephone: string;
  fax: string;
  email: string;
  website: string;
  description: string;
  monthly: string;
  quarterly: string;
  free: string;
  basic: string;
  premium: string;
  monthlyFee: string;
  quarterlyFee: string;
  reset: string;
  searchCompanyTitle: string;
  searchCompanyDesc: string;
  searchResults: string;
  enterKeyword: string;
  driversTitle: string;
  driversSubtitle: string;
  registerDriverTab: string;
  searchDriverTab: string;
  driverRegistrationTitle: string;
  driverRegistrationDesc: string;
  personalInfo: string;
  contactExperience: string;
  driverName: string;
  driverId: string;
  city: string;
  experience: string;
  driverDescription: string;
  experienceYears: string;
  describeYourself: string;
  payment: string;
  cost: string;
  searchDriverTitle: string;
  searchDriverDesc: string;
  searchDriverPlaceholder: string;
  enterDriverKeyword: string;
  servicesTitle: string;
  servicesSubtitle: string;
  ourServices: string;
  whyChooseUs: string;
  whatCustomersSay: string;
  howItWorks: string;
  startToday: string;
  chooseService: string;
  sendFeedback: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step1Desc: string;
  step2Desc: string;
  step3Desc: string;
  step4Desc: string;
  hotline: string;
  workingHours: string;
  service1Title: string;
  service1Desc: string;
  service1Features: string;
  service1Pricing: string;
  service2Title: string;
  service2Desc: string;
  service2Features: string;
  service2Pricing: string;
  service3Title: string;
  service3Desc: string;
  service3Features: string;
  service3Pricing: string;
  service4Title: string;
  service4Desc: string;
  service4Features: string;
  service4Pricing: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;
  benefit4Title: string;
  benefit4Desc: string;
  testimonial1: string;
  testimonial2: string;
  testimonial3: string;
  testimonial1Role: string;
  testimonial2Role: string;
  testimonial3Role: string;
  mainFeatures: string;
}
export const translations: Record<Language, Translations> = {
  vi: {
    home: 'Trang Chủ',
    taxiCompanies: 'Công Ty Taxi',
    drivers: 'Tài Xế',
    services: 'Dịch Vụ',
    feedback: 'Góp Ý',
    login: 'Đăng Nhập',
    register: 'Đăng Ký',
    downloadApp: 'TẢI ỨNG DỤNG NGAY',
    heroTitle: 'Kết Nối Taxi Thông Minh',
    heroSubtitle: 'Tìm Kiếm Và Đặt Taxi Nhanh Chóng, An Toàn Với Công Nghệ Tiên Tiến',
    searchPlaceholder: 'Tìm Kiếm Dịch Vụ Taxi',
    searchButton: 'Tìm Kiếm Taxi',
    pickupPoint: 'Điểm Đón',
    destination: 'Điểm Đến',
    pickupTime: 'Ngày Giờ Đón',
    registerCompany: 'Đăng Ký Công Ty Taxi',
    registerDriver: 'Đăng Ký Tài Xế',
    featuresTitle: 'Tại Sao Chọn Chúng Tôi',
    featuresSubtitle: 'Dịch Vụ Taxi Hàng Đầu Với Công Nghệ Hiện Đại',
    feature1Title: 'Đặt Xe Nhanh Chóng',
    feature1Desc: 'Chỉ Cần Vài Cú Click Để Đặt Xe Trong Vòng 2 Phút',
    feature2Title: 'Tài Xế Chuyên Nghiệp',
    feature2Desc: 'Đội Ngũ Tài Xế Được Đào Tạo Chuyên Nghiệp Và Thân Thiện',
    feature3Title: 'Giá Cả Minh Bạch',
    feature3Desc: 'Bảng Giá Rõ Ràng, Không Phát Sinh Chi Phí Ẩn',
    feature4Title: 'Hỗ Trợ 24/7',
    feature4Desc: 'Đội Ngũ Hỗ Trợ Khách Hàng 24/7 Sẵn Sàng Giúp Đỡ',
    videoTitle: 'Trải Nghiệm Dịch Vụ Taxi',
    videoSubtitle: 'Xem Video Để Hiểu Rõ Hơn Về Dịch Vụ Của Chúng Tôi',
    pricingTitle: 'Bảng Giá Dịch Vụ',
    pricingSubtitle: 'Lựa Chọn Gói Dịch Vụ Phù Hợp Với Nhu Cầu Của Bạn',
    basicPlan: 'Gói Cơ Bản',
    premiumPlan: 'Gói Cao Cấp',
    enterprisePlan: 'Gói Doanh Nghiệp',
    partnersTitle: 'Đối Tác Tin Cậy',
    partnersSubtitle: 'Hơn 500+ Công Ty Taxi Và 10,000+ Tài Xế Đã Tin Tưởng Sử Dụng Radiocabs.in',
    featuredTaxis: 'Taxi Nổi Bật',
    partners: 'Đối Tác',
    viewAll: 'Xem Tất Cả',
    details: 'Chi Tiết',
    call: 'Gọi',
    online: 'Online',
    featured: 'Nổi Bật',
    getStarted: 'Bắt Đầu',
    learnMore: 'Tìm Hiểu Thêm',
    contactUs: 'Liên Hệ',
    listingTitle: 'Đăng Ký & Tìm Kiếm Công Ty Taxi',
    listingSubtitle: 'Đăng Ký Công Ty Taxi Của Bạn Hoặc Tìm Kiếm Các Công Ty Taxi Đã Đăng Ký Trên Hệ Thống Radiocabs.in',
    registerCompanyTab: 'Đăng Ký Công Ty',
    searchCompanyTab: 'Tìm Kiếm Công Ty',
    companyRegistrationTitle: 'Đăng Ký Công Ty Taxi',
    companyRegistrationDesc: 'Điền Thông Tin Để Đăng Ký Công Ty Taxi Của Bạn',
    companyInfo: 'Thông Tin Công Ty',
    contactInfo: 'Thông Tin Liên Hệ',
    membershipType: 'Loại Thành Viên',
    paymentMethod: 'Hình Thức Thanh Toán',
    companyName: 'Tên Công Ty',
    companyId: 'Mã Công Ty (Duy Nhất)',
    password: 'Mật Khẩu',
    contactPerson: 'Người Liên Hệ',
    designation: 'Chức Vụ',
    address: 'Địa Chỉ',
    mobile: 'Số Điện Thoại',
    telephone: 'Điện Thoại Bàn',
    fax: 'Fax',
    email: 'Email',
    website: 'Website',
    description: 'Mô Tả',
    monthly: 'Theo Tháng',
    quarterly: 'Theo Quý',
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium',
    monthlyFee: 'Phí Hàng Tháng',
    quarterlyFee: 'Phí Hàng Quý',
    reset: 'Đặt Lại',
    searchCompanyTitle: 'Tìm Kiếm Công Ty Taxi',
    searchCompanyDesc: 'Tìm Kiếm Các Công Ty Taxi Đã Đăng Ký Trên Hệ Thống',
    searchResults: 'Kết Quả Tìm Kiếm',
    enterKeyword: 'Nhập Từ Khóa Để Tìm Kiếm Công Ty Taxi',
    driversTitle: 'Đăng Ký & Tìm Kiếm Tài Xế',
    driversSubtitle: 'Đăng Ký Làm Tài Xế Taxi Hoặc Tìm Kiếm Các Tài Xế Có Kinh Nghiệm Trên Hệ Thống Radiocabs.in',
    registerDriverTab: 'Đăng Ký Tài Xế',
    searchDriverTab: 'Tìm Kiếm Tài Xế',
    driverRegistrationTitle: 'Đăng Ký Tài Xế Taxi',
    driverRegistrationDesc: 'Điền Thông Tin Để Đăng Ký Làm Tài Xế Taxi',
    personalInfo: 'Thông Tin Cá Nhân',
    contactExperience: 'Liên Hệ & Kinh Nghiệm',
    driverName: 'Họ Và Tên',
    driverId: 'Mã Tài Xế (Duy Nhất)',
    city: 'Thành Phố',
    experience: 'Kinh Nghiệm (Năm)',
    driverDescription: 'Mô Tả Bản Thân',
    experienceYears: 'Kinh Nghiệm (Năm)',
    describeYourself: 'Mô Tả Về Kinh Nghiệm, Kỹ Năng Lái Xe...',
    payment: 'Hình Thức Thanh Toán',
    cost: 'Chi Phí',
    searchDriverTitle: 'Tìm Kiếm Tài Xế',
    searchDriverDesc: 'Tìm Kiếm Các Tài Xế Có Kinh Nghiệm Đã Đăng Ký Trên Hệ Thống',
    searchDriverPlaceholder: 'Nhập Tên Tài Xế, Mã Tài Xế, Thành Phố Hoặc Kinh Nghiệm...',
    enterDriverKeyword: 'Nhập Từ Khóa Để Tìm Kiếm Tài Xế',
    servicesTitle: 'Dịch Vụ & Thông Tin',
    servicesSubtitle: 'Khám Phá Các Dịch Vụ Toàn Diện Của Radiocabs.in - Nền Tảng Kết Nối Hàng Đầu Trong Ngành Taxi Tại Việt Nam',
    ourServices: 'Các Dịch Vụ Của Chúng Tôi',
    whyChooseUs: 'Tại Sao Chọn Radiocabs.in?',
    whatCustomersSay: 'Khách Hàng Nói Gì Về Chúng Tôi',
    howItWorks: 'Cách Thức Hoạt Động',
    startToday: 'Bắt Đầu Ngay Hôm Nay',
    chooseService: 'Chọn Dịch Vụ Phù Hợp Với Nhu Cầu Của Bạn',
    sendFeedback: 'Gửi Góp Ý',
    step1: 'Đăng Ký',
    step2: 'Xác Thực',
    step3: 'Kích Hoạt',
    step4: 'Kết Nối',
    step1Desc: 'Tạo Tài Khoản Và Điền Thông Tin Cần Thiết',
    step2Desc: 'Chúng Tôi Xác Thực Thông Tin Và Phê Duyệt',
    step3Desc: 'Tài Khoản Được Kích Hoạt Và Sẵn Sàng Sử Dụng',
    step4Desc: 'Bắt Đầu Kết Nối Và Sử Dụng Dịch Vụ',
    hotline: 'Hotline',
    workingHours: 'Giờ Làm Việc',
    service1Title: 'Đăng Ký Công Ty Taxi',
    service1Desc: 'Đăng Ký Công Ty Taxi Của Bạn Lên Hệ Thống Để Tiếp Cận Nhiều Khách Hàng Hơn',
    service1Features: 'Hiển Thị Thông Tin Công Ty, Quản Lý Đội Xe, Theo Dõi Đơn Hàng, Báo Cáo Doanh Thu',
    service1Pricing: 'Từ 200,000 VNĐ/Tháng',
    service2Title: 'Đăng Ký Tài Xế',
    service2Desc: 'Tham Gia Mạng Lưới Tài Xế Chuyên Nghiệp Và Tìm Kiếm Cơ Hội Việc Làm',
    service2Features: 'Hồ Sơ Tài Xế Chuyên Nghiệp, Kết Nối Với Công Ty, Đánh Giá Từ Khách Hàng, Hỗ Trợ 24/7',
    service2Pricing: '150,000 VNĐ/Tháng',
    service3Title: 'Hỗ Trợ Khách Hàng',
    service3Desc: 'Hệ Thống Hỗ Trợ Và Góp Ý Toàn Diện Cho Mọi Người Dùng',
    service3Features: 'Hỗ Trợ 24/7, Xử Lý Khiếu Nại, Tư Vấn Dịch Vụ, Phản Hồi Nhanh Chóng',
    service3Pricing: 'Miễn Phí',
    service4Title: 'Quản Lý Đội Xe',
    service4Desc: 'Giải Pháp Quản Lý Đội Xe, Theo Dõi Hành Trình Và Tối Ưu Hóa Lịch Trình',
    service4Features: 'Quản Lý Đội Xe, Tối Ưu Lộ Trình, Báo Cáo Nâng Cao',
    service4Pricing: 'Liên Hệ Để Nhận Báo Giá',
    benefit1Title: 'Mạng Lưới Rộng Khắp',
    benefit1Desc: 'Kết Nối Toàn Quốc Với Hàng Nghìn Công Ty Taxi Và Tài Xế',
    benefit2Title: 'Bảo Mật Tuyệt Đối',
    benefit2Desc: 'Thông Tin Được Mã Hóa Và Bảo Vệ Theo Tiêu Chuẩn Quốc Tế',
    benefit3Title: 'Công Nghệ Hiện Đại',
    benefit3Desc: 'Nền Tảng Công Nghệ Tiên Tiến, Giao Diện Thân Thiện',
    benefit4Title: 'Cộng Đồng Lớn',
    benefit4Desc: 'Hơn 10,000 Thành Viên Đang Sử Dụng Dịch Vụ',
    testimonial1: 'Radiocabs.in Đã Giúp Chúng Tôi Mở Rộng Khách Hàng Đáng Kể. Hệ Thống Dễ Sử Dụng Và Hỗ Trợ Tốt.',
    testimonial2: 'Tôi Đã Tìm Được Nhiều Cơ Hội Việc Làm Tốt Thông Qua Nền Tảng Này. Rất Hài Lòng Với Dịch Vụ.',
    testimonial3: 'Dịch Vụ Quảng Cáo Hiệu Quả, Giúp Tăng Độ Nhận Biết Thương Hiệu Và Thu Hút Khách Hàng Mới.',
    testimonial1Role: 'Giám Đốc Taxi Mai Linh',
    testimonial2Role: 'Tài Xế Độc Lập',
    testimonial3Role: 'Chủ Công Ty Vận Tải',
    mainFeatures: 'Tính Năng Chính'
  },
  en: {
    home: 'Home',
    taxiCompanies: 'Taxi Companies',
    drivers: 'Drivers',
    services: 'Services',
    feedback: 'Feedback',
    login: 'Login',
    register: 'Register',
    downloadApp: 'DOWNLOAD APP NOW',
    heroTitle: 'Smart Taxi Connection',
    heroSubtitle: 'Find And Book Taxis Quickly And Safely With Advanced Technology',
    searchPlaceholder: 'Search Taxi Service',
    searchButton: 'Search Taxi',
    pickupPoint: 'Pickup Point',
    destination: 'Destination',
    pickupTime: 'Pickup Time',
    registerCompany: 'Register Taxi Company',
    registerDriver: 'Register Driver',
    featuresTitle: 'Why Choose Us',
    featuresSubtitle: 'Leading Taxi Service With Modern Technology',
    feature1Title: 'Quick Booking',
    feature1Desc: 'Just A Few Clicks To Book A Taxi In 2 Minutes',
    feature2Title: 'Professional Drivers',
    feature2Desc: 'Team Of Professionally Trained And Friendly Drivers',
    feature3Title: 'Transparent Pricing',
    feature3Desc: 'Clear Pricing Table, No Hidden Costs',
    feature4Title: '24/7 Support',
    feature4Desc: '24/7 Customer Support Team Ready To Help',
    videoTitle: 'Taxi Service Experience',
    videoSubtitle: 'Watch The Video To Better Understand Our Service',
    pricingTitle: 'Service Pricing',
    pricingSubtitle: 'Choose The Service Package That Suits Your Needs',
    basicPlan: 'Basic Plan',
    premiumPlan: 'Premium Plan',
    enterprisePlan: 'Enterprise Plan',
    partnersTitle: 'Trusted Partners',
    partnersSubtitle: 'Over 500+ Taxi Companies And 10,000+ Drivers Trust Radiocabs.in',
    featuredTaxis: 'Featured Taxis',
    partners: 'Partners',
    viewAll: 'View All',
    details: 'Details',
    call: 'Call',
    online: 'Online',
    featured: 'Featured',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    listingTitle: 'Register & Search Taxi Companies',
    listingSubtitle: 'Register Your Taxi Company Or Search For Registered Taxi Companies On Radiocabs.in System',
    registerCompanyTab: 'Register Company',
    searchCompanyTab: 'Search Company',
    companyRegistrationTitle: 'Register Taxi Company',
    companyRegistrationDesc: 'Fill In The Information To Register Your Taxi Company',
    companyInfo: 'Company Information',
    contactInfo: 'Contact Information',
    membershipType: 'Membership Type',
    paymentMethod: 'Payment Method',
    companyName: 'Company Name',
    companyId: 'Company ID (Unique)',
    password: 'Password',
    contactPerson: 'Contact Person',
    designation: 'Designation',
    address: 'Address',
    mobile: 'Mobile Phone',
    telephone: 'Telephone',
    fax: 'Fax',
    email: 'Email',
    website: 'Website',
    description: 'Description',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium',
    monthlyFee: 'Monthly Fee',
    quarterlyFee: 'Quarterly Fee',
    reset: 'Reset',
    searchCompanyTitle: 'Search Taxi Companies',
    searchCompanyDesc: 'Search For Registered Taxi Companies On The System',
    searchResults: 'Search Results',
    enterKeyword: 'Enter Keywords To Search For Taxi Companies',
    driversTitle: 'Register & Search Drivers',
    driversSubtitle: 'Register As A Taxi Driver Or Search For Experienced Drivers On Radiocabs.in System',
    registerDriverTab: 'Register Driver',
    searchDriverTab: 'Search Driver',
    driverRegistrationTitle: 'Register Taxi Driver',
    driverRegistrationDesc: 'Fill In The Information To Register As A Taxi Driver',
    personalInfo: 'Personal Information',
    contactExperience: 'Contact & Experience',
    driverName: 'Full Name',
    driverId: 'Driver ID (Unique)',
    city: 'City',
    experience: 'Experience (Years)',
    driverDescription: 'Self Description',
    experienceYears: 'Experience (Years)',
    describeYourself: 'Describe Your Experience, Driving Skills...',
    payment: 'Payment Method',
    cost: 'Cost',
    searchDriverTitle: 'Search Drivers',
    searchDriverDesc: 'Search For Experienced Drivers Registered On The System',
    searchDriverPlaceholder: 'Enter Driver Name, Driver ID, City Or Experience...',
    enterDriverKeyword: 'Enter Keywords To Search For Drivers',
    servicesTitle: 'Services & Information',
    servicesSubtitle: 'Discover Comprehensive Services Of Radiocabs.in - The Leading Connection Platform In Vietnam Taxi Industry',
    ourServices: 'Our Services',
    whyChooseUs: 'Why Choose Radiocabs.in?',
    whatCustomersSay: 'What Our Customers Say',
    howItWorks: 'How It Works',
    startToday: 'Start Today',
    chooseService: 'Choose The Service That Suits Your Needs',
    sendFeedback: 'Send Feedback',
    step1: 'Register',
    step2: 'Verify',
    step3: 'Activate',
    step4: 'Connect',
    step1Desc: 'Create Account And Fill In Necessary Information',
    step2Desc: 'We Verify Information And Approve',
    step3Desc: 'Account Is Activated And Ready To Use',
    step4Desc: 'Start Connecting And Using Services',
    hotline: 'Hotline',
    workingHours: 'Working Hours',
    service1Title: 'Taxi Company Registration',
    service1Desc: 'Register Your Taxi Company On The System To Reach More Customers',
    service1Features: 'Display Company Information, Fleet Management, Order Tracking, Revenue Reports',
    service1Pricing: 'From 200,000 VND/Month',
    service2Title: 'Driver Registration',
    service2Desc: 'Join Professional Driver Network And Find Job Opportunities',
    service2Features: 'Professional Driver Profile, Connect With Companies, Customer Reviews, 24/7 Support',
    service2Pricing: '150,000 VND/Month',
    service3Title: 'Customer Support',
    service3Desc: 'Comprehensive Support And Feedback System For All Users',
    service3Features: '24/7 Support, Complaint Handling, Service Consultation, Quick Response',
    service3Pricing: 'Free',
    service4Title: 'Fleet Management',
    service4Desc: 'Solutions To Manage Your Fleet, Track Trips And Optimize Schedules',
    service4Features: 'Fleet Administration, Route Optimization, Advanced Reporting',
    service4Pricing: 'Contact Us For Pricing',
    benefit1Title: 'Wide Network',
    benefit1Desc: 'Nationwide Connection With Thousands Of Taxi Companies And Drivers',
    benefit2Title: 'Absolute Security',
    benefit2Desc: 'Information Encrypted And Protected To International Standards',
    benefit3Title: 'Modern Technology',
    benefit3Desc: 'Advanced Technology Platform, User-Friendly Interface',
    benefit4Title: 'Large Community',
    benefit4Desc: 'Over 10,000 Members Using Our Services',
    testimonial1: 'Radiocabs.in Has Helped Us Significantly Expand Our Customer Base. The System Is Easy To Use And Has Good Support.',
    testimonial2: 'I Found Many Good Job Opportunities Through This Platform. Very Satisfied With The Service.',
    testimonial3: 'Effective Advertising Service, Helping Increase Brand Awareness And Attract New Customers.',
    testimonial1Role: 'Mai Linh Taxi Director',
    testimonial2Role: 'Independent Driver',
    testimonial3Role: 'Transport Company Owner',
    mainFeatures: 'Main Features'
  }
}