
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { LessonPlanInput, GeneratedLessonPlan } from '../types';

const activitySchema5512 = {
  type: Type.OBJECT,
  properties: {
    mucTieu: { type: Type.STRING, description: 'Mục tiêu của hoạt động' },
    noiDung: { type: Type.STRING, description: 'Nội dung hoạt động' },
    sanPham: { type: Type.STRING, description: 'Sản phẩm học tập dự kiến' },
    toChuc: {
      type: Type.OBJECT,
      description: 'Tổ chức thực hiện',
      properties: {
        noiDung: { type: Type.STRING, description: 'Hoạt động của GV và HS' },
        sanPham: { type: Type.STRING, description: 'Sản phẩm dự kiến chi tiết' },
      },
      required: ['noiDung', 'sanPham'],
    },
  },
  required: ['mucTieu', 'noiDung', 'sanPham', 'toChuc'],
};

const baseSchema5512Properties = {
    congVan: { type: Type.STRING, enum: ['5512'] },
    lessonTitle: { type: Type.STRING, description: 'Tên bài dạy' },
    subject: { type: Type.STRING, description: 'Môn học' },
    grade: { type: Type.STRING, description: 'Lớp' },
    duration: { type: Type.STRING, description: 'Thời gian thực hiện' },
    mucTieu: {
      type: Type.OBJECT,
      properties: {
        kienThuc: { type: Type.STRING, description: 'Mục tiêu về kiến thức' },
        nangLuc: { type: Type.STRING, description: 'Mục tiêu về năng lực' },
        phamChat: { type: Type.STRING, description: 'Mục tiêu về phẩm chất' },
      },
       required: ['kienThuc', 'nangLuc', 'phamChat'],
    },
    giaoDucTichHop: {
      type: Type.OBJECT,
      description: 'Các nội dung giáo dục được tích hợp trong bài học',
      properties: {
        kyNangSong: { type: Type.STRING, description: 'Nội dung giáo dục kỹ năng sống' },
        quocPhongAnNinh: { type: Type.STRING, description: 'Nội dung giáo dục quốc phòng – an ninh' },
        baoVeMoiTruong: { type: Type.STRING, description: 'Nội dung giáo dục bảo vệ môi trường' },
        congDanSo: { type: Type.STRING, description: 'Nội dung giáo dục công dân số' },
      },
    },
    thietBi: { type: Type.STRING, description: 'Thiết bị dạy học và học liệu' },
};

const activitySchema2345 = {
    type: Type.OBJECT,
    properties: {
        hoatDong: { type: Type.STRING, description: 'Tên và nội dung hoạt động dạy học. Mô tả rõ mục tiêu, cách tiến hành, vai trò của giáo viên (GV) và học sinh (HS).' },
        yeuCau: { type: Type.STRING, description: 'Sản phẩm hoặc kết quả đầu ra cần đạt được của học sinh sau khi hoàn thành hoạt động. Phải cụ thể và đo lường được.' },
        dieuChinh: { type: Type.STRING, description: 'Ghi chú về các phương án điều chỉnh cho phù hợp với đối tượng học sinh hoặc điều kiện thực tế. Có thể để trống.' }
    },
    required: ['hoatDong', 'yeuCau'],
};

const baseSchema2345Properties = {
    congVan: { type: Type.STRING, enum: ['2345'] },
    lessonTitle: { type: Type.STRING, description: 'Tên bài dạy' },
    subject: { type: Type.STRING, description: 'Môn học' },
    grade: { type: Type.STRING, description: 'Lớp' },
    duration: { type: Type.STRING, description: 'Thời gian thực hiện' },
    yeuCauCanDat: {
        type: Type.OBJECT,
        description: 'Các yêu cầu cần đạt của bài học, tập trung vào việc hình thành và phát triển phẩm chất và năng lực cho học sinh.',
        properties: {
            phamChat: { type: Type.STRING, description: 'Các phẩm chất chủ yếu cần hình thành (ví dụ: nhân ái, chăm chỉ, trung thực, trách nhiệm).' },
            nangLuc: { type: Type.STRING, description: 'Các năng lực chung và năng lực đặc thù cần phát triển (ví dụ: năng lực tự chủ và tự học, giao tiếp và hợp tác, giải quyết vấn đề và sáng tạo, năng lực ngôn ngữ, năng lực tính toán).' }
        },
    },
    doDungDayHoc: { type: Type.STRING, description: 'Liệt kê chi tiết các thiết bị, đồ dùng, học liệu cần thiết cho cả giáo viên và học sinh. Viết dưới dạng gạch đầu dòng.' },
    hoatDongDayHoc: {
        type: Type.ARRAY,
        description: 'Một mảng gồm các hoạt động dạy học chính. Hãy cấu trúc theo 4 bước: 1. Mở đầu/Khởi động, 2. Khám phá/Hình thành kiến thức, 3. Luyện tập, 4. Vận dụng/Mở rộng.',
        items: activitySchema2345
    },
    dieuChinhSauBaiDay: { type: Type.STRING, description: 'Những kinh nghiệm rút ra và những thay đổi cần thực hiện cho các bài dạy sau. Có thể để trống.' }
};

