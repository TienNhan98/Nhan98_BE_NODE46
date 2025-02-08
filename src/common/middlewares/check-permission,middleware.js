import { BadRequestException } from "../helper/error.helper.js";
import prisma from "../prisma/init.prisma.js";

const checkPermission = async (req, res, next) => {
  try {
    // Gom dữ liệu cần thiết để kiểm tra permission

    const user = req.user;

    const role_id = user.role_id;

    const baseUrl = req.baseUrl;

    const routePath = req.route.path;

    const fullPath = `${baseUrl}${routePath}`;

    const method = req.method;

    console.log({
      role_id,
      fullPath,
      method,
    });
    // Đi tìm id của permission thông qua fullPath, method
    const permission = await prisma.permissions.findFirst({
      where: {
        endpoint: fullPath,
        method: method,
      },
    });

    const rolePermission = await prisma.role_permissions.findFirst({
      where: {
        permission_id: permission.permission_id,
        role_id: role_id,
        is_active: true,
      },
    });

    // console.log({ rolePermission });

    if (!rolePermission)
      throw new BadRequestException(
        `Bạn không đủ quyền sử dụng tài nguyên (API) này`
      );

    next();
  } catch (error) {
    next(error);
  }
};
export default checkPermission;
