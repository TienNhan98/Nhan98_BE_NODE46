export const responseSuccess = (
  metaData = null,
  message = `Ok`,
  code = 200
) => {
  // lưu ý là nên có thêm dòng lệnh if này để mặc định code nó thành thành number.
  if (typeof code !== "number") code = 200;
  return {
    status: `success`,
    code: code,
    message: message,
    metaData: metaData,
    doc: `api.domain.com/doc`,
  };
};

export const responseError = (
  message = "Server lỗi",
  code = 500,
  stack = null
) => {
  if (typeof code !== "number") code = 500;
  return {
    status: "Error",
    code: code,
    message: message,
    stack: stack,
    doc: `api.domain.com/doc`,
  };
};