const activitySchema1001 = {
    type: Type.OBJECT,
    properties: {
        tenHoatDong: { type: Type.STRING, description: 'Tên của hoạt động, ví dụ: "1. Hoạt động mở đầu"' },
        mucTieu: { type: Type.STRING, description: 'Mục tiêu cụ thể của hoạt động này.' },
        cachToChucGiaoVien: { type: Type.STRING, description: 'Mô tả chi tiết các bước và hành động của giáo viên để tổ chức hoạt động.' },
        hoatDongHocSinh: { type: Type.STRING, description: 'Mô tả chi tiết các bước và hành động tương ứng của học sinh để thực hiện nhiệm vụ học tập. Nêu rõ sản phẩm/kết quả học sinh cần đạt được.' }
    },
    required: ['tenHoatDong', 'mucTieu', 'cachToChucGiaoVien', 'hoatDongHocSinh'],
};


const baseSchema1001Properties = {
    congVan: { type: Type.STRING, enum: ['1001'] },
    lessonTitle: { type: Type.STRING, description: 'Tên bài dạy' },
    subject: { type: Type.STRING, description: 'Môn học' },
    grade: { type: Type.STRING, description: 'Lớp' },
    duration: { type: Type.STRING, description: 'Thời gian thực hiện' },
    yeuCauCanDat: {
        type: Type.OBJECT,
        description: 'Các yêu cầu cần đạt của bài học theo 4 mục.',
        properties: {
            nangLucChung: { type: Type.STRING, description: 'Nội dung về Năng lực chung.' },
            nangLucDacThu: { type: Type.STRING, description: 'Nội dung về Năng lực đặc thù.' },
            phamChat: { type: Type.STRING, description: 'Nội dung về Phẩm chất.' },
            noiDungTichHop: { type: Type.STRING, description: 'Nội dung tích hợp trong bài dạy.' }
        },
    },
    doDungDayHoc: {
        type: Type.OBJECT,
        description: 'Đồ dùng dạy học được chia cho Giáo viên và Học sinh.',
        properties: {
            giaoVien: { type: Type.STRING, description: 'Các thiết bị, học liệu GV cần sử dụng.' },
            hocSinh: { type: Type.STRING, description: 'Các đồ dùng học tập mà học sinh cần chuẩn bị.' }
        }
    },
    hoatDongDayHoc: {
        type: Type.ARRAY,
        description: 'Một mảng gồm 4 hoạt động dạy học chính: Mở đầu, Hình thành kiến thức mới, Luyện tập, Vận dụng.',
        items: activitySchema1001
    },
    dieuChinhSauBaiDay: { type: Type.STRING, description: 'Những kinh nghiệm rút ra và những thay đổi cần thực hiện cho các bài dạy sau. Có thể để trống.' }
};


const getActivityTitle5512 = (key: string) => {
    switch (key) {
        case 'hoatDong1': return "Hoạt động 1: Mở đầu (Xác định vấn đề/nhiệm vụ học tập)";
        case 'hoatDong2': return "Hoạt động 2: Hình thành kiến thức mới";
        case 'hoatDong3': return "Hoạt động 3: Luyện tập";
        case 'hoatDong4': return "Hoạt động 4: Vận dụng";
        default: return `Hoạt động`;
    }
};

