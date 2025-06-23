export const getFileType = (mimetype: string) => {
  if (/^image\//.test(mimetype)) {
    return 'images';
  } else if (/^video\//.test(mimetype)) {
    return 'videos';
  }
  throw new Error('Định dạng tệp không được hỗ trợ');
};
