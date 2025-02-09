import multer from "multer";
import path from "path";

// Xử lý tên file và đuôi mở rộng
const storage = multer.diskStorage({
  // Xữ lý nơi lưu trữ file
  destination: function (req, file, cb) {
    // có req và file để xử lý logic tạo ra folder muốn lưu trữ (file: imag, docx, excel, pdff, ...)
    cb(null, "images/");
  },

  // Xữ lý tên file
  filename: function (req, file, cb) {
    // uniqueSuffix ~~ cái này để tên file không bao giờ trùng nhau
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // fileExtension (đuôi mở rộng của file)
    const fileExtension = path.extname(file.originalname);

    const fileNameString =
      "local-" + file.fieldnamexxxx + "-" + uniqueSuffix + fileExtension;
    cb(null, fileNameString);
  },
});

const uploadLocal = multer({
  storage: storage,
  //1MB
  limits: 1 * 1024 * 1024,
});

export default uploadLocal;
