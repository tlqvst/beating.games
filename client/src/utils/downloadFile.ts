export const downloadFileAsBlob = (fileName: string, data: string) => {
  const blob = new Blob([data], { type: 'text/plain' });
  const element = window.document.createElement('a');
  element.href = window.URL.createObjectURL(blob);
  element.download = fileName;
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
