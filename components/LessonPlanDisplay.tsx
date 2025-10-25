
import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { marked } from 'marked';
import type { GeneratedLessonPlan, LessonPlanInput, GeneratedLessonPlan5512, Activity2345, GiaoDucTichHop, GeneratedLessonPlan2345, GeneratedLessonPlan1001, Activity1001, GeneratedLessonPlan958 } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';


declare const htmlDocx: any;
declare const saveAs: any;
declare const katex: any;

interface LessonPlanDisplayProps {
  plan: GeneratedLessonPlan;
  basicInfo: LessonPlanInput;
  isLoading: boolean;
  isComplete: boolean;
  generationStatus: string | null;
}

const MarkdownRenderer: React.FC<{ content: string | undefined, className?: string }> = React.memo(({ content, className = '' }) => {
    if (!content) return null;
    return (
        <div className={className}>
            <ReactMarkdown
                components={{ p: React.Fragment, strong: ({node, ...props}) => <strong className="font-bold" {...props} /> }}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});

const IntegratedEducationSection: React.FC<{ data: GiaoDucTichHop | undefined }> = React.memo(({ data }) => {
    if (!data) return null;

    const topics = [
        { label: 'Kỹ năng sống', value: data.kyNangSong },
        { label: 'Quốc phòng – An ninh', value: data.quocPhongAnNinh },
        { label: 'Bảo vệ môi trường', value: data.baoVeMoiTruong },
        { label: 'Công dân số', value: data.congDanSo },
    ];
    
    const renderedTopics = topics.filter(t => t.value);

    if (renderedTopics.length === 0) return null;

    return (
        <div className="mt-4">
            <p className="font-bold text-slate-800">Giáo dục tích hợp:</p>
            <div className="space-y-1 mt-2 pl-4">
                {renderedTopics.map(topic => (
                    <div key={topic.label}>
                        <strong>- {topic.label}:</strong> <MarkdownRenderer content={topic.value} />
                    </div>
                ))}
            </div>
        </div>
    );
});


// --- Start: CV 5512 specific components ---
const getActivityTitle5512 = (key: string) => {
    const activityNumber = parseInt(key.replace('hoatDong', ''), 10);
    switch (activityNumber) {
        case 1: return "Hoạt động 1: Mở đầu (Xác định vấn đề/nhiệm vụ học tập)";
        case 2: return "Hoạt động 2: Hình thành kiến thức mới";
        case 3: return "Hoạt động 3: Luyện tập";
        case 4: return "Hoạt động 4: Vận dụng";
        default: return `Hoạt động ${activityNumber}`;
    }
};

const ActivitySection5512: React.FC<{ title: string; activity: GeneratedLessonPlan5512['tienTrinh'][string] }> = React.memo(({ title, activity }) => {
    if (!activity) return null;
    return (
        <div className="mt-6 break-inside-avoid">
            <h4 className="text-lg font-bold text-slate-800 border-b-2 border-sky-500/30 pb-2 mb-3">{title}</h4>
            <div className="space-y-3 pl-4 text-sm text-slate-700">
                {activity.mucTieu && <div><strong>a) Mục tiêu:</strong> <MarkdownRenderer content={activity.mucTieu} /></div>}
                {activity.noiDung && <div><strong>b) Nội dung:</strong> <MarkdownRenderer content={activity.noiDung} className="prose prose-sm max-w-none"/></div>}
                {activity.sanPham && <div><strong>c) Sản phẩm:</strong> <MarkdownRenderer content={activity.sanPham} className="prose prose-sm max-w-none"/></div>}
                {activity.toChuc && <p className="font-semibold mt-2">d) Tổ chức thực hiện:</p>}
                
                {activity.toChuc && <div className="border border-gray-200 rounded-lg overflow-hidden mt-2 shadow-sm ring-1 ring-black/5">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-slate-100/80 text-left">
                            <tr>
                                <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">HOẠT ĐỘNG CỦA GV VÀ HS</th>
                                <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">SẢN PHẨM DỰ KIẾN</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr className="align-top">
                                <td className="p-3 border-r border-gray-200">
                                    <MarkdownRenderer content={activity.toChuc.noiDung} className="prose prose-sm max-w-none" />
                                </td>
                                <td className="p-3">
                                     <MarkdownRenderer content={activity.toChuc.sanPham} className="prose prose-sm max-w-none"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>}
            </div>
        </div>
    );
});
// --- End: CV 5512 specific components ---