const getBasePrompt = (input: LessonPlanInput): string => {
    const { level, periods } = input.duration;
    let levelText: string;
    switch (level) {
        case 'MamNon': levelText = 'Mầm non (25-30 phút/tiết)'; break;
        case 'TieuHoc': levelText = 'Tiểu học (35 phút/tiết)'; break;
        case 'THPT': levelText = 'THPT (45 phút/tiết)'; break;
        case 'THCS': default: levelText = 'THCS (45 phút/tiết)'; break;
    }
    const finalDurationString = periods ? `${periods} tiết (Cấp ${levelText})` : '';

    return `Bạn là một chuyên gia giáo dục AI, có nhiệm vụ tạo ra một Kế hoạch bài dạy (Giáo án) chi tiết dựa trên hình ảnh/PDF sách giáo khoa và các thông tin được cung cấp.
    
    Thông tin ban đầu:
    - Mẫu giáo án: Công văn ${input.congVan}
    - Môn học: ${input.subject || '(AI tự xác định)'}
    - Lớp: ${input.grade || '(AI tự xác định)'}
    - Tên bài dạy: ${input.lessonTitle || '(AI tự xác định)'}
    - Thời gian thực hiện: ${finalDurationString || '(AI tự đề xuất dựa trên nội dung)'}
    
    Hãy phân tích kỹ các tệp đính kèm để hoàn thành nhiệm vụ.`;
}


