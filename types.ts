
export type Language = 'vi' | 'en';

export interface GiaoDucTichHop {
  kyNangSong?: string;
  quocPhongAnNinh?: string;
  baoVeMoiTruong?: string;
  congDanSo?: string;
}

export interface DurationInput {
  level: 'TieuHoc' | 'THCS' | 'THPT';
  periods: string;
}

export interface LessonPlanInput {
  teacherName: string;
  subject: string;
  grade: string;
  duration: DurationInput;
  lessonTitle?: string;
  congVan: string; // '5512', '2345', '1001', or '958'
  integrateDigitalCompetency?: boolean;
}

// --- Structures for Công văn 5512 ---
interface ActivityImplementation5512 {
  noiDung?: string; 
  sanPham?: string; 
}

interface Activity5512 {
  mucTieu?: string;
  noiDung?: string; 
  sanPham?: string; 
  toChuc?: ActivityImplementation5512; 
}

export interface GeneratedLessonPlan5512 {
  congVan: '5512';
  lessonTitle?: string;
  subject?: string;
  grade?: string;
  duration?: string;
  mucTieu?: {
    kienThuc?: string;
    nangLuc?: string;
    phamChat?: string;
  };
  giaoDucTichHop?: GiaoDucTichHop;
  thietBi?: string;
  tienTrinh?: {
    [key: string]: Activity5512;
  };
}

// --- Structures for Công văn 2345 ---
export interface Activity2345 {
    hoatDong: string;
    yeuCau: string;
    dieuChinh?: string;
}

export interface GeneratedLessonPlan2345 {
    congVan: '2345';
    lessonTitle?: string;
    subject?: string;
    grade?: string;
    duration?: string;
    yeuCauCanDat: {
      phamChat?: string;
      nangLuc?: string;
    };
    doDungDayHoc: string;
    hoatDongDayHoc: Activity2345[];
    dieuChinhSauBaiDay?: string;
}

// --- Structures for Công văn 1001 ---
export interface Activity1001 {
    tenHoatDong: string;
    mucTieu: string;
    cachToChucGiaoVien: string;
    hoatDongHocSinh: string;
}

export interface GeneratedLessonPlan1001 {
    congVan: '1001';
    lessonTitle?: string;
    subject?: string;
    grade?: string;
    duration?: string;
    yeuCauCanDat?: {
        nangLucChung?: string;
        nangLucDacThu?: string;
        phamChat?: string;
        noiDungTichHop?: string;
    };
    doDungDayHoc?: {
        giaoVien?: string;
        hocSinh?: string;
    };
    hoatDongDayHoc?: Activity1001[];
    dieuChinhSauBaiDay?: string;
}

// --- Structures for Công văn 958 (Phụ lục 4) ---
interface Activity958 {
  mucTieu?: string;
  noiDung?: string;
  sanPham?: string;
  toChucThucHien?: string;
}

export interface GeneratedLessonPlan958 {
  congVan: '958';
  lessonTitle?: string;
  subject?: string;
  grade?: string;
  duration?: string;
  mucTieu?: {
    kienThuc?: string;
    nangLuc?: string;
    phamChat?: string;
  };
  thietBi?: string;
  tienTrinh?: {
    [key: string]: Activity958;
  };
}


export type GeneratedLessonPlan = GeneratedLessonPlan5512 | GeneratedLessonPlan2345 | GeneratedLessonPlan1001 | GeneratedLessonPlan958;
