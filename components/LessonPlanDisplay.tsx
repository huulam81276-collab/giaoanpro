
import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { marked } from 'marked';
import type { GeneratedLessonPlan, LessonPlanInput, GeneratedLessonPlan5512, Activity2345, GiaoDucTichHop, GeneratedLessonPlan2345, GeneratedLessonPlan1001, Activity1001, GeneratedLessonPlan958, Language } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { translations } from '../utils/locales';

declare const htmlDocx: any;
declare const saveAs: any;
declare const katex: any;

interface LessonPlanDisplayProps {
  plan: GeneratedLessonPlan;
  basicInfo: LessonPlanInput;
  isLoading: boolean;
  isComplete: boolean;
  generationStatus: string | null;
  lang: Language;
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

const IntegratedEducationSection: React.FC<{ data: GiaoDucTichHop | undefined, t: any }> = React.memo(({ data, t }) => {
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
            <p className="font-bold text-slate-800">{t.integratedEdu}:</p>
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
const getActivityTitle5512 = (key: string, lang: Language) => {
    const activityNumber = parseInt(key.replace('hoatDong', ''), 10);
    const prefix = lang === 'vi' ? "Hoạt động" : "Activity";
    if (lang === 'vi') {
        switch (activityNumber) {
            case 1: return "Hoạt động 1: Mở đầu (Xác định vấn đề/nhiệm vụ học tập)";
            case 2: return "Hoạt động 2: Hình thành kiến thức mới";
            case 3: return "Hoạt động 3: Luyện tập";
            case 4: return "Hoạt động 4: Vận dụng";
            default: return `Hoạt động ${activityNumber}`;
        }
    } else {
        switch (activityNumber) {
            case 1: return "Activity 1: Introduction (Identify problem/learning task)";
            case 2: return "Activity 2: New Knowledge Formation";
            case 3: return "Activity 3: Practice";
            case 4: return "Activity 4: Application";
            default: return `Activity ${activityNumber}`;
        }
    }
};

const ActivitySection5512: React.FC<{ title: string; activity: GeneratedLessonPlan5512['tienTrinh'][string]; t: any }> = React.memo(({ title, activity, t }) => {
    if (!activity) return null;
    return (
        <div className="mt-6 break-inside-avoid">
            <h4 className="text-lg font-bold text-slate-800 border-b-2 border-sky-500/30 pb-2 mb-3">{title}</h4>
            <div className="space-y-3 pl-4 text-sm text-slate-700">
                {activity.mucTieu && <div><strong>a) {t.actObjective}:</strong> <MarkdownRenderer content={activity.mucTieu} /></div>}
                {activity.noiDung && <div><strong>b) {t.actContent}:</strong> <MarkdownRenderer content={activity.noiDung} className="prose prose-sm max-w-none"/></div>}
                {activity.sanPham && <div><strong>c) {t.actProduct}:</strong> <MarkdownRenderer content={activity.sanPham} className="prose prose-sm max-w-none"/></div>}
                {activity.toChuc && <p className="font-semibold mt-2">d) {t.actOrganization}:</p>}
                
                {activity.toChuc && <div className="border border-gray-200 rounded-lg overflow-hidden mt-2 shadow-sm ring-1 ring-black/5">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-slate-100/80 text-left">
                            <tr>
                                <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">{t.actTeacherStudent}</th>
                                <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">{t.actExpectedProduct}</th>
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
const ActivitySection958: React.FC<{ title: string; activity: GeneratedLessonPlan958['tienTrinh'][string]; t: any }> = React.memo(({ title, activity, t }) => {
    if (!activity) return null;
    return (
        <div className="mt-6 break-inside-avoid">
            <h4 className="text-lg font-bold text-slate-800 border-b-2 border-sky-500/30 pb-2 mb-3">{title}</h4>
            <div className="space-y-3 pl-4 text-sm text-slate-700">
                {activity.mucTieu && <div><strong>a) {t.actObjective}:</strong> <MarkdownRenderer content={activity.mucTieu} /></div>}
                {activity.noiDung && <div><strong>b) {t.actContent}:</strong> <MarkdownRenderer content={activity.noiDung} className="prose prose-sm max-w-none"/></div>}
                {activity.sanPham && <div><strong>c) {t.actProduct}:</strong> <MarkdownRenderer content={activity.sanPham} className="prose prose-sm max-w-none"/></div>}
                {activity.toChucThucHien && <div><strong>d) {t.actOrganization}:</strong> <MarkdownRenderer content={activity.toChucThucHien} className="prose prose-sm max-w-none"/></div>}
            </div>
        </div>
    );
});
// --- End: CV 958 specific components ---

