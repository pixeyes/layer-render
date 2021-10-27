export const dataURIToBlob = (uri:string): Blob => {
  const parts = uri.split(",");
  const binary = atob(parts[1]);
  const type = parts[0];
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new window.Uint8Array(array).buffer], { type: type });
};
