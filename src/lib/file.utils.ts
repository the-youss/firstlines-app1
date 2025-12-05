import { FileType, FileTypeEnum } from "@/services/documents/document.types";

export const getFileType = (file: File): FileType => {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop() || '';

  // Check by MIME type first (more reliable)
  if (mimeType === 'application/pdf') return FileTypeEnum.PDF;
  if (mimeType === 'text/csv' || mimeType === 'application/csv') return FileTypeEnum.CSV;
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return FileTypeEnum.DOCX;
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return FileTypeEnum.XLSX;
  if (mimeType === 'text/plain') return FileTypeEnum.TXT;

  // Fallback to file extension if MIME type is not recognized
  switch (fileExtension) {
    case 'pdf':
      return FileTypeEnum.PDF;
    case 'csv':
      return FileTypeEnum.CSV;
    case 'docx':
      return FileTypeEnum.DOCX;
    case 'xlsx':
      return FileTypeEnum.XLSX;
    case 'txt':
      return FileTypeEnum.TXT;
    default:
      // Default to txt for unknown types
      return FileTypeEnum.TXT;
  }
};