export async function generateLessonPlanPart(
  apiKey: string,
  input: LessonPlanInput,
  fileParts: { inlineData: { mimeType: string; data: string } }[],
  currentPlan: GeneratedLessonPlan | null,
  partToGenerate: string
): Promise<any> {
  
  let context = "Đây là bước đầu tiên của việc tạo giáo án.";
  if (currentPlan) {
    const contextParts = [];
    if (currentPlan.lessonTitle) contextParts.push(`Tên bài dạy: "${currentPlan.lessonTitle}"`);
    if (currentPlan.subject) contextParts.push(`Môn học: ${currentPlan.subject}`);
    if (currentPlan.grade) contextParts.push(`Lớp: ${currentPlan.grade}`);
    if (currentPlan.congVan === '5512' && currentPlan.mucTieu) {
        contextParts.push(`Các mục tiêu chính (Kiến thức, Năng lực, Phẩm chất) đã được xác định.`);
    }
    if ((currentPlan.congVan === '2345' || currentPlan.congVan === '1001') && currentPlan.yeuCauCanDat) {
        contextParts.push(`Yêu cầu cần đạt chính đã được xác định.`);
    }
    if (contextParts.length > 0) {
        context = `Bạn đang tiếp tục xây dựng một giáo án. Đây là bối cảnh của những gì đã được tạo ra cho đến nay:\n- ${contextParts.join('\n- ')}`;
    }
  }

  const basePrompt = getBasePrompt(input);
  let taskPrompt = '';
  let schema: any;
  let textPart;

  if (input.congVan === '5512') {
    switch(partToGenerate) {
        case 'initial':
            taskPrompt = "Bắt đầu bằng cách xác định các thông tin cơ bản (Tên bài dạy, Môn học, Lớp, Thời gian) và soạn thảo chi tiết mục 'I. MỤC TIÊU' (bao gồm Kiến thức, Năng lực, và Phẩm chất). Phải bao gồm trường 'congVan' là '5512'.";
            schema = {
                type: Type.OBJECT,
                properties: {
                    congVan: baseSchema5512Properties.congVan,
                    lessonTitle: baseSchema5512Properties.lessonTitle,
                    subject: baseSchema5512Properties.subject,
                    grade: baseSchema5512Properties.grade,
                    duration: baseSchema5512Properties.duration,
                    mucTieu: baseSchema5512Properties.mucTieu,
                }
            };
            break;
        case 'thietBi':
            taskPrompt = "Bây giờ, hãy soạn mục 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU'. Liệt kê tất cả các thiết bị, đồ dùng cần thiết cho cả giáo viên và học sinh.";
            schema = { type: Type.OBJECT, properties: { thietBi: baseSchema5512Properties.thietBi } };
            break;
        case 'giaoDucTichHop':
             taskPrompt = "Bây giờ, hãy xác định và soạn thảo các nội dung 'Giáo dục tích hợp' (Kỹ năng sống, Quốc phòng, Môi trường, Công dân số) phù hợp với bài học.";
             schema = { type: Type.OBJECT, properties: { giaoDucTichHop: baseSchema5512Properties.giaoDucTichHop } };
            break;
        case 'hoatDong1':
        case 'hoatDong2':
        case 'hoatDong3':
        case 'hoatDong4':
            const title = getActivityTitle5512(partToGenerate);
            taskPrompt = `Tiếp theo, hãy soạn thảo chi tiết cho '${title}'. Nội dung phải bao gồm: a) Mục tiêu, b) Nội dung, c) Sản phẩm, và d) Tổ chức thực hiện (trình bày dạng bảng). Sản phẩm dự kiến phải cụ thể, có thể đo lường được.`;
            schema = activitySchema5512;
            break;
        default: throw new Error(`Phần không xác định cho CV 5512: ${partToGenerate}`);
    }
  } else if (input.congVan === '1001') {
    switch(partToGenerate) {
        case 'initial':
            taskPrompt = "Bắt đầu bằng cách xác định các thông tin cơ bản (Tên bài dạy, Môn học, Lớp, Thời gian) và soạn thảo chi tiết mục 'I. YÊU CẦU CẦN ĐẠT' theo 4 mục: Năng lực chung, Năng lực đặc thù, Phẩm chất, và Nội dung tích hợp. Phải bao gồm trường 'congVan' là '1001'.";
            schema = {
                type: Type.OBJECT, properties: {
                    congVan: baseSchema1001Properties.congVan,
                    lessonTitle: baseSchema1001Properties.lessonTitle,
                    subject: baseSchema1001Properties.subject,
                    grade: baseSchema1001Properties.grade,
                    duration: baseSchema1001Properties.duration,
                    yeuCauCanDat: baseSchema1001Properties.yeuCauCanDat
                }
            };
            break;
        case 'doDungDayHoc':
            taskPrompt = "Bây giờ, soạn mục 'II. ĐỒ DÙNG DẠY HỌC', chia rõ cho 'Giáo viên' và 'Học sinh'.";
            schema = { type: Type.OBJECT, properties: { doDungDayHoc: baseSchema1001Properties.doDungDayHoc } };
            break;
        case 'hoatDongMoDau':
            taskPrompt = `Bây giờ, hãy soạn chi tiết cho "Hoạt động 1: Mở đầu".\n- Trong 'cachToChucGiaoVien', mô tả cách GV tổ chức hình thức dạy học (Kĩ thuật, PPDH, trò chơi) để tạo tình huống có vấn đề.\n- Trong 'hoatDongHocSinh', mô tả cách HS 'Kết nối giữa kiến thức cũ tạo ra tình huống có vấn đề để hình thành kiến thức mới' và nêu rõ 'Kết quả HS làm được (kiến thức, năng lực, phẩm chất)'.`;
            schema = activitySchema1001;
            break;
        case 'hoatDongHinhThanhKienThuc':
            taskPrompt = `Tiếp theo, soạn "Hoạt động 2: Hình thành kiến thức mới".\n- Trong 'cachToChucGiaoVien', mô tả cách GV tổ chức cho HS xử lí vấn đề học tập để chiếm lĩnh kiến thức mới.\n- Trong 'hoatDongHocSinh', mô tả cách HS thực hiện nhiệm vụ (trải nghiệm, khám phá, phân tích) và nêu rõ kết quả làm được.`;
            schema = activitySchema1001;
            break;
        case 'hoatDongLuyenTap':
            taskPrompt = `Soạn "Hoạt động 3: Luyện tập".\n- Trong 'cachToChucGiaoVien', mô tả cách GV giao nhiệm vụ và tổ chức cho HS luyện tập, thực hành.\n- Trong 'hoatDongHocSinh', mô tả cách HS thực hành, luyện tập và nêu rõ kết quả làm được.`;
            schema = activitySchema1001;
            break;
        case 'hoatDongVanDung':
            taskPrompt = `Soạn "Hoạt động 4: Vận dụng".\n- Trong 'cachToChucGiaoVien', mô tả cách GV giao tình huống thực tế để HS vận dụng.\n- Trong 'hoatDongHocSinh', mô tả cách HS vận dụng kiến thức giải quyết vấn đề và nêu rõ sản phẩm/kết quả.`;
            schema = activitySchema1001;
            break;
        case 'dieuChinhSauBaiDay':
            taskPrompt = "Cuối cùng, soạn mục 'IV. ĐIỀU CHỈNH SAU BÀI DẠY' (nếu có).";
            schema = { type: Type.OBJECT, properties: { dieuChinhSauBaiDay: baseSchema1001Properties.dieuChinhSauBaiDay } };
            break;
        default: throw new Error(`Phần không xác định cho CV 1001: ${partToGenerate}`);
    }
  } else { // CV 2345
     switch(partToGenerate) {
        case 'initial':
            taskPrompt = "Bắt đầu bằng cách xác định các thông tin cơ bản (Tên bài dạy, Môn học, Lớp, Thời gian) và soạn thảo chi tiết mục 'I. YÊU CẦU CẦN ĐẠT' (bao gồm Phẩm chất và Năng lực). Phải bao gồm trường 'congVan' là '2345'.";
            schema = {
                type: Type.OBJECT, properties: {
                    congVan: baseSchema2345Properties.congVan,
                    lessonTitle: baseSchema2345Properties.lessonTitle,
                    subject: baseSchema2345Properties.subject,
                    grade: baseSchema2345Properties.grade,
                    duration: baseSchema2345Properties.duration,
                    yeuCauCanDat: baseSchema2345Properties.yeuCauCanDat
                }
            };
            break;
        case 'doDungDayHoc':
            taskPrompt = "Bây giờ, soạn mục 'II. ĐỒ DÙNG DẠY HỌC'.";
            schema = { type: Type.OBJECT, properties: { doDungDayHoc: baseSchema2345Properties.doDungDayHoc } };
            break;
        case 'hoatDongMoDau':
            taskPrompt = "Bây giờ, hãy soạn chi tiết cho Hoạt động 1: Mở đầu/Khởi động. Hoạt động này nhằm mục đích tạo hứng thú và kết nối với bài học mới.";
            schema = activitySchema2345;
            break;
        case 'hoatDongHinhThanhKienThuc':
            taskPrompt = "Tiếp theo, soạn Hoạt động 2: Khám phá/Hình thành kiến thức mới. Đây là hoạt động trọng tâm giúp học sinh chiếm lĩnh kiến thức, kỹ năng cốt lõi của bài học.";
            schema = activitySchema2345;
            break;
        case 'hoatDongLuyenTap':
            taskPrompt = "Soạn Hoạt động 3: Luyện tập. Hoạt động này giúp học sinh củng cố, thực hành kiến thức và kỹ năng vừa học.";
            schema = activitySchema2345;
            break;
        case 'hoatDongVanDung':
            taskPrompt = "Soạn Hoạt động 4: Vận dụng/Mở rộng. Hoạt động này khuyến khích học sinh áp dụng kiến thức vào thực tế và tìm tòi thêm.";
            schema = activitySchema2345;
            break;
        case 'dieuChinhSauBaiDay':
            taskPrompt = "Cuối cùng, soạn mục 'IV. ĐIỀU CHỈNH SAU BÀI DẠY' (nếu có).";
            schema = { type: Type.OBJECT, properties: { dieuChinhSauBaiDay: baseSchema2345Properties.dieuChinhSauBaiDay } };
            break;
        default: throw new Error(`Phần không xác định cho CV 2345: ${partToGenerate}`);
    }
  }
  
  textPart = { text: `${basePrompt}\n\n${context}\n\n**NHIỆM VỤ HIỆN TẠI:**\n${taskPrompt}\n\n**QUAN TRỌNG:**\nChỉ trả về một đối tượng JSON duy nhất tuân thủ theo schema được cung cấp cho nhiệm vụ này.` };
  const contents = { parts: [textPart, ...fileParts] };

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        }
    });

    const responseText = response.text;
    
    if (!responseText) {
        throw new Error("Phản hồi từ AI trống.");
    }

    let jsonString = responseText.trim();
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = jsonString.match(jsonRegex);
    if (match && match[1]) {
      jsonString = match[1];
    }

    const parsedJson = JSON.parse(jsonString);

    if (input.congVan === '5512' && partToGenerate.startsWith('hoatDong')) {
        return { tienTrinh: { [partToGenerate]: parsedJson }};
    }
    
    if ((input.congVan === '2345' || input.congVan === '1001') && partToGenerate.startsWith('hoatDong')) {
        return { hoatDongDayHoc: [parsedJson] };
    }

    return parsedJson;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
     if (error instanceof Error) {
      // Bọc lỗi gốc để cung cấp thêm ngữ cảnh mà không làm mất thông tin.
      throw new Error(`Lỗi từ API Gemini: ${error.message}`);
    }
    throw new Error("Lỗi không xác định từ API Gemini.");
  }
}
