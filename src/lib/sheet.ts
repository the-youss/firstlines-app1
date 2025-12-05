import * as iconv from 'iconv-lite';
import * as XLSX from 'xlsx';

export const csvBufferToJson = <T = any>(buffer: Buffer): T[] => {
  const utf8Buffer = iconv.decode(buffer, 'utf-8');
  const workbook = XLSX.read(utf8Buffer, {
    type: 'string',
    raw: true,
  });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: false,
  });
  return jsonData as T[];
};