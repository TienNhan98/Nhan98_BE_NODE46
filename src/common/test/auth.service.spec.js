import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import authService from "../../services/auth.service.js";
import prisma from "../prisma/init.prisma.js";
import { REGEX_EMAIL } from "../constant/app.constant.js";

// describe: tiêu đề, gom nhóm các case ( trường hợp)
// it: cụ thể một test

// beforeEach: chạy trước mỗi lần hàm IT chạy,, thường dùng để khởi tạo dữ liệu đầu vào

// afterEach: chạy sau mỗi lần hàm IT chạy,, thường dùng để làm mới lại dữ liệu

describe("Auth Service", () => {
  beforeEach(() => {
    // console.log("before chay");
    jest.spyOn(prisma.users, "create");
    jest.spyOn(prisma.users, "findFirst");
  });

  afterEach(() => {
    // console.log("affter chay");
    jest.restoreAllMocks();
  });

  it("Case 1: Trường hợp đăng kí thành công", async () => {
    // giả lập dữ liệu đầu ra của 2 hàm findFirst và create với trường hợp thông tin hợp lệ

    await prisma.users.findFirst.mockResolvedValue(undefined);

    await prisma.users.create.mockResolvedValue({
      user_id: 15,
      email: "tientrivutru@email.com",
      full_name: "Tien tri vu tru",
      avatar: null,
      goole_id: null,
      face_app_id: null,
      created_at: "2025-01-22T14:39:31.000Z",
      updated_at: "2025-01-22T14:39:31.000Z",
      role_id: 2,
    });

    const req = {
      body: {
        full_name: "Tien tri vu tru",
        email: "tientrivutru@email.com",
        pass_word: "1234",
      },
    };
    const userNew = await authService.register(req);
    console.log("📢[auth.service.spec.js:29]: userNew: ", userNew);

    // kiểm tra kết quả
    expect(userNew).not.toHaveProperty("pass_word"); // không được có key pass_word
    expect(typeof userNew.email).toBe("string"); // email phải là chuỗi
    expect(REGEX_EMAIL.test(userNew.email)).toBe(true); // email phải đúng định dạng
    // console.log("case1");
  });

  it("Case 2: Trường hợp đăng kí, email đã tồn tại, cần phải báo lỗi", () => {
    // console.log("case2");
  });
});
