export const MOCK_STUDENTS = [
  { id:1, name:'Nguyễn Minh Khôi', parent:'Nguyễn Văn An', phone:'0901234567', address:'12 Lê Lợi, Q.1',          lat:10.7769, lng:106.7009, zone:'Khu A', route:'Tuyến 1', bus:'51B-12345', status:'active', morning:'present', afternoon:'present' },
  { id:2, name:'Trần Thị Mai',      parent:'Trần Văn Bình', phone:'0912345678', address:'45 Nguyễn Huệ, Q.1',       lat:10.7750, lng:106.7030, zone:'Khu A', route:'Tuyến 1', bus:'51B-12345', status:'active', morning:'present', afternoon:'absent'  },
  { id:3, name:'Lê Hoàng Nam',      parent:'Lê Thị Cẩm',   phone:'0923456789', address:'78 CMT8, Q.3',              lat:10.7820, lng:106.6950, zone:'Khu B', route:'Tuyến 2', bus:'51B-67890', status:'active', morning:'absent',  afternoon:'present' },
  { id:4, name:'Phạm Thu Hà',       parent:'Phạm Văn Dũng', phone:'0934567890', address:'23 Võ Văn Tần, Q.3',       lat:10.7800, lng:106.6980, zone:'Khu B', route:'Tuyến 2', bus:'51B-67890', status:'active', morning:'present', afternoon:'present' },
  { id:5, name:'Hoàng Anh Tuấn',   parent:'Hoàng Thị Lan', phone:'0945678901', address:'56 Điện Biên Phủ, Q.BT',   lat:10.7870, lng:106.7050, zone:'Khu C', route:'Tuyến 3', bus:'51B-11223', status:'active', morning:'leave',   afternoon:'leave'   },
  { id:6, name:'Vũ Thùy Linh',     parent:'Vũ Văn Hùng',   phone:'0956789012', address:'89 Nơ Trang Long, Q.BT',   lat:10.7920, lng:106.7080, zone:'Khu C', route:'Tuyến 3', bus:'51B-11223', status:'active', morning:'present', afternoon:'present' },
];
export const MOCK_BUSES = [
  { id:1, plate:'51B-12345', capacity:30, route:'Tuyến 1', driver:'Nguyễn Tài Khéo', status:'active', gps_lat:10.7769, gps_lng:106.7009 },
  { id:2, plate:'51B-67890', capacity:25, route:'Tuyến 2', driver:'Trần Văn Lái',    status:'active', gps_lat:10.7820, gps_lng:106.6950 },
  { id:3, plate:'51B-11223', capacity:35, route:'Tuyến 3', driver:'Chưa phân',       status:'idle',   gps_lat:10.7900, gps_lng:106.7100 },
];
export const MOCK_DRIVERS = [
  { id:1, name:'Nguyễn Tài Khéo', phone:'0901111222', license:'B2', shift:'morning',   bus:'51B-12345', status:'active'    },
  { id:2, name:'Trần Văn Lái',    phone:'0902222333', license:'B2', shift:'afternoon', bus:'51B-67890', status:'active'    },
  { id:3, name:'Lê Minh Đức',     phone:'0903333444', license:'B2', shift:'both',      bus:'Chưa phân', status:'available' },
  { id:4, name:'Phạm Quốc Khánh', phone:'0904444555', license:'B2', shift:'morning',   bus:'Chưa phân', status:'available' },
];
export const MOCK_LEAVES = [
  { id:1, student:'Hoàng Anh Tuấn', parent:'Hoàng Thị Lan', date:'21/06/2026', session:'Cả ngày',    reason:'Bé bị ốm, sốt cao',           submitted:'20/06/2026 14:32', status:'pending'  },
  { id:2, student:'Trần Thị Mai',   parent:'Trần Văn Bình', date:'21/06/2026', session:'Chiều',      reason:'Gia đình có việc buổi chiều',  submitted:'20/06/2026 15:45', status:'pending'  },
  { id:3, student:'Vũ Thùy Linh',  parent:'Vũ Văn Hùng',   date:'22/06/2026', session:'Sáng',       reason:'Khám sức khỏe định kỳ',        submitted:'20/06/2026 16:20', status:'pending'  },
  { id:4, student:'Lê Hoàng Nam',  parent:'Lê Thị Cẩm',    date:'20/06/2026', session:'Sáng',       reason:'Dậy muộn, ba chở đi trường',   submitted:'19/06/2026 20:10', status:'approved' },
];
export const MOCK_NOTIFICATIONS = [
  { id:1, from:'Hoàng Thị Lan',  type:'leave',  message:'Xin phép cho Hoàng Anh Tuấn nghỉ ngày 21/06 vì bé bị sốt.', time:'16:32 hôm qua', read:false },
  { id:2, from:'Trần Văn Bình',  type:'leave',  message:'Trần Thị Mai nghỉ buổi chiều ngày mai do gia đình có việc.', time:'15:45 hôm qua', read:false },
  { id:3, from:'Nguyễn Tài Khéo',type:'driver', message:'Xe tuyến 1 trễ 10 phút do kẹt xe đường Nguyễn Trãi.',       time:'07:45 hôm nay', read:false },
  { id:4, from:'Trần Văn Lái',   type:'driver', message:'Đã đón đủ học sinh tuyến 2, đang trên đường về trường.',     time:'07:30 hôm nay', read:true  },
];
export const MOCK_TRIPS = [
  { id:1, date:'2026-06-20', shift:'morning',   route:'Tuyến 1', plate:'51B-12345', total:6, present:5, absent:0, leave:1, start:'06:28', end:'07:45', km:12.4, status:'completed' },
  { id:2, date:'2026-06-20', shift:'afternoon', route:'Tuyến 1', plate:'51B-12345', total:6, present:4, absent:1, leave:1, start:'13:22', end:'14:50', km:11.8, status:'completed' },
  { id:3, date:'2026-06-19', shift:'morning',   route:'Tuyến 1', plate:'51B-12345', total:6, present:6, absent:0, leave:0, start:'06:30', end:'07:40', km:12.1, status:'completed' },
  { id:4, date:'2026-06-19', shift:'afternoon', route:'Tuyến 1', plate:'51B-12345', total:6, present:5, absent:1, leave:0, start:'13:25', end:'14:55', km:12.6, status:'completed' },
];
export const MOCK_DRIVER_USER = { id:1, name:'Nguyễn Tài Khéo', phone:'0901111222', license:'B2', shift:'morning', bus_plate:'51B-12345', bus_route:'Tuyến 1', bus_id:1 };
export const MOCK_PARENT_USER = { id:1, name:'Nguyễn Văn An', email:'nguyen.an@gmail.com', phone:'0901234567', avatar_url:null };
export const SCHOOL = { name:'Trường Tiểu Học ABC', address:'123 Nguyễn Đình Chiểu, Q.3', lat:10.7760, lng:106.6900 };