const LessonPlanDisplayComponent: React.FC<LessonPlanDisplayProps> = ({ plan, basicInfo, isLoading, isComplete, generationStatus, lang }) => {
    const [copied, setCopied] = useState(false);
    const t = translations[lang];
    
    const displayDuration = plan.duration || (basicInfo.duration.periods ? `${basicInfo.duration.periods} ${lang === 'vi' ? 'tiết' : 'periods'}` : '(AI suggest)');
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
        const lessonTitle = basicInfo.lessonTitle || plan.lessonTitle || '(No title)';
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
            return `${t.integratedEdu}:\n` + parts.join('\n');
        };

        if (plan.congVan === '2345') {
            const formatActivity = (activity: Activity2345) => 
                `${t.activitiesMain}:\n${activity.hoatDong || ''}\n\n${t.actRequirement}:\n${activity.yeuCau || ''}\n\n${t.actAdjustment}:\n${activity.dieuChinh || ''}`;
            
            const formatYeuCauCanDat = (yc: GeneratedLessonPlan2345['yeuCauCanDat'] | undefined) => {
                if (!yc) return '';
                const parts = [
                    yc.phamChat ? `${t.quality}: ${yc.phamChat}` : '',
                    yc.nangLuc ? `${t.competence}: ${yc.nangLuc}` : '',
                ].filter(Boolean);
                if (parts.length === 0) return '';
                return `I. ${t.requirements}\n` + parts.join('\n');
            }

            sections = [
                `KẾ HOẠCH BÀI DẠY (GIÁO ÁN - CÔNG VĂN 2345)`,
                `Môn học/Hoạt động giáo dục: ${displaySubject}`,
                `Lớp: ${displayGrade}`,
                `Tên bài dạy: ${lessonTitle}`,
                `Thời gian thực hiện: ${displayDuration}\n`,
                formatYeuCauCanDat(plan.yeuCauCanDat),
                `\nII. ${t.materials}\n${plan.doDungDayHoc || ''}\n`,
                `III. ${t.activities}\n` + (plan.hoatDongDayHoc || []).map(formatActivity).join('\n\n---\n\n'),
                plan.dieuChinhSauBaiDay ? `\nIV. ${t.reflection}\n${plan.dieuChinhSauBaiDay}` : ''
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
                return `I. ${t.requirements}\n` + parts.join('\n');
            }
             const formatDoDung = (dd: GeneratedLessonPlan1001['doDungDayHoc'] | undefined) => {
                if (!dd) return '';
                 const parts = [
                    dd.giaoVien ? `1. Giáo viên: ${dd.giaoVien}` : '',
                    dd.hocSinh ? `2. Học sinh: ${dd.hocSinh}` : '',
                 ].filter(Boolean);
                 if (parts.length === 0) return '';
                 return `II. ${t.materials}\n` + parts.join('\n');
            }
            const formatActivities = (activities: Activity1001[] | undefined) => {
                if (!activities || activities.length === 0) return '';
                return activities.map(act => 
                    `${act.tenHoatDong}\n` +
                    `a) ${t.actObjective}: ${act.mucTieu}\n\n` +
                    `b) Cách tổ chức dạy học:\n`+
                    `-- ${t.actTeacher} --\n${act.cachToChucGiaoVien}\n\n` +
                    `-- ${t.actStudent} --\n${act.hoatDongHocSinh}`
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
                `III. ${t.activitiesMain}\n` + formatActivities(plan.hoatDongDayHoc),
                plan.dieuChinhSauBaiDay ? `\nIV. ${t.reflection}\n${plan.dieuChinhSauBaiDay}` : ''
            ];
        } else if (plan.congVan === '958') {
            const formatActivity = (title: string, activity: any) => [
                title,
                `a) ${t.actObjective}: ${activity?.mucTieu || ''}`,
                `b) ${t.actContent}: ${activity?.noiDung || ''}`,
                `c) ${t.actProduct}: ${activity?.sanPham || ''}`,
                `d) ${t.actOrganization}: ${activity?.toChucThucHien || ''}`,
            ].join('\n');
            
            const activityKeys = plan.tienTrinh ? Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))) : [];
            const activityText = activityKeys.map((key) => formatActivity(getActivityTitle5512(key, lang), plan.tienTrinh?.[key])).join('\n\n');

            sections = [
                `KẾ HOẠCH BÀI DẠY (GIÁO ÁN - CÔNG VĂN 958)`,
                `Môn học/Hoạt động giáo dục: ${displaySubject}`,
                `Lớp: ${displayGrade}`,
                `Tên bài dạy: ${lessonTitle}`,
                `Thời gian thực hiện: ${displayDuration}`,
                `Giáo viên: ${basicInfo.teacherName}\n`,
                `I. ${t.objectives}`,
                `1. ${t.knowledge}: ${plan.mucTieu?.kienThuc || ''}`,
                `2. ${t.competence}: ${plan.mucTieu?.nangLuc || ''}`,
                `3. ${t.quality}: ${plan.mucTieu?.phamChat || ''}`,
                `\nII. ${t.materials}`,
                `${plan.thietBi || ''}\n`,
                `III. ${t.activities}`,
                activityText,
            ];
        } else { // 5512
            const formatActivity = (title: string, activity: GeneratedLessonPlan5512['tienTrinh'][string]) => [
                title,
                `a) ${t.actObjective}: ${activity?.mucTieu || ''}`,
                `b) ${t.actContent}: ${activity?.noiDung || ''}`,
                `c) ${t.actProduct}: ${activity?.sanPham || ''}`,
                `d) ${t.actOrganization}:`,
                `  - ${t.actTeacherStudent}: ${activity?.toChuc?.noiDung || ''}`,
                `  - ${t.actExpectedProduct}: ${activity?.toChuc?.sanPham || ''}`,
            ].join('\n');
            
            const activityKeys = plan.tienTrinh ? Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))) : [];
            const activityText = activityKeys.map((key) => formatActivity(getActivityTitle5512(key, lang), plan.tienTrinh?.[key])).join('\n\n');

            sections = [
                `KẾ HOẠCH BÀI DẠY (GIÁO ÁN - CÔNG VĂN 5512)`,
                `Môn học/Hoạt động giáo dục: ${displaySubject}`,
                `Lớp: ${displayGrade}`,
                `Tên bài dạy: ${lessonTitle}`,
                `Thời gian thực hiện: ${displayDuration}`,
                `Giáo viên: ${basicInfo.teacherName}\n`,
                `I. ${t.objectives}`,
                `1. ${t.knowledge}: ${plan.mucTieu?.kienThuc || ''}`,
                `2. ${t.competence}: ${plan.mucTieu?.nangLuc || ''}`,
                `3. ${t.quality}: ${plan.mucTieu?.phamChat || ''}`,
                formatGiaoDucTichHop(plan.giaoDucTichHop),
                `\nII. ${t.materials}`,
                `${plan.thietBi || ''}\n`,
                `III. ${t.activities}`,
                activityText,
            ];
        }
        return sections.filter(Boolean).join('\n');
    }, [plan, basicInfo, displayDuration, displaySubject, displayGrade, lang, t]);


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
          h1 { font-size: 16pt; text-align: center; font-weight: bold; margin-bottom: 20px; }
          h3 { font-size: 14pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
          h4 { font-size: 13pt; font-weight: bold; margin-top: 15px; margin-bottom: 10px; }
          p, div, li { margin-bottom: 5px; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; page-break-inside: avoid; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #f2f2f2; font-weight: bold; }
          ul, ol { padding-left: 40px; margin: 0; }
        `;
        
        const lessonTitle = basicInfo.lessonTitle || plan.lessonTitle || '(No title)';
        let contentHtml = '';

        if (plan.congVan === '2345') {
             contentHtml += `<h1>KẾ HOẠCH BÀI DẠY (CÔNG VĂN 2345)</h1>`;
             contentHtml += `<p><strong>Môn học:</strong> ${displaySubject}</p>`;
             contentHtml += `<p><strong>Lớp:</strong> ${displayGrade}</p>`;
             contentHtml += `<p><strong>Tên bài dạy:</strong> ${lessonTitle}</p>`;
             contentHtml += `<p><strong>Thời gian thực hiện:</strong> ${displayDuration}</p><hr/>`;
             
             if (plan.yeuCauCanDat) {
                 contentHtml += `<h3>I. ${t.requirements}</h3>`;
                 if (plan.yeuCauCanDat.phamChat) contentHtml += `<p><strong>${t.quality}:</strong> ${mdToHtml(plan.yeuCauCanDat.phamChat)}</p>`;
                 if (plan.yeuCauCanDat.nangLuc) contentHtml += `<p><strong>${t.competence}:</strong> ${mdToHtml(plan.yeuCauCanDat.nangLuc)}</p>`;
             }
             if (plan.doDungDayHoc) {
                 contentHtml += `<h3>II. ${t.materials}</h3>`;
                 contentHtml += mdToHtml(plan.doDungDayHoc);
             }
             if (plan.hoatDongDayHoc && plan.hoatDongDayHoc.length > 0) {
                 contentHtml += `<h3>III. ${t.activities}</h3>`;
                 contentHtml += `<table><thead><tr><th>${t.activitiesMain}</th><th>${t.actRequirement}</th><th>${t.actAdjustment}</th></tr></thead><tbody>`;
                 plan.hoatDongDayHoc.forEach(act => {
                     contentHtml += `<tr><td>${mdToHtml(act.hoatDong)}</td><td>${mdToHtml(act.yeuCau)}</td><td>${mdToHtml(act.dieuChinh)}</td></tr>`;
                 });
                 contentHtml += `</tbody></table>`;
             }
             if (plan.dieuChinhSauBaiDay) {
                 contentHtml += `<h3>IV. ${t.reflection}</h3>`;
                 contentHtml += mdToHtml(plan.dieuChinhSauBaiDay);
             }

        } else if (plan.congVan === '1001') {
             contentHtml += `<h1>KẾ HOẠCH BÀI DẠY (CÔNG VĂN 1001)</h1>`;
             contentHtml += `<p><strong>Môn học:</strong> ${displaySubject}</p>`;
             contentHtml += `<p><strong>Lớp:</strong> ${displayGrade}</p>`;
             contentHtml += `<p><strong>Tên bài dạy:</strong> ${lessonTitle}</p>`;
             contentHtml += `<p><strong>Thời gian thực hiện:</strong> ${displayDuration}</p><hr/>`;
             
             if (plan.yeuCauCanDat) {
                contentHtml += `<h3>I. ${t.requirements}</h3>`;
                if(plan.yeuCauCanDat.nangLucChung) contentHtml += `<p><strong>1. Năng lực chung:</strong> ${mdToHtml(plan.yeuCauCanDat.nangLucChung)}</p>`;
                if(plan.yeuCauCanDat.nangLucDacThu) contentHtml += `<p><strong>2. Năng lực đặc thù:</strong> ${mdToHtml(plan.yeuCauCanDat.nangLucDacThu)}</p>`;
                if(plan.yeuCauCanDat.phamChat) contentHtml += `<p><strong>3. Phẩm chất:</strong> ${mdToHtml(plan.yeuCauCanDat.phamChat)}</p>`;
                if(plan.yeuCauCanDat.noiDungTichHop) contentHtml += `<p><strong>4. Nội dung tích hợp:</strong> ${mdToHtml(plan.yeuCauCanDat.noiDungTichHop)}</p>`;
             }
             if (plan.doDungDayHoc) {
                 contentHtml += `<h3>II. ${t.materials}</h3>`;
                 if(plan.doDungDayHoc.giaoVien) contentHtml += `<p><strong>1. Giáo viên:</strong> ${mdToHtml(plan.doDungDayHoc.giaoVien)}</p>`;
                 if(plan.doDungDayHoc.hocSinh) contentHtml += `<p><strong>2. Học sinh:</strong> ${mdToHtml(plan.doDungDayHoc.hocSinh)}</p>`;
             }
             if (plan.hoatDongDayHoc && plan.hoatDongDayHoc.length > 0) {
                 contentHtml += `<h3>III. ${t.activitiesMain}</h3>`;
                 plan.hoatDongDayHoc.forEach(act => {
                     contentHtml += `<h4>${act.tenHoatDong}</h4>`;
                     contentHtml += `<p><strong>a) ${t.actObjective}:</strong> ${mdToHtml(act.mucTieu)}</p>`;
                     contentHtml += `<p><strong>b) Cách tổ chức dạy học:</strong></p>`;
                     contentHtml += `<table><thead><tr><th>${t.actTeacher}</th><th>${t.actStudent}</th></tr></thead><tbody>`;
                     contentHtml += `<tr><td>${mdToHtml(act.cachToChucGiaoVien)}</td><td>${mdToHtml(act.hoatDongHocSinh)}</td></tr>`;
                     contentHtml += `</tbody></table>`;
                 });
             }
              if (plan.dieuChinhSauBaiDay) {
                 contentHtml += `<h3>IV. ${t.reflection}</h3>`;
                 contentHtml += mdToHtml(plan.dieuChinhSauBaiDay);
             }

        } else if (plan.congVan === '958') {
             contentHtml += `<h1>KẾ HOẠCH BÀI DẠY (CÔNG VĂN 958)</h1>`;
             contentHtml += `<p><strong>Môn học:</strong> ${displaySubject}</p>`;
             contentHtml += `<p><strong>Lớp:</strong> ${displayGrade}</p>`;
             contentHtml += `<p><strong>Tên bài dạy:</strong> ${lessonTitle}</p>`;
             contentHtml += `<p><strong>Thời gian thực hiện:</strong> ${displayDuration}</p>`;
             contentHtml += `<p><strong>Giáo viên:</strong> ${basicInfo.teacherName}</p><hr/>`;
             
             if (plan.mucTieu) {
                 contentHtml += `<h3>I. ${t.objectives}</h3>`;
                 if(plan.mucTieu.kienThuc) contentHtml += `<p><strong>1. ${t.knowledge}:</strong> ${mdToHtml(plan.mucTieu.kienThuc)}</p>`;
                 if(plan.mucTieu.nangLuc) contentHtml += `<p><strong>2. ${t.competence}:</strong> ${mdToHtml(plan.mucTieu.nangLuc)}</p>`;
                 if(plan.mucTieu.phamChat) contentHtml += `<p><strong>3. ${t.quality}:</strong> ${mdToHtml(plan.mucTieu.phamChat)}</p>`;
             }
             if (plan.thietBi) {
                 contentHtml += `<h3>II. ${t.materials}</h3>`;
                 contentHtml += mdToHtml(plan.thietBi);
             }
             if (plan.tienTrinh) {
                 contentHtml += `<h3>III. ${t.activities}</h3>`;
                 const activityKeys = Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', '')));
                 activityKeys.forEach(key => {
                     const act = plan.tienTrinh![key];
                     const title = getActivityTitle5512(key, lang);
                     contentHtml += `<h4>${title}</h4>`;
                     if(act.mucTieu) contentHtml += `<p><strong>a) ${t.actObjective}:</strong> ${mdToHtml(act.mucTieu)}</p>`;
                     if(act.noiDung) contentHtml += `<p><strong>b) ${t.actContent}:</strong> ${mdToHtml(act.noiDung)}</p>`;
                     if(act.sanPham) contentHtml += `<p><strong>c) ${t.actProduct}:</strong> ${mdToHtml(act.sanPham)}</p>`;
                     if(act.toChucThucHien) contentHtml += `<p><strong>d) ${t.actOrganization}:</strong> ${mdToHtml(act.toChucThucHien)}</p>`;
                 });
             }
        } else { // 5512
             contentHtml += `<h1>KẾ HOẠCH BÀI DẠY (CÔNG VĂN 5512)</h1>`;
             contentHtml += `<p><strong>Môn học:</strong> ${displaySubject}</p>`;
             contentHtml += `<p><strong>Lớp:</strong> ${displayGrade}</p>`;
             contentHtml += `<p><strong>Tên bài dạy:</strong> ${lessonTitle}</p>`;
             contentHtml += `<p><strong>Thời gian thực hiện:</strong> ${displayDuration}</p>`;
             contentHtml += `<p><strong>Giáo viên:</strong> ${basicInfo.teacherName}</p><hr/>`;
             
             if (plan.mucTieu) {
                 contentHtml += `<h3>I. ${t.objectives}</h3>`;
                 if(plan.mucTieu.kienThuc) contentHtml += `<p><strong>1. ${t.knowledge}:</strong> ${mdToHtml(plan.mucTieu.kienThuc)}</p>`;
                 if(plan.mucTieu.nangLuc) contentHtml += `<p><strong>2. ${t.competence}:</strong> ${mdToHtml(plan.mucTieu.nangLuc)}</p>`;
                 if(plan.mucTieu.phamChat) contentHtml += `<p><strong>3. ${t.quality}:</strong> ${mdToHtml(plan.mucTieu.phamChat)}</p>`;
                 if(plan.giaoDucTichHop) {
                     contentHtml += `<p><strong>${t.integratedEdu}:</strong></p>`;
                     if(plan.giaoDucTichHop.kyNangSong) contentHtml += `<p>- Kỹ năng sống: ${mdToHtml(plan.giaoDucTichHop.kyNangSong)}</p>`;
                     if(plan.giaoDucTichHop.quocPhongAnNinh) contentHtml += `<p>- Quốc phòng - An ninh: ${mdToHtml(plan.giaoDucTichHop.quocPhongAnNinh)}</p>`;
                     if(plan.giaoDucTichHop.baoVeMoiTruong) contentHtml += `<p>- Bảo vệ môi trường: ${mdToHtml(plan.giaoDucTichHop.baoVeMoiTruong)}</p>`;
                     if(plan.giaoDucTichHop.congDanSo) contentHtml += `<p>- Công dân số: ${mdToHtml(plan.giaoDucTichHop.congDanSo)}</p>`;
                 }
             }
             if (plan.thietBi) {
                 contentHtml += `<h3>II. ${t.materials}</h3>`;
                 contentHtml += mdToHtml(plan.thietBi);
             }
             if (plan.tienTrinh) {
                 contentHtml += `<h3>III. ${t.activities}</h3>`;
                 const activityKeys = Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', '')));
                 activityKeys.forEach(key => {
                     const act = plan.tienTrinh![key];
                     const title = getActivityTitle5512(key, lang);
                     contentHtml += `<h4>${title}</h4>`;
                     if(act.mucTieu) contentHtml += `<p><strong>a) ${t.actObjective}:</strong> ${mdToHtml(act.mucTieu)}</p>`;
                     if(act.noiDung) contentHtml += `<p><strong>b) ${t.actContent}:</strong> ${mdToHtml(act.noiDung)}</p>`;
                     if(act.sanPham) contentHtml += `<p><strong>c) ${t.actProduct}:</strong> ${mdToHtml(act.sanPham)}</p>`;
                     if(act.toChuc) {
                         contentHtml += `<p><strong>d) ${t.actOrganization}:</strong></p>`;
                         contentHtml += `<table><thead><tr><th>${t.actTeacherStudent}</th><th>${t.actExpectedProduct}</th></tr></thead><tbody>`;
                         contentHtml += `<tr><td>${mdToHtml(act.toChuc.noiDung)}</td><td>${mdToHtml(act.toChuc.sanPham)}</td></tr>`;
                         contentHtml += `</tbody></table>`;
                     }
                 });
             }
        }

        return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${lessonTitle}</title><style>${styles}</style></head><body>${contentHtml}</body></html>`;
    }, [basicInfo, plan, displayDuration, displayGrade, displaySubject, lang, t]);

    const handleDownload = () => {
        const html = generateHtmlForDoc();
        if (typeof htmlDocx !== 'undefined' && typeof saveAs !== 'undefined') {
             const converted = htmlDocx.asBlob(html, { orientation: 'portrait' });
             saveAs(converted, `${basicInfo.lessonTitle || 'Giao_an'}.docx`);
        } else {
            console.error('Download libraries not loaded');
        }
    };

    if (!plan) return null;

    return (
        <article className="prose max-w-none relative text-slate-700">
            <div className="absolute top-0 right-0 flex items-center -mt-2 space-x-1">
                <button onClick={handleDownload} disabled={isLoading || !isComplete} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-200/50 rounded-full transition-colors disabled:text-slate-400 disabled:cursor-not-allowed" title={t.download}><DownloadIcon className="w-5 h-5" /></button>
                <button onClick={handleCopy} disabled={isLoading || !isComplete} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-200/50 rounded-full transition-colors disabled:text-slate-400 disabled:cursor-not-allowed" title={t.copy}>{copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5" />}</button>
            </div>
            
            <div className="text-center mb-8 not-prose">
                <h3 className="text-xl font-bold uppercase text-slate-900">KẾ HOẠCH BÀI DẠY</h3>
                <p className="font-semibold text-slate-700">{t.subject}: {displaySubject} - {t.grade}: {displayGrade}</p>
                <p className="text-lg font-bold mt-2 text-sky-600">{t.lessonTitle}: {basicInfo.lessonTitle || plan.lessonTitle}</p>
                <p className="text-sm text-slate-500">{t.duration}: {displayDuration}</p>
            </div>

            {plan.congVan === '2345' ? (
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.yeuCauCanDat && (plan.yeuCauCanDat.phamChat || plan.yeuCauCanDat.nangLuc) && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. {t.requirements}</h3>
                        {plan.yeuCauCanDat.phamChat && (
                            <div className="mt-2">
                                <strong className="text-slate-800">{t.quality}:</strong>
                                <MarkdownRenderer content={plan.yeuCauCanDat.phamChat} className="prose prose-sm max-w-none mt-1" />
                            </div>
                        )}
                        {plan.yeuCauCanDat.nangLuc && (
                            <div className="mt-3">
                                <strong className="text-slate-800">{t.competence}:</strong>
                                <MarkdownRenderer content={plan.yeuCauCanDat.nangLuc} className="prose prose-sm max-w-none mt-1" />
                            </div>
                        )}
                    </>}
                    
                    {plan.doDungDayHoc && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. {t.materials}</h3>
                        <MarkdownRenderer content={plan.doDungDayHoc} className="prose prose-sm max-w-none" />
                    </>}
                    
                    {plan.hoatDongDayHoc && plan.hoatDongDayHoc.length > 0 && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. {t.activities}</h3>
                        <div className="not-prose mt-4 ring-1 ring-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-100/80 text-left">
                                    <tr>
                                        <th className="p-3 font-semibold text-slate-700 w-5/12 border-b border-gray-300">{t.activitiesMain}</th>
                                        <th className="p-3 font-semibold text-slate-700 w-5/12 border-b border-gray-300">{t.actRequirement}</th>
                                        <th className="p-3 font-semibold text-slate-700 w-2/12 border-b border-gray-300">{t.actAdjustment}</th>
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
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">IV. {t.reflection}</h3>
                        <MarkdownRenderer content={plan.dieuChinhSauBaiDay} className="prose prose-sm max-w-none" />
                    </>}
                </div>
            ) : plan.congVan === '1001' ? (
                 <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.yeuCauCanDat && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. {t.requirements}</h3>
                        {plan.yeuCauCanDat.nangLucChung && <div className="mt-2"><strong>1. Năng lực chung:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.nangLucChung} /></div>}
                        {plan.yeuCauCanDat.nangLucDacThu && <div className="mt-2"><strong>2. Năng lực đặc thù:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.nangLucDacThu} /></div>}
                        {plan.yeuCauCanDat.phamChat && <div className="mt-2"><strong>3. Phẩm chất:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.phamChat} /></div>}
                        {plan.yeuCauCanDat.noiDungTichHop && <div className="mt-2"><strong>4. Nội dung tích hợp:</strong> <MarkdownRenderer content={plan.yeuCauCanDat.noiDungTichHop} /></div>}
                    </>}

                    {plan.doDungDayHoc && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. {t.materials}</h3>
                        {plan.doDungDayHoc.giaoVien && <div className="mt-2"><strong>1. Giáo viên:</strong> <MarkdownRenderer content={plan.doDungDayHoc.giaoVien} /></div>}
                        {plan.doDungDayHoc.hocSinh && <div className="mt-2"><strong>2. Học sinh:</strong> <MarkdownRenderer content={plan.doDungDayHoc.hocSinh} /></div>}
                    </>}
                    
                    {plan.hoatDongDayHoc && plan.hoatDongDayHoc.length > 0 && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. {t.activitiesMain}</h3>
                        <div className="not-prose mt-4 ring-1 ring-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-100/80 text-left">
                                    <tr>
                                        <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">{t.actTeacher}</th>
                                        <th className="p-3 font-semibold text-slate-700 w-1/2 border-b border-gray-300">{t.actStudent}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {plan.hoatDongDayHoc.map((act, index) => (
                                       <React.Fragment key={index}>
                                            <tr className={`align-top ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                                                <td className="p-3">
                                                    <p className="font-bold text-slate-800">{act.tenHoatDong}:</p>
                                                    <p className="mt-2"><strong>a) {t.actObjective}:</strong> <MarkdownRenderer content={act.mucTieu} /></p>
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
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">IV. {t.reflection}</h3>
                        <MarkdownRenderer content={plan.dieuChinhSauBaiDay} className="prose prose-sm max-w-none" />
                    </>}
                </div>
            ) : plan.congVan === '958' ? (
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.mucTieu && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. {t.objectives}</h3>
                        <div><strong>1. {t.knowledge}:</strong> <MarkdownRenderer content={plan.mucTieu.kienThuc} /></div>
                        <div><strong>2. {t.competence}:</strong> <MarkdownRenderer content={plan.mucTieu.nangLuc} /></div>
                        <div><strong>3. {t.quality}:</strong> <MarkdownRenderer content={plan.mucTieu.phamChat} /></div>
                    </>}
                    
                    {plan.thietBi && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. {t.materials}</h3>
                        <div className="prose prose-sm max-w-none"><MarkdownRenderer content={plan.thietBi} /></div>
                    </>}
                    
                    {plan.tienTrinh && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. {t.activities}</h3>
                        {Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))).map((key) => (
                            <ActivitySection958
                                key={key} 
                                title={getActivityTitle5512(key, lang)} 
                                activity={plan.tienTrinh?.[key]} 
                                t={t}
                            />
                        ))}
                    </>}
                </div>
            ) : ( // 5512 layout
                <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                    {plan.mucTieu && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">I. {t.objectives}</h3>
                        <div><strong>1. {t.knowledge}:</strong> <MarkdownRenderer content={plan.mucTieu.kienThuc} /></div>
                        <div><strong>2. {t.competence}:</strong> <MarkdownRenderer content={plan.mucTieu.nangLuc} /></div>
                        <div><strong>3. {t.quality}:</strong> <MarkdownRenderer content={plan.mucTieu.phamChat} /></div>
                        <IntegratedEducationSection data={plan.giaoDucTichHop} t={t} />
                    </>}
                    
                    {plan.thietBi && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">II. {t.materials}</h3>
                        <div className="prose prose-sm max-w-none"><MarkdownRenderer content={plan.thietBi} /></div>
                    </>}
                    
                    {plan.tienTrinh && <>
                        <h3 className="text-xl font-bold text-slate-800 mt-6 border-b border-gray-200 pb-2">III. {t.activities}</h3>
                        {Object.keys(plan.tienTrinh).sort((a, b) => parseInt(a.replace('hoatDong', '')) - parseInt(b.replace('hoatDong', ''))).map((key) => (
                            <ActivitySection5512
                                key={key} 
                                title={getActivityTitle5512(key, lang)} 
                                activity={plan.tienTrinh?.[key]} 
                                t={t}
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
                        <span>{t.completed}</span>
                     </div>
                )}
            </div>
        </article>
    );
};

export const LessonPlanDisplay = React.memo(LessonPlanDisplayComponent);
