import multer from "multer";

// multer.memoryStorage(): lưu tạm buffer(data hình ảnh) vào trong RAM rồi mới đưa buffer đó lên cloud
// tự giải phòng RAM sau khi kết thúc API
const uploadCloud = multer({
  storage: multer.memoryStorage(),
  //1MB
  limits: 1 * 1024 * 1024,
});

export default uploadCloud;