// --- Start: CV 958 specific components ---
const ActivitySection958: React.FC<{ title: string; activity: GeneratedLessonPlan958['tienTrinh'][string] }> = React.memo(({ title, activity }) => {
    if (!activity) return null;
    return (
        <div className="mt-6 break-inside-avoid">
            <h4 className="text-lg font-bold text-slate-800 border-b-2 border-sky-500/30 pb-2 mb-3">{title}</h4>
            <div className="space-y-3 pl-4 text-sm text-slate-700">
                {activity.mucTieu && <div><strong>a) Mục tiêu:</strong> <MarkdownRenderer content={activity.mucTieu} /></div>}
                {activity.noiDung && <div><strong>b) Nội dung:</strong> <MarkdownRenderer content={activity.noiDung} className="prose prose-sm max-w-none"/></div>}
                {activity.sanPham && <div><strong>c) Sản phẩm:</strong> <MarkdownRenderer content={activity.sanPham} className="prose prose-sm max-w-none"/></div>}
                {activity.toChucThucHien && <div><strong>d) Tổ chức thực hiện:</strong> <MarkdownRenderer content={activity.toChucThucHien} className="prose prose-sm max-w-none"/></div>}
            </div>
        </div>
    );
});
// --- End: CV 958 specific components ---

const LessonPlanDisplayComponent: React.FC<LessonPlanDisplayProps> = ({ plan, basicInfo, isLoading, isComplete, generationStatus }) => {
    const [copied, setCopied] = useState(false);
    
    const displayDuration = plan.duration || (basicInfo.duration.periods ? `${basicInfo.duration.periods} tiết` : '(AI đề xuất)');
    const displaySubject = basicInfo.subject || plan.subject;
    const displayGrade = basicInfo.grade || plan.grade;

    const mdToHtml = (md: string | undefined) => {
        if (!md) return '';
        let processedMd = md;
        
        if (typeof katex !== 'undefined') {
            processedMd = processedMd.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
                try {
                    return katex.renderToString(formula, { displayMode: true, throwOnError: false });
                } catch (e) { return match; }
            });
            processedMd = processedMd.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (match, formula) => {
                 try {
                    return katex.renderToString(formula, { displayMode: false, throwOnError: false });
                } catch (e) { return match; }
            });
        }
        return marked.parse(processedMd, { breaks: true, gfm: true });
    };

    const generatePlainText = useCallback(() => {
        const lessonTitle = basicInfo.lessonTitle || plan.lessonTitle || '(Chưa có tên)';
        let sections: string[] = [];

        const formatGiaoDucTichHop = (gdtg: GiaoDucTichHop | undefined) => {
            if (!gdtg) return '';
            const parts = [
                gdtg.kyNangSong ? `- Kỹ năng sống: ${gdtg.kyNangSong}` : '',
                gdtg.quocPhongAnNinh ? `- Quốc phòng – An ninh: ${gdtg.quocPhongAnNinh}` : '',
                gdtg.baoVeMoiTruong ? `- Bảo vệ môi trường: ${gdtg.baoVeMoiTruong}` : '',
                gdtg.congDanSo ? `- Công dân số: ${gdtg.congDanSo}` : '',
            ].filter(Boolean);
            
            if (parts.length === 0) return '';
            return 'Giáo dục tích hợp:\n' + parts.join('\n');
        };

        if (plan.congVan === '2345') {
            const formatActivity = (activity: Activity2345) => 
                `HOẠT ĐỘNG DẠY HỌC CHỦ YẾU:\n${activity.hoatDong || ''}\n\nYÊU CẦU CẦN ĐẠT:\n${activity.yeuCau || ''}\n\nĐIỀU CHỈNH:\n${activity.dieuChinh || ''}`;
            
            const formatYeuCauCanDat = (yc: GeneratedLessonPlan2345['yeuCauCanDat'] | undefined) => {
                if (!yc) return '';
                const parts = [
                    yc.phamChat ? `Về phẩm chất: ${yc.phamChat}` : '',
                    yc.nangLuc ? `Về năng lực: ${yc.nangLuc}` : '',
                ].filter(Boolean);
                if (parts.length === 0) return '';
                return 'I. YÊU CẦU CẦN ĐẠT\n' + parts.join('\n');
            }

            sections = [
                `KẾ HOẠCH BÀI DẠY (GIÁO ÁN - CÔNG VĂN 2345)`,
                `Môn học/Hoạt động giáo dục: ${displaySubject}`,
                `Lớp: ${displayGrade}`,
                `Tên bài dạy: ${lessonTitle}`,
                `Thời gian thực hiện: ${displayDuration}\n`,
                formatYeuCauCanDat(plan.yeuCauCanDat),
                `\nII. ĐỒ DÙNG DẠY HỌC\n${plan.doDungDayHoc || ''}\n`,
                `III. CÁC HOẠT ĐỘNG DẠY HỌC\n` + (plan.hoatDongDayHoc || []).map(formatActivity).join('\n\n---\n\n'),
                plan.dieuChinhSauBaiDay ? `\nIV. ĐIỀU CHỈNH SAU BÀI DẠY\n${plan.dieuChinhSauBaiDay}` : ''
            ];
        } else if (plan.congVan === '1001') {
            const formatYeuCauCanDat = (yc: GeneratedLessonPlan1001['yeuCauCanDat'] | undefined) => {
                if (!yc) return '';
                const parts = [
                    yc.nangLucChung ? `1. Năng lực chung: ${yc.nangLucChung}` : '',
                    yc.nangLucDacThu ? `2. Năng lực đặc thù: ${yc.nangLucDacThu}` : '',
                    yc.phamChat ? `3. Phẩm chất: ${yc.phamChat}` : '',
                    yc.noiDungTichHop ? `4. Nội dung tích hợp: ${yc.noiDungTichHop}` : '',
                ].filter(Boolean);
                if (parts.length === 0) return '';
                return 'I. YÊU CẦU CẦN ĐẠT\n' + parts.join('\n');
            }
             const formatDoDung = (dd: GeneratedLessonPlan1001['doDungDayHoc'] | undefined) => {
                if (!dd) return '';
                 const parts = [
                    dd.giaoVien ? `1. Giáo viên: ${dd.giaoVien}` : '',
                    dd.hocSinh ? `2. Học sinh: ${dd.hocSinh}` : '',
                 ].filter(Boolean);
                 if (parts.length === 0) return '';
                 return 'II. ĐỒ DÙNG DẠY HỌC\n' + parts.join('\n');
            }
            const formatActivities = (activities: Activity1001[] | undefined) => {
                if (!activities || activities.length === 0) return '';
                return activities.map(act => 
                    `${act.tenHoatDong}\n` +
                    `a) Mục tiêu: ${act.mucTieu}\n\n` +
                    `b) Cách tổ chức dạy học:\n`+
                    `-- Hoạt động của Giáo viên --\n${act.cachToChucGiaoVien}\n\n` +
                    `-- Hoạt động của Học sinh --\n${act.hoatDongHocSinh}`
                ).join('\n\n---\n\n');
            }

            sections = [
                `KẾ HOẠCH BÀI DẠY (GIÁO ÁN - CÔNG VĂN 1001)`,
                `Môn học/Hoạt động giáo dục: ${displaySubject}`,
                `Lớp: ${displayGrade}`,
                `Tên bài dạy: ${lessonTitle}`,
                `Thời gian thực hiện: ${displayDuration}\n`,
                formatYeuCauCanDat(plan.yeuCauCanDat),
                `\n${formatDoDung(plan.doDungDayHoc)}\n`,
                `III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU\n` + formatActivities(plan.hoatDongDayHoc),
                plan.dieuChinhSauBaiDay ? `\nIV. ĐIỀU CHỈNH SAU BÀI DẠY\n${plan.dieuChinhSauBaiDay}` : ''
            ];
        } else if (plan.congVan === '958') {
            const formatActivity = (title: string, activity: any) => [
                title,
                `a) Mục tiêu: ${activity?.mucTieu || ''}`,
                `b) Nội dung: ${activity?.noiDung || ''}`,
                `c) Sản phẩm: ${activity?.sanPham || ''}`,
                `d) Tổ chức thực hiện: ${activity?.toChucThucHien || ''}`,
            ].join('\n');
            
            const activityKeys = plan.tienTrinh ? Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))) : [];
            const activityText = activityKeys.map((key) => formatActivity(getActivityTitle5512(key), plan.tienTrinh?.[key])).join('\n\n');

            sections = [
                `KẾ HOẠCH BÀI DẠY (GIÁO ÁN - CÔNG VĂN 958)`,
                `Môn học/Hoạt động giáo dục: ${displaySubject}`,
                `Lớp: ${displayGrade}`,
                `Tên bài dạy: ${lessonTitle}`,
                `Thời gian thực hiện: ${displayDuration}`,
                `Giáo viên: ${basicInfo.teacherName}\n`,
                `I. MỤC TIÊU`,
                `1. Về kiến thức: ${plan.mucTieu?.kienThuc || ''}`,
                `2. Về năng lực: ${plan.mucTieu?.nangLuc || ''}`,
                `3. Về phẩm chất: ${plan.mucTieu?.phamChat || ''}`,
                `\nII. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU`,
                `${plan.thietBi || ''}\n`,
                `III. TIẾN TRÌNH DẠY HỌC`,
                activityText,
            ];
        } else { // 5512
            const formatActivity = (title: string, activity: GeneratedLessonPlan5512['tienTrinh'][string]) => [
                title,
                `a) Mục tiêu: ${activity?.mucTieu || ''}`,
                `b) Nội dung: ${activity?.noiDung || ''}`,
                `c) Sản phẩm: ${activity?.sanPham || ''}`,
                `d) Tổ chức thực hiện:`,
                `  - HOẠT ĐỘNG CỦA GV VÀ HS: ${activity?.toChuc?.noiDung || ''}`,
                `  - SẢN PHẨM DỰ KIẾN: ${activity?.toChuc?.sanPham || ''}`,
            ].join('\n');
            
            const activityKeys = plan.tienTrinh ? Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))) : [];
            const activityText = activityKeys.map((key) => formatActivity(getActivityTitle5512(key), plan.tienTrinh?.[key])).join('\n\n');

            sections = [
                `KẾ HOẠCH BÀI DẠY (GIÁO ÁN - CÔNG VĂN 5512)`,
                `Môn học/Hoạt động giáo dục: ${displaySubject}`,
                `Lớp: ${displayGrade}`,
                `Tên bài dạy: ${lessonTitle}`,
                `Thời gian thực hiện: ${displayDuration}`,
                `Giáo viên: ${basicInfo.teacherName}\n`,
                `I. MỤC TIÊU`,
                `1. Về kiến thức: ${plan.mucTieu?.kienThuc || ''}`,
                `2. Về năng lực: ${plan.mucTieu?.nangLuc || ''}`,
                `3. Về phẩm chất: ${plan.mucTieu?.phamChat || ''}`,
                formatGiaoDucTichHop(plan.giaoDucTichHop),
                `\nII. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU`,
                `${plan.thietBi || ''}\n`,
                `III. TIẾN TRÌNH DẠY HỌC`,
                activityText,
            ];
        }
        return sections.filter(Boolean).join('\n');
    }, [plan, basicInfo, displayDuration, displaySubject, displayGrade]);


    const handleCopy = () => {
        const textToCopy = generatePlainText();
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const generateHtmlForDoc = useCallback(() => {
        const styles = `
          body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; }
          h3, h4 { font-weight: bold; font-family: 'Times New Roman', Times, serif; }
          h3 { font-size: 14pt; margin-top: 20px; }
          h4 { font-size: 13pt; margin-top: 15px; }
          p, div { margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; page-break-inside: avoid; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #f2f2f2; font-weight: bold; }
          ul, ol { padding-left: 40px; margin: 0; }
          pre, code { font-family: 'Times New Roman', Times, serif; }
          .katex { font-size: 1em !important; }
        `;
        
        const lessonTitle = basicInfo.lessonTitle || plan.lessonTitle || 'Untitled';
        let mainContent = '';
        
        const formatGiaoDucTichHopHtml = (gdtg: GiaoDucTichHop | undefined) => {
            if (!gdtg) return '';
            const parts = [
                gdtg.kyNangSong ? `<li><strong>Kỹ năng sống:</strong> ${mdToHtml(gdtg.kyNangSong)}</li>` : '',
                gdtg.quocPhongAnNinh ? `<li><strong>Quốc phòng – An ninh:</strong> ${mdToHtml(gdtg.quocPhongAnNinh)}</li>` : '',
                gdtg.baoVeMoiTruong ? `<li><strong>Bảo vệ môi trường:</strong> ${mdToHtml(gdtg.baoVeMoiTruong)}</li>` : '',
                gdtg.congDanSo ? `<li><strong>Công dân số:</strong> ${mdToHtml(gdtg.congDanSo)}</li>` : '',
            ].filter(Boolean);

            if (parts.length === 0) return '';
            return `<p><strong>Giáo dục tích hợp:</strong></p><ul>${parts.join('')}</ul>`;
        };


        if (plan.congVan === '2345') {
            const formatYeuCauCanDatHtml = (yc: GeneratedLessonPlan2345['yeuCauCanDat'] | undefined) => {
                if (!yc) return '';
                const phamChatHtml = yc.phamChat ? `<p><strong>Về phẩm chất:</strong> ${mdToHtml(yc.phamChat)}</p>` : '';
                const nangLucHtml = yc.nangLuc ? `<p><strong>Về năng lực:</strong> ${mdToHtml(yc.nangLuc)}</p>` : '';
                if (!phamChatHtml && !nangLucHtml) return '';
                return `<h3>I. YÊU CẦU CẦN ĐẠT</h3>${phamChatHtml}${nangLucHtml}`;
            }

             const activitiesHtml = (plan.hoatDongDayHoc || []).map(act => `
                <tr style="page-break-inside: avoid;">
                    <td>${mdToHtml(act.hoatDong)}</td>
                    <td>${mdToHtml(act.yeuCau)}</td>
                    <td>${mdToHtml(act.dieuChinh)}</td>
                </tr>
            `).join('');

            mainContent = `
                ${formatYeuCauCanDatHtml(plan.yeuCauCanDat)}
                ${plan.doDungDayHoc ? `<h3>II. ĐỒ DÙNG DẠY HỌC</h3><div>${mdToHtml(plan.doDungDayHoc)}</div>` : ''}
                ${plan.hoatDongDayHoc?.length > 0 ? `<h3>III. CÁC HOẠT ĐỘNG DẠY HỌC</h3>
                <table>
                    <thead><tr><th>Hoạt động dạy học chủ yếu</th><th>Yêu cầu cần đạt</th><th>Điều chỉnh</th></tr></thead>
                    <tbody>${activitiesHtml}</tbody>
                </table>` : ''}
                ${plan.dieuChinhSauBaiDay ? `<h3>IV. ĐIỀU CHỈNH SAU BÀI DẠY</h3><div>${mdToHtml(plan.dieuChinhSauBaiDay)}</div>` : ''}
            `;
        } else if (plan.congVan === '1001') {
            const formatYeuCauCanDatHtml = (yc: GeneratedLessonPlan1001['yeuCauCanDat'] | undefined) => {
                if (!yc) return '';
                const parts = [
                    yc.nangLucChung ? `<p><strong>1. Năng lực chung:</strong> ${mdToHtml(yc.nangLucChung)}</p>` : '',
                    yc.nangLucDacThu ? `<p><strong>2. Năng lực đặc thù:</strong> ${mdToHtml(yc.nangLucDacThu)}</p>` : '',
                    yc.phamChat ? `<p><strong>3. Phẩm chất:</strong> ${mdToHtml(yc.phamChat)}</p>` : '',
                    yc.noiDungTichHop ? `<p><strong>4. Nội dung tích hợp:</strong> ${mdToHtml(yc.noiDungTichHop)}</p>` : '',
                ].filter(Boolean);
                if (parts.length === 0) return '';
                return `<h3>I. YÊU CẦU CẦN ĐẠT</h3>${parts.join('')}`;
            }
            const formatDoDungHtml = (dd: GeneratedLessonPlan1001['doDungDayHoc'] | undefined) => {
                if (!dd) return '';
                 const parts = [
                    dd.giaoVien ? `<p><strong>1. Giáo viên:</strong> ${mdToHtml(dd.giaoVien)}</p>` : '',
                    dd.hocSinh ? `<p><strong>2. Học sinh:</strong> ${mdToHtml(dd.hocSinh)}</p>` : '',
                 ].filter(Boolean);
                 if (parts.length === 0) return '';
                 return `<h3>II. ĐỒ DÙNG DẠY HỌC</h3>${parts.join('')}`;
            }
            const activitiesHtml = (plan.hoatDongDayHoc || []).map(act => `
                <tr style="page-break-inside: avoid;">
                    <td>
                        <p><strong>${act.tenHoatDong}:</strong></p>
                        <p><strong>a) Mục tiêu:</strong> ${mdToHtml(act.mucTieu)}</p>
                    </td>
                    <td></td>
                </tr>
                 <tr style="page-break-inside: avoid;">
                    <td>
                        <p><strong>b) Cách tổ chức dạy học:</strong></p>
                        ${mdToHtml(act.cachToChucGiaoVien)}
                    </td>
                    <td>${mdToHtml(act.hoatDongHocSinh)}</td>
                </tr>
            `).join('');

             mainContent = `
                ${formatYeuCauCanDatHtml(plan.yeuCauCanDat)}
                ${formatDoDungHtml(plan.doDungDayHoc)}
                ${plan.hoatDongDayHoc?.length > 0 ? `<h3>III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</h3>
                <table>
                    <thead><tr><th>Hoạt động của Giáo viên</th><th>Hoạt động của Học sinh</th></tr></thead>
                    <tbody>${activitiesHtml}</tbody>
                </table>` : ''}
                ${plan.dieuChinhSauBaiDay ? `<h3>IV. ĐIỀU CHỈNH SAU BÀI DẠY</h3><div>${mdToHtml(plan.dieuChinhSauBaiDay)}</div>` : ''}
            `;
        } else if (plan.congVan === '958') {
            const formatActivityHtml = (title: string, activity: any) => activity ? `
                <h4>${title}</h4>
                <div><strong>a) Mục tiêu:</strong> ${mdToHtml(activity.mucTieu)}</div>
                <div><strong>b) Nội dung:</strong> ${mdToHtml(activity.noiDung)}</div>
                <div><strong>c) Sản phẩm:</strong> ${mdToHtml(activity.sanPham)}</div>
                <div><strong>d) Tổ chức thực hiện:</strong> ${mdToHtml(activity.toChucThucHien)}</div>
            ` : '';
            
            const activityKeys = plan.tienTrinh ? Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))) : [];
            const activitiesHtml = activityKeys.map((key) => formatActivityHtml(getActivityTitle5512(key), plan.tienTrinh?.[key])).join('');
            
            mainContent = `
                ${plan.mucTieu ? `<h3>I. MỤC TIÊU</h3>
                <div><strong>1. Về kiến thức:</strong> ${mdToHtml(plan.mucTieu?.kienThuc)}</div>
                <div><strong>2. Về năng lực:</strong> ${mdToHtml(plan.mucTieu?.nangLuc)}</div>
                <div><strong>3. Về phẩm chất:</strong> ${mdToHtml(plan.mucTieu?.phamChat)}</div>` : ''}
                ${plan.thietBi ? `<h3>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3><div>${mdToHtml(plan.thietBi)}</div>` : ''}
                ${activitiesHtml ? `<h3>III. TIẾN TRÌNH DẠY HỌC</h3>${activitiesHtml}` : ''}
            `;
        } else { // 5512
            const formatActivityHtml = (title: string, activity: any) => activity ? `
                <h4>${title}</h4>
                <div><strong>a) Mục tiêu:</strong> ${mdToHtml(activity.mucTieu)}</div>
                <div><strong>b) Nội dung:</strong> ${mdToHtml(activity.noiDung)}</div>
                <div><strong>c) Sản phẩm:</strong> ${mdToHtml(activity.sanPham)}</div>
                <p><strong>d) Tổ chức thực hiện:</strong></p>
                <table>
                    <thead><tr><th>HOẠT ĐỘNG CỦA GV VÀ HS</th><th>SẢN PHẨM DỰ KIẾN</th></tr></thead>
                    <tbody><tr><td>${mdToHtml(activity.toChuc?.noiDung)}</td><td>${mdToHtml(activity.toChuc?.sanPham)}</td></tr></tbody>
                </table>
            ` : '';
            
            const activityKeys = plan.tienTrinh ? Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))) : [];
            const activitiesHtml = activityKeys.map((key) => formatActivityHtml(getActivityTitle5512(key), plan.tienTrinh?.[key])).join('');
            
            mainContent = `
                ${plan.mucTieu ? `<h3>I. MỤC TIÊU</h3>
                <div><strong>1. Về kiến thức:</strong> ${mdToHtml(plan.mucTieu?.kienThuc)}</div>
                <div><strong>2. Về năng lực:</strong> ${mdToHtml(plan.mucTieu?.nangLuc)}</div>
                <div><strong>3. Về phẩm chất:</strong> ${mdToHtml(plan.mucTieu?.phamChat)}</div>` : ''}
                ${formatGiaoDucTichHopHtml(plan.giaoDucTichHop)}
                ${plan.thietBi ? `<h3>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3><div>${mdToHtml(plan.thietBi)}</div>` : ''}
                ${activitiesHtml ? `<h3>III. TIẾN TRÌNH DẠY HỌC</h3>${activitiesHtml}` : ''}
            `;
        }

        return `
            <!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>${`GiaoAn_${lessonTitle}`}</title><style>${styles}</style></head>
            <body>
                <div style="text-align: center;">
                    <h3>KẾ HOẠCH BÀI DẠY</h3>
                    <p><strong>Môn học:</strong> ${displaySubject} - <strong>Lớp:</strong> ${displayGrade}</p>
                    <p><strong>Tên bài dạy:</strong> ${lessonTitle}</p>
                    <p><strong>Thời gian thực hiện:</strong> ${displayDuration}</p>
                </div>
                ${mainContent}
            </body></html>
        `;
    }, [plan, basicInfo, displayDuration, displaySubject, displayGrade]);

    const handleDownload = () => {
        if (typeof htmlDocx === 'undefined' || typeof saveAs === 'undefined') {
            alert("Chức năng tải về chưa sẵn sàng, vui lòng thử lại sau giây lát.");
            return;
        }
        const htmlContent = generateHtmlForDoc();
        const lessonTitle = basicInfo.lessonTitle || plan.lessonTitle || 'Untitled';
        const fileName = `GiaoAn_${lessonTitle.replace(/ /g, '_')}.doc`;
        saveAs(htmlDocx.asBlob(htmlContent), fileName);
    };

    if (!plan) return null;

    return (
        <article className="prose max-w-none relative text-slate-700">
            <div className="absolute top-0 right-0 flex items-center -mt-2 space-x-1">
                <button onClick={handleDownload} disabled={isLoading || !isComplete} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-200/50 rounded-full transition-colors disabled:text-slate-400 disabled:cursor-not-allowed" title="Tải về file .doc"><DownloadIcon className="w-5 h-5" /></button>
                <button onClick={handleCopy} disabled={isLoading || !isComplete} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-200/50 rounded-full transition-colors disabled:text-slate-400 disabled:cursor-not-allowed" title="Sao chép toàn bộ">{copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5" />}</button>
            </div>
            
            <div className="text-center mb-8 not-prose">
                <h3 className="text-xl font-bold uppercase text-slate-900">KẾ HOẠCH BÀI DẠY</h3>
                <p className="font-semibold text-slate-700">Môn học: {displaySubject} - Lớp: {displayGrade}</p>
                <p className="text-lg font-bold mt-2 text-sky-600">Bài: {basicInfo.lessonTitle || plan.lessonTitle}</p>
                <p className="text-sm text-slate-500">Thời gian thực hiện: {displayDuration}</p>
            </div>

            {plan.congVan === '2345' ? (
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.yeuCauCanDat && (plan.yeuCauCanDat.phamChat || plan.yeuCauCanDat.nangLuc) && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. YÊU CẦU CẦN ĐẠT</h3>
                        {plan.yeuCauCanDat.phamChat && (
                            <div className="mt-2">
                                <strong className="text-slate-800">Về phẩm chất:</strong>
                                <MarkdownRenderer content={plan.yeuCauCanDat.phamChat} className="prose prose-sm max-w-none mt-1" />
                            </div>
                        )}
                        {plan.yeuCauCanDat.nangLuc && (
                            <div className="mt-3">
                                <strong className="text-slate-800">Về năng lực:</strong>
                                <MarkdownRenderer content={plan.yeuCauCanDat.nangLuc} className="prose prose-sm max-w-none mt-1" />
                            </div>
                        )}
                    </>}
                    
                    {plan.doDungDayHoc && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. ĐỒ DÙNG DẠY HỌC</h3>
                        <MarkdownRenderer content={plan.doDungDayHoc} className="prose prose-sm max-w-none" />
                    </>}
                    
                    {plan.hoatDongDayHoc && plan.hoatDongDayHoc.length > 0 && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. CÁC HOẠT ĐỘNG DẠY HỌC</h3>
                        <div className="not-prose mt-4 ring-1 ring-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-100/80 text-left">
                                    <tr>
                                        <th className="p-3 font-semibold text-slate-700 w-5/12 border-b border-gray-300">Hoạt động dạy học chủ yếu</th>
                                        <th className="p-3 font-semibold text-slate-700 w-5/12 border-b border-gray-300">Yêu cầu cần đạt</th>
                                        <th className="p-3 font-semibold text-slate-700 w-2/12 border-b border-gray-300">Điều chỉnh</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {plan.hoatDongDayHoc.map((act, index) => (
                                        <tr key={index} className="align-top border-t border-gray-200">
                                            <td className="p-3"><MarkdownRenderer content={act.hoatDong} className="prose prose-sm max-w-none" /></td>
                                            <td className="p-3"><MarkdownRenderer content={act.yeuCau} className="prose prose-sm max-w-none" /></td>
                                            <td className="p-3"><MarkdownRenderer content={act.dieuChinh} className="prose prose-sm max-w-none" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>}

                     {plan.dieuChinhSauBaiDay && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)</h3>
                        <MarkdownRenderer content={plan.dieuChinhSauBaiDay} className="prose prose-sm max-w-none" />
                    </>}
                </div>
            ) : plan.congVan === '1001' ? (
                 <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.yeuCauCanDat && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. YÊU CẦU CẦN ĐẠT</h3>
                        {plan.yeuCauCanDat.nangLucChung && <div className="mt-2"><strong>1. Năng lực chung:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.nangLucChung} /></div>}
                        {plan.yeuCauCanDat.nangLucDacThu && <div className="mt-2"><strong>2. Năng lực đặc thù:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.nangLucDacThu} /></div>}
                        {plan.yeuCauCanDat.phamChat && <div className="mt-2"><strong>3. Phẩm chất:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.phamChat} /></div>}
                        {plan.yeuCauCanDat.noiDungTichHop && <div className="mt-2"><strong>4. Nội dung tích hợp:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.noiDungTichHop} /></div>}
                    </>}

                    {plan.doDungDayHoc && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. ĐỒ DÙNG DẠY HỌC</h3>
                        {plan.doDungDayHoc.giaoVien && <div className="mt-2"><strong>1. Giáo viên:</strong> <MarkdownRenderer content={plan.doDungDayHoc.giaoVien} /></div>}
                        {plan.doDungDayHoc.hocSinh && <div className="mt-2"><strong>2. Học sinh:</strong> <MarkdownRenderer content={plan.doDungDayHoc.hocSinh} /></div>}
                    </>}
                    
                    {plan.hoatDongDayHoc && plan.hoatDongDayHoc.length > 0 && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</h3>
                        <div className="not-prose mt-4 ring-1 ring-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-100/80 text-left">
                                    <tr>
                                        <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">Hoạt động của Giáo viên</th>
                                        <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">Hoạt động của Học sinh</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {plan.hoatDongDayHoc.map((act, index) => (
                                       <React.Fragment key={index}>
                                            <tr className={`align-top ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                                                <td className="p-3">
                                                    <p className="font-bold text-slate-800">{act.tenHoatDong}:</p>
                                                    <p className="mt-2"><strong>a) Mục tiêu:</strong> <MarkdownRenderer content={act.mucTieu} /></p>
                                                </td>
                                                <td></td>
                                            </tr>
                                            <tr className="align-top">
                                                <td className="p-3">
                                                    <p><strong>b) Cách tổ chức dạy học:</strong></p>
                                                    <MarkdownRenderer content={act.cachToChucGiaoVien} className="prose prose-sm max-w-none" />
                                                </td>
                                                <td className="p-3">
                                                    <MarkdownRenderer content={act.hoatDongHocSinh} className="prose prose-sm max-w-none" />
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>}

                     {plan.dieuChinhSauBaiDay && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">IV. ĐIỀU CHỈNH SAU BÀI DẠY</h3>
                        <MarkdownRenderer content={plan.dieuChinhSauBaiDay} className="prose prose-sm max-w-none" />
                    </>}
                </div>
            ) : plan.congVan === '958' ? (
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.mucTieu && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. MỤC TIÊU</h3>
                        <div><strong>1. Về kiến thức:</strong> <MarkdownRenderer content={plan.mucTieu.kienThuc} /></div>
                        <div><strong>2. Về năng lực:</strong> <MarkdownRenderer content={plan.mucTieu.nangLuc} /></div>
                        <div><strong>3. Về phẩm chất:</strong> <MarkdownRenderer content={plan.mucTieu.phamChat} /></div>
                    </>}
                    
                    {plan.thietBi && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
                        <div className="prose prose-sm max-w-none"><MarkdownRenderer content={plan.thietBi} /></div>
                    </>}
                    
                    {plan.tienTrinh && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. TIẾN TRÌNH DẠY HỌC</h3>
                        {Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))).map((key) => (
                            <ActivitySection958
                                key={key} 
                                title={getActivityTitle5512(key)} 
                                activity={plan.tienTrinh?.[key]} 
                            />
                        ))}
                    </>}
                </div>
            ) : ( // 5512 layout
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.mucTieu && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. MỤC TIÊU</h3>
                        <div><strong>1. Về kiến thức:</strong> <MarkdownRenderer content={plan.mucTieu.kienThuc} /></div>
                        <div><strong>2. Về năng lực:</strong> <MarkdownRenderer content={plan.mucTieu.nangLuc} /></div>
                        <div><strong>3. Về phẩm chất:</strong> <MarkdownRenderer content={plan.mucTieu.phamChat} /></div>
                        <IntegratedEducationSection data={plan.giaoDucTichHop} />
                    </>}
                    
                    {plan.thietBi && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
                        <div className="prose prose-sm max-w-none"><MarkdownRenderer content={plan.thietBi} /></div>
                    </>}
                    
                    {plan.tienTrinh && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. TIẾN TRÌNH DẠY HỌC</h3>
                        {Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))).map((key) => (
                            <ActivitySection5512
                                key={key} 
                                title={getActivityTitle5512(key)} 
                                activity={plan.tienTrinh?.[key]} 
                            />
                        ))}
                    </>}
                </div>
            )}

            <div className="mt-8 text-center not-prose">
                {generationStatus && (
                    <div className="inline-flex animate-pulse items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-md text-slate-600 bg-slate-200/50">
                        <LoadingSpinner className="w-5 h-5"/>
                        <span>{generationStatus}</span>
                    </div>
                )}
                {isComplete && !isLoading && (
                     <div className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-md text-green-700 bg-green-100/80 ring-1 ring-green-600/20">
                        <CheckIcon className="w-6 h-6"/>
                        <span>Giáo án đã hoàn tất!</span>
                     </div>
                )}
            </div>
        </article>
    );
};

export const LessonPlanDisplay = React.memo(LessonPlanDisplayComponent);
