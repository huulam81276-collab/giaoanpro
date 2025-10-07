
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
    },
  },
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
    },
    giaoDucTichHop: {
      type: Type.OBJECT,
      properties: {
        kyNangSong: { type: Type.STRING },
        quocPhongAnNinh: { type: Type.STRING },
        baoVeMoiTruong: { type: Type.STRING },
        congDanSo: { type: Type.STRING },
      },
    },
    thietBi: { type: Type.STRING, description: 'Thiết bị dạy học và học liệu' },
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
    if (currentPlan.congVan === '2345' && currentPlan.yeuCauCanDat) {
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
            taskPrompt = "Bắt đầu bằng cách xác định các thông tin cơ bản (Tên bài dạy, Môn học, Lớp, Thời gian) và soạn thảo chi tiết mục 'I. MỤC TIÊU' (bao gồm Kiến thức, Năng lực, và Phẩm chất).";
            schema = {
                type: Type.OBJECT,
                properties: {
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
  } else { // CV 2345
     switch(partToGenerate) {
        case 'initial':
            taskPrompt = "Bắt đầu bằng cách xác định các thông tin cơ bản (Tên bài dạy, Môn học, Lớp, Thời gian) và soạn thảo chi tiết mục 'I. YÊU CẦU CẦN ĐẠT'.";
            schema = {
                type: Type.OBJECT, properties: {
                    lessonTitle: { type: Type.STRING }, subject: { type: Type.STRING },
                    grade: { type: Type.STRING }, duration: { type: Type.STRING },
                    yeuCauCanDat: { type: Type.STRING }
                }
            };
            break;
        case 'doDungDayHoc':
            taskPrompt = "Bây giờ, soạn mục 'II. ĐỒ DÙNG DẠY HỌC'.";
            schema = { type: Type.OBJECT, properties: { doDungDayHoc: { type: Type.STRING } } };
            break;
        case 'giaoDucTichHop':
            taskPrompt = "Bây giờ, hãy xác định và soạn thảo các nội dung 'Giáo dục tích hợp'.";
            schema = { type: Type.OBJECT, properties: { giaoDucTichHop: baseSchema5512Properties.giaoDucTichHop } };
            break;
        case 'hoatDongDayHoc':
            taskPrompt = "Bây giờ, soạn mục trọng tâm 'III. CÁC HOẠT ĐỘNG DẠY HỌC'. Trình bày dưới dạng một mảng các đối tượng, mỗi đối tượng có 3 cột: Hoạt động dạy học chủ yếu, Yêu cầu cần đạt, và Điều chỉnh.";
            schema = { type: Type.OBJECT, properties: {
                hoatDongDayHoc: { type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                        hoatDong: { type: Type.STRING },
                        yeuCau: { type: Type.STRING },
                        dieuChinh: { type: Type.STRING }
                    }
                }}
            }};
            break;
        case 'dieuChinhSauBaiDay':
            taskPrompt = "Cuối cùng, soạn mục 'IV. ĐIỀU CHỈNH SAU BÀI DẠY' (nếu có).";
            schema = { type: Type.OBJECT, properties: { dieuChinhSauBaiDay: { type: Type.STRING } } };
            break;
        default: throw new Error(`Phần không xác định cho CV 2345: ${partToGenerate}`);
    }
  }
  
  textPart = { text: `${basePrompt}\n\n${context}\n\n**NHIỆM VỤ HIỆN TẠI:**\n${taskPrompt}\n\n**QUAN TRỌNG:**\nChỉ trả về một đối tượng JSON duy nhất tuân thủ theo schema được cung cấp cho nhiệm vụ này.` };
  const contents = { parts: [textPart, ...fileParts] };

  try {
    const ai = new GoogleGenAI({ apiKey });

    const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        }
    });

    let fullResponseText = '';
    for await (const chunk of stream) {
        fullResponseText += chunk.text;
    }
    
    if (!fullResponseText) {
        throw new Error("Phản hồi từ AI trống.");
    }

    const parsedJson = JSON.parse(fullResponseText);

    // Wrap single activity responses in the correct structure for merging
    if (input.congVan === '5512' && partToGenerate.startsWith('hoatDong')) {
        return { tienTrinh: { [partToGenerate]: parsedJson }};
    }

    return parsedJson;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
     if (error instanceof Error) {
      throw new Error(`Lỗi từ API Gemini: ${error.message}`);
    }
    throw new Error("Lỗi không xác định từ API Gemini.");
  }
}